// components/GlobalCacheProvider.js
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store/appStore';
import { useTeamStore } from '@/lib/store/teamStore';

export default function GlobalCacheProvider() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.uid) return;
    
    const appStore = useAppStore.getState();
    const teamStore = useTeamStore.getState();
    
    // Préchargement intelligent
    const preloadAllData = async () => {
      try {
        console.log('🚀 Préchargement global des données...');
        
        // Préchargement prioritaire (immédiat)
        await Promise.allSettled([
          appStore.preloadAppData(user.uid),
          teamStore.preloadAllData(user.uid)
        ]);
        
        console.log('✅ Préchargement terminé');
        
      } catch (error) {
        console.warn('⚠️ Préchargement partiel:', error);
      }
    };
    
    // Lancer avec un léger délai pour ne pas bloquer le chargement initial
    const timer = setTimeout(preloadAllData, 2000);
    
    return () => {
      clearTimeout(timer);
      // Nettoyage si nécessaire
    };
  }, [user?.uid]);
  
  return null;
}