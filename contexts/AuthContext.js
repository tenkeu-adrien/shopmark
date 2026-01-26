'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  collection, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { firestoreService } from '@/lib/initCollections';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour créer un wallet utilisateur
  const createUserWallet = async (userId, userPhone) => {
    try {
      const walletRef = doc(db, 'wallets', userId);
      const now = serverTimestamp();
      
      const walletData = {
        userId,
        userPhone,
        balances: {
          wallet: {
            amount: 0,
            currency: 'CDF',
            lastUpdated: now
          },
          action: {
            amount: 0,
            currency: 'CDF',
            lastUpdated: now
          },
          totalDeposited: {
            amount: 0,
            currency: 'CDF',
            lastUpdated: now
          }
        },
        stats: {
          totalDeposited: 0,
          totalWithdrawn: 0,
          totalInvested: 0,
          totalEarned: 0,
          referralEarnings: 0,
          lastDepositAt: null,
          lastWithdrawalAt: null,
          lastInvestmentAt: null
        },
        createdAt: now,
        updatedAt: now,
        version: 1
      };

      await setDoc(walletRef, walletData);
      console.log('✅ Wallet créé pour:', userId);
      return true;
      
    } catch (error) {
      console.error('❌ Erreur création wallet:', error);
      throw error;
    }
  };

  // Fonction pour générer un code d'invitation
  const generateInvitationCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Initialiser les collections au démarrage de l'app
      // await firestoreService.initializeIfNeeded();
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Récupérer les données utilisateur
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          // S'assurer que le wallet existe
          const walletDoc = await getDoc(doc(db, 'wallets', user.uid));
          if (!walletDoc.exists()) {
            await createUserWallet(user.uid, userData.phone || '');
          }
          
          // S'assurer que tous les niveaux existent
          // await firestoreService.ensureLevelsExist();
          
          setUser({
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.fullName,
            fullName: userData.fullName || '',
            invitationCode: userData.invitationCode || '',
            referrerId: userData.referrerId || '',
            referrerPhone: userData.referrerPhone || '',
            createdAt: userData.createdAt || null,
            ...userData
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    initializeApp().catch(console.error);
  }, []);

  // Inscription optimisée
 const signup = async (phone, password, invitationCode = '', fullName = '', userEmail = '') => {
  try {
    console.log('=== DÉBUT INSCRIPTION ===');
    console.log('Phone:', phone);
    console.log('Full Name:', fullName);
    console.log('Email:', userEmail);
    console.log('Code invitation:', invitationCode);
    
    // Vérifier si le code d'invitation est valide
    let referrerId = null;
    let referrerPhone = null;
    
    if (invitationCode && invitationCode.trim() !== '') {
      // Rechercher l'utilisateur avec ce code d'invitation
      const referrerQuery = query(
        collection(db, 'users'),
        where('invitationCode', '==', invitationCode.trim().toUpperCase())
      );
      const referrerSnapshot = await getDocs(referrerQuery);
      
      if (!referrerSnapshot.empty) {
        const referrerDoc = referrerSnapshot.docs[0];
        referrerId = referrerDoc.id;
        referrerPhone = referrerDoc.data().phone;
        console.log('✅ Parrain trouvé:', referrerId, 'phone:', referrerPhone);
      } else {
        console.log('⚠️ Aucun parrain trouvé avec ce code:', invitationCode);
      }
    } else {
      console.log('ℹ️ Inscription sans code d\'invitation');
    }

    // Générer un code d'invitation unique pour le nouvel utilisateur
    const newInvitationCode = generateInvitationCode();
    console.log('Nouveau code généré:', newInvitationCode);
    
    // Créer l'utilisateur Firebase Auth (email/password)
    const email = `${phone.replace(/\s/g, '')}@shopmark.com`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUserId = userCredential.user.uid;
    
    // Créer le document utilisateur dans Firestore
    const userDocRef = doc(db, 'users', firebaseUserId);
    const userData = {
      uid: firebaseUserId,
      phone,
      email: userEmail || email, // Utiliser l'email fourni ou celui généré
      fullName: fullName || '',
      invitationCode: newInvitationCode,
      referrerId: referrerId, // Stocker l'ID du parrain
      referrerPhone: referrerPhone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      role: 'user'
    };
    
    await setDoc(userDocRef, userData);
    console.log('✅ Document utilisateur créé avec fullName:', fullName);
    
    // Créer le wallet
    await createUserWallet(firebaseUserId, phone);
    console.log('✅ Wallet créé');
    
    return {
      success: true,
      user: userData,
      message: referrerId 
        ? `Inscription réussie avec parrainage. Votre code: ${newInvitationCode}` 
        : `Inscription réussie. Votre code: ${newInvitationCode}`
    };
    
  } catch (error) {
    console.error('❌ Erreur inscription détaillée:', error);
    console.error('Code erreur:', error.code);
    console.error('Message erreur:', error.message);
    
    let errorMessage = 'Erreur lors de l\'inscription';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Ce numéro de téléphone est déjà utilisé';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Mot de passe trop faible (minimum 6 caractères)';
    }
    
    return {
      success: false,
      error: errorMessage,
      details: error.message
    };
  }
};

 const login = async (identifier, password, method = 'phone') => {
  try {
    let firebaseIdentifier;
    
    if (method === 'phone') {
      // Méthode existante : transforme le téléphone en email
      firebaseIdentifier = `${identifier.replace(/\s/g, '')}@shopmark.com`;
      console.log('📱 Tentative connexion par téléphone:', firebaseIdentifier);
    } 
    else if (method === 'email') {
      // NOUVELLE : Connexion par email
      console.log('📧 Tentative connexion par email:', identifier);
      
      // 1. Chercher dans Firestore l'utilisateur avec cet email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', identifier));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ Aucun utilisateur trouvé avec cet email');
        return { 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        };
      }
      
      // 2. Récupérer le téléphone de l'utilisateur
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userPhone = userData.phone;
      
      if (!userPhone) {
        console.log('❌ Aucun téléphone associé à cet email');
        return { 
          success: false, 
          error: 'Données utilisateur incomplètes' 
        };
      }
      
      console.log('📱 Téléphone trouvé pour cet email:', userPhone);
      
      // 3. Transformer le téléphone en format Firebase (comme d'habitude)
      firebaseIdentifier = `${userPhone.replace(/\s/g, '')}@shopmark.com`;
      console.log('🔑 Identifiant Firebase:', firebaseIdentifier);
    }
    else {
      return { 
        success: false, 
        error: 'Méthode d\'authentification invalide' 
      };
    }
    
    // Connexion Firebase avec l'identifiant formaté
    const userCredential = await signInWithEmailAndPassword(auth, firebaseIdentifier, password);
    
    // Mettre à jour la dernière connexion
    await setDoc(doc(db, 'users', userCredential?.user?.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    console.log(`✅ Connexion réussie (${method}):`, userCredential.user.uid);
    return { 
      success: true, 
      user: userCredential.user 
    };
    
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    
    // Messages d'erreur spécifiques
    let errorMessage = 'Erreur lors de la connexion';
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = method === 'phone' 
        ? 'Numéro de téléphone ou mot de passe incorrect'
        : 'Email ou mot de passe incorrect';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = method === 'phone'
        ? 'Numéro de téléphone invalide'
        : 'Email invalide';
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};