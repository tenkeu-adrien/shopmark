// components/AppCacheProvider.js
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store/appStore';

export default function AppCacheProvider() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.uid) return;
    
    const appStore = useAppStore.getState();
    
    // Précharger les données critiques
    const preloadCriticalData = async () => {
      try {
        // Précharger uniquement les données essentielles
        await Promise.allSettled([
          appStore.fetchWalletData(user.uid, false),
          appStore.fetchLevelsData(false)
        ]);
        
        // Précharger le reste en arrière-plan
        setTimeout(() => {
          Promise.allSettled([
            appStore.fetchUserLevelsData(user.uid, false),
            appStore.fetchUserData(user.uid, false),
            appStore.fetchTeamStatsData(user.uid, false)
          ]).catch(() => {});
        }, 1000);
        
      } catch (error) {
        console.warn('Préchargement partiel:', error);
      }
    };
    
    preloadCriticalData();
    
    // Nettoyer à la déconnexion
    return () => {
      // Optionnel: vider le cache si nécessaire
    };
    
  }, [user?.uid]);
  
  return null;
}