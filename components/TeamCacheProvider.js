// components/TeamCacheProvider.js
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTeamStore } from '@/lib/store/teamStore';

export default function TeamCacheProvider() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.uid) return;
    
    const store = useTeamStore.getState();
    
    // Précharger les données au montage
    const preloadData = async () => {
      try {
        await store.preloadAllData(user.uid);
        console.log('✅ Données team préchargées avec succès');
      } catch (error) {
        console.warn('⚠️ Préchargement partiel des données team:', error);
      }
    };
    
    // Délai pour ne pas bloquer le chargement initial
    const timer = setTimeout(preloadData, 2000);
    
    // Nettoyer les données au démontage
    return () => {
      clearTimeout(timer);
      store.clearUserData(user.uid);
    };
  }, [user?.uid]);
  
  return null; // Ce composant ne rend rien
}