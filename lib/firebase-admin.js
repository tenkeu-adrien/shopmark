// lib/firebase-admin.ts
import admin from 'firebase-admin';

// Configuration améliorée
const firestoreSettings = {
  timeout: 120000,
  ignoreUndefinedProperties: true,
};

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error('Configuration Firebase Admin incomplète');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
      });
      
      // Appliquer les paramètres
      admin.firestore().settings(firestoreSettings);
      
      console.log('✅ Firebase Admin initialisé avec succès');
    } catch (e) {
      console.error('❌ Échec initialisation Firebase Admin:', e);
      throw e;
    }
  }
  return admin;
}

// Initialiser et exporter
const adminInstance = initializeFirebaseAdmin();
export const adminDb = adminInstance.firestore();
export const auth = adminInstance.auth()
export default adminInstance;