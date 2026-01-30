import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

// Configuration de l'email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fonction avec retry pour les opérations Firestore
async function firestoreOperationWithRetry(operation, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retry attempt ${attempt + 1}`);
      }
    }
  }
  throw lastError;
}

// Générer un code OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Vérifier si un code est expiré
const isCodeExpired = (timestamp) => {
  const now = Date.now();
  const expirationTime = 5 * 60 * 1000;
  return now - timestamp > expirationTime;
};

export async function POST(request) {
  try {
    const { email, action, code, newPassword } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    console.log("Traitement de la demande pour:", email);

    // Rechercher l'utilisateur par email avec retry
    const snapshot = await firestoreOperationWithRetry(async () => {
      const usersRef = adminDb.collection('users');
      return await usersRef
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();
    });

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Aucun compte associé à cet email' },
        { status: 404 }
      );
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log("Utilisateur trouvé:", userId);

    // Action 1: Demander ou renvoyer un code
    if (action === 'request' || action === 'resend') {
      const resetRef = adminDb.collection('passwordResets').doc(userId);
      
      // Vérifier si un code existe déjà
      const resetDoc = await firestoreOperationWithRetry(async () => {
        return await resetRef.get();
      });

      let codeToSend;
      
      if (resetDoc.exists) {
        const resetData = resetDoc.data();
        
        // Réutiliser un code non expiré
        if (!isCodeExpired(resetData.createdAt)) {
          codeToSend = resetData.code;
          console.log("Code existant réutilisé:", codeToSend);
        } else {
          // Supprimer le code expiré
          await firestoreOperationWithRetry(async () => {
            await resetRef.delete();
          });
        }
      }

      // Générer un nouveau code si nécessaire
      if (!codeToSend) {
        codeToSend = generateOTP();
        const now = Date.now();

        await firestoreOperationWithRetry(async () => {
          await resetRef.set({
            code: codeToSend,
            email: email.toLowerCase(),
            userId: userId,
            createdAt: now,
            used: false,
            attempts: 0,
            verified: false,
            ip: request.headers.get('x-forwarded-for') || 'unknown'
          });
        });
        
        console.log("Nouveau code généré:", codeToSend);
      }

      // Envoyer l'email avec retry
      const sendEmail = async () => {
        await transporter.sendMail({
          from: `"Shopmark Support" <${process.env.EMAIL_FROM || 'shopmarkofficial01@gmail.com'}>`,
          to: email,
          subject: 'Code de réinitialisation de mot de passe',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f59e0b;">Réinitialisation de mot de passe</h2>
              <p>Bonjour ${userData.fullName || 'Utilisateur'},</p>
              <p>Voici votre code de vérification :</p>
              <div style="background: #1f2937; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px;">
                <h1 style="font-size: 32px; letter-spacing: 10px; color: #f59e0b; margin: 0;">${codeToSend}</h1>
              </div>
              <p>Ce code est valable pendant <strong>5 minutes</strong>.</p>
              <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
              <hr style="border: none; border-top: 1px solid #374151; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px;">Cet email a été envoyé automatiquement.</p>
            </div>
          `,
        });
      };

      try {
        await sendEmail();
      } catch (emailError) {
        console.error("Erreur envoi email:", emailError);
        // On ne fail pas si l'email échoue, mais on log
      }

      return NextResponse.json({ 
        success: true, 
        message: action === 'resend' ? 'Code renvoyé' : 'Code envoyé'
      });
    }

    // Action 2: Vérifier le code
    if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { error: 'Code requis' },
          { status: 400 }
        );
      }

      const resetRef = adminDb.collection('passwordResets').doc(userId);
      const resetDoc = await firestoreOperationWithRetry(async () => {
        return await resetRef.get();
      });

      if (!resetDoc.exists) {
        return NextResponse.json(
          { error: 'Aucune demande de réinitialisation trouvée' },
          { status: 404 }
        );
      }

      const resetData = resetDoc.data();

      // Vérifications
      if (isCodeExpired(resetData.createdAt)) {
        await firestoreOperationWithRetry(async () => {
          await resetRef.delete();
        });
        return NextResponse.json(
          { error: 'Le code a expiré' },
          { status: 410 }
        );
      }

      if (resetData.used) {
        return NextResponse.json(
          { error: 'Ce code a déjà été utilisé' },
          { status: 410 }
        );
      }

      if (resetData.attempts >= 5) {
        await firestoreOperationWithRetry(async () => {
          await resetRef.delete();
        });
        return NextResponse.json(
          { error: 'Trop de tentatives. Redemandez un code.' },
          { status: 429 }
        );
      }

      if (resetData.code !== code) {
        await firestoreOperationWithRetry(async () => {
          await resetRef.update({
            attempts: (resetData.attempts || 0) + 1
          });
        });

        const remainingAttempts = 4 - (resetData.attempts || 0);
        return NextResponse.json(
          { 
            error: `Code incorrect. ${remainingAttempts > 0 ? `${remainingAttempts} tentatives restantes.` : 'Dernière tentative.'}` 
          },
          { status: 400 }
        );
      }

      // Code valide
      await firestoreOperationWithRetry(async () => {
        await resetRef.update({
          verified: true,
          verifiedAt: Date.now()
        });
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Code validé' 
      });
    }

    // Action 3: Réinitialiser le mot de passe
    if (action === 'reset') {
      if (!code || !newPassword) {
        return NextResponse.json(
          { error: 'Code et nouveau mot de passe requis' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Le mot de passe doit contenir au moins 6 caractères' },
          { status: 400 }
        );
      }

      const resetRef = adminDb.collection('passwordResets').doc(userId);
      const resetDoc = await firestoreOperationWithRetry(async () => {
        return await resetRef.get();
      });

      if (!resetDoc.exists) {
        return NextResponse.json(
          { error: 'Session expirée' },
          { status: 410 }
        );
      }

      const resetData = resetDoc.data();

      // Vérifications finales
      if (!resetData.verified) {
        return NextResponse.json(
          { error: 'Le code doit être vérifié d\'abord' },
          { status: 400 }
        );
      }

      if (resetData.code !== code) {
        return NextResponse.json(
          { error: 'Code invalide' },
          { status: 400 }
        );
      }

      if (resetData.used) {
        return NextResponse.json(
          { error: 'Ce code a déjà été utilisé' },
          { status: 410 }
        );
      }

      // Hasher le mot de passe
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Mettre à jour l'utilisateur
      await firestoreOperationWithRetry(async () => {
        const usersRef = adminDb.collection('users').doc(userId);
        await usersRef.update({
          password: hashedPassword,
          updatedAt: Date.now()
        });
      });

      // Marquer comme utilisé
      await firestoreOperationWithRetry(async () => {
        await resetRef.update({
          used: true,
          usedAt: Date.now()
        });
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Mot de passe réinitialisé' 
      });
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erreur complète:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Erreur interne',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}