'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db  ,auth} from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Récupérer les données supplémentaires de Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        setUser({
          uid: user.uid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          ...userData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Inscription avec téléphone (format email temporaire)
  const signup = async (phone, password, invitationCode = '') => {
    try {
      // Convertir le numéro de téléphone en email temporaire
      const email = `${phone.replace(/\s/g, '')}@shopmark.com`;
      
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer un document utilisateur dans Firestore
   const result =    await setDoc(doc(db, 'users', userCredential.user.uid), {
        phone,
        invitationCode,
        createdAt: new Date().toISOString(),
        role: 'user',
        credits: 0,
        lastLogin: new Date().toISOString()
      });



      // Mettre à jour le profil avec le numéro de téléphone
      await updateProfile(userCredential.user, {
        displayName: phone
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Connexion
  const login = async (phone, password) => {
    try {
      // Convertir le numéro de téléphone en email temporaire
      const email = `${phone.replace(/\s/g, '')}@shopmark.com`;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour la date de dernière connexion
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true });

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
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