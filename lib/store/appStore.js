// lib/store/appStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // === ÉTAT GLOBAL ===
      userData: null,
      walletData: null,
      levelsData: [],
      userLevelsData: [],
      teamStatsData: null,
      userProfileData: null,
      
      // === MÉTADONNÉES DU CACHE ===
          cacheMetadata: {
        wallet: { lastUpdated: null, ttl: 2 * 60 * 1000, isFresh: false },
        levels: { lastUpdated: null, ttl: 60 * 60 * 1000, isFresh: false },
        userLevels: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false },
        userData: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false }, // Changé de userProfile à userData
        teamStats: { lastUpdated: null, ttl: 15 * 60 * 1000, isFresh: false }
      },

      
      // === ÉTATS DE CHARGEMENT ===
      loadingStates: {
        wallet: false,
        levels: false,
        userLevels: false,
        userProfile: false,
        teamStats: false
      },
      
      // === ACTIONS ===
      
      // Actions génériques de mise à jour
       setUserData: (data) => {
        set((state) => ({
          userData: data,
          cacheMetadata: {
            ...state.cacheMetadata,
            userData: { // Nom cohérent
              ...state.cacheMetadata.userData,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },
      
      setWalletData: (data) => {
        set((state) => ({
          walletData: data,
          cacheMetadata: {
            ...state.cacheMetadata,
            wallet: {
              ...state.cacheMetadata.wallet,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },
      
      setLevelsData: (data) => {
        set((state) => ({
          levelsData: data,
          cacheMetadata: {
            ...state.cacheMetadata,
            levels: {
              ...state.cacheMetadata.levels,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },
      
      setUserLevelsData: (data) => {
        set((state) => ({
          userLevelsData: data,
          cacheMetadata: {
            ...state.cacheMetadata,
            userLevels: {
              ...state.cacheMetadata.userLevels,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },
      
      setTeamStatsData: (data) => {
        set((state) => ({
          teamStatsData: data,
          cacheMetadata: {
            ...state.cacheMetadata,
            teamStats: {
              ...state.cacheMetadata.teamStats,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },
      
      // Vérificateur de cache
      isCacheValid: (key) => {
        const state = get();
        const cacheInfo = state.cacheMetadata[key];
        
        if (!cacheInfo || !cacheInfo.lastUpdated) {
          return false;
        }
        
        const age = Date.now() - cacheInfo.lastUpdated;
        return age < cacheInfo.ttl && cacheInfo.isFresh;
      },
      
      // Invalidation de cache
      invalidateCache: (key = null) => {
        if (key) {
          set((state) => ({
            cacheMetadata: {
              ...state.cacheMetadata,
              [key]: {
                ...state.cacheMetadata[key],
                isFresh: false
              }
            }
          }));
        } else {
          // Invalider tout
          set((state) => ({
            cacheMetadata: {
              wallet: { ...state.cacheMetadata.wallet, isFresh: false },
              levels: { ...state.cacheMetadata.levels, isFresh: false },
              userLevels: { ...state.cacheMetadata.userLevels, isFresh: false },
              userProfile: { ...state.cacheMetadata.userProfile, isFresh: false },
              teamStats: { ...state.cacheMetadata.teamStats, isFresh: false }
            }
          }));
        }
      },
      
      // Gestion du chargement
      setLoading: (key, isLoading) => {
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: isLoading
          }
        }));
      },
      
      // Action de préchargement intelligent
      preloadAppData: async (userId) => {
        const state = get();
        
        // Vérifier ce qui est déjà en cache
        const cacheKeys = ['wallet', 'levels', 'userLevels', 'userData', 'teamStats'];
        const needsRefresh = cacheKeys.filter(key => !state.isCacheValid(key));
        
        if (needsRefresh.length === 0) {
          console.log('📦 Toutes les données sont déjà en cache');
          return;
        }
        
        console.log('🔄 Préchargement nécessaire pour:', needsRefresh);
        
        try {
          // Charger les données manquantes
          const promises = [];
          
          if (needsRefresh.includes('wallet')) {
            promises.push(state.fetchWalletData(userId, false));
          }
          
          if (needsRefresh.includes('levels')) {
            promises.push(state.fetchLevelsData(false));
          }
          
          // Exécuter en parallèle
          await Promise.allSettled(promises);
          
        } catch (error) {
          console.error('Erreur préchargement:', error);
        }
      },
      
      // Fetchers spécifiques
      fetchWalletData: async (userId, forceRefresh = false) => {
        const state = get();
        
        if (!forceRefresh && state.isCacheValid('wallet') && state.walletData) {
          console.log('📦 Utilisation cache wallet');
          return state.walletData;
        }
        
        state.setLoading('wallet', true);
        
        try {
          // Ici vous intégrerez vos appels Firestore existants
          // Pour l'exemple, je simule l'import
          const { db } = await import('@/lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');
          
          const walletDoc = await getDoc(doc(db, 'wallets', userId));
          
          let walletData = null;
          if (walletDoc.exists()) {
            walletData = { id: walletDoc.id, ...walletDoc.data() };
          } else {
            // Créer un wallet si inexistant (logique existante)
            walletData = await state.createFixedWallet(userId);
          }
          
          state.setWalletData(walletData);
          
          // Rafraîchir en arrière-plan si nécessaire
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchWalletData(userId, true).catch(console.error);
            }, 0);
          }
          
          return walletData;
          
        } catch (error) {
          console.error('Erreur fetchWalletData:', error);
          
          // Fallback au cache
          if (state.walletData) {
            console.log('⚠️ Fallback cache wallet');
            return state.walletData;
          }
          throw error;
          
        } finally {
          state.setLoading('wallet', false);
        }
      },
      
      fetchLevelsData: async (forceRefresh = false) => {
        const state = get();
        
        if (!forceRefresh && state.isCacheValid('levels') && state.levelsData.length > 0) {
          console.log('📦 Utilisation cache levels');
          return state.levelsData;
        }
        
        state.setLoading('levels', true);
        
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, getDocs, orderBy } = await import('firebase/firestore');
          
          const levelsSnapshot = await getDocs(
            query(collection(db, 'levels'), orderBy('order'))
          );
          
          const levels = levelsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          state.setLevelsData(levels);
          
          return levels;
          
        } catch (error) {
          console.error('Erreur fetchLevelsData:', error);
          
          if (state.levelsData.length > 0) {
            console.log('⚠️ Fallback cache levels');
            return state.levelsData;
          }
          throw error;
          
        } finally {
          state.setLoading('levels', false);
        }
      },
      
      fetchUserLevelsData: async (userId, forceRefresh = false) => {
        const state = get();
        
        if (!forceRefresh && state.isCacheValid('userLevels') && state.userLevelsData.length > 0) {
          console.log('📦 Utilisation cache userLevels');
          return state.userLevelsData;
        }
        
        state.setLoading('userLevels', true);
        
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore');
          
          const userLevelsSnap = await getDocs(
            query(
              collection(db, 'user_levels'),
              where('userId', '==', userId),
              orderBy('startDate', 'desc'),
              limit(50)
            )
          );
          
          const userLevels = userLevelsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          state.setUserLevelsData(userLevels);
          
          return userLevels;
          
        } catch (error) {
          console.error('Erreur fetchUserLevelsData:', error);
          
          if (state.userLevelsData.length > 0) {
            console.log('⚠️ Fallback cache userLevels');
            return state.userLevelsData;
          }
          throw error;
          
        } finally {
          state.setLoading('userLevels', false);
        }
      },
      
    fetchUserData: async (userId, forceRefresh = false) => { // Nom changé
        const state = get();
        
        if (!forceRefresh && state.isCacheValid('userData') && state.userData) {
          console.log('📦 Utilisation cache userData');
          return state.userData;
        }
        
        state.setLoading('userData', true); // Changé ici aussi
        
        try {
          const { db } = await import('@/lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');
          
          const userDoc = await getDoc(doc(db, 'users', userId));
          
          let userData = null;
          if (userDoc.exists()) {
            userData = { id: userDoc.id, ...userDoc.data() };
          }
          
          state.setUserData(userData); // Utiliser setUserData (pas setUserProfileData)
          
          return userData;
          
        } catch (error) {
          console.error('Erreur fetchUserData:', error); // Nom changé
          
          if (state.userData) {
            console.log('⚠️ Fallback cache userData');
            return state.userData;
          }
          throw error;
          
        } finally {
          state.setLoading('userData', false); // Nom changé
        }
      },
      
      fetchTeamStatsData: async (userId, forceRefresh = false) => {
        const state = get();
        
        if (!forceRefresh && state.isCacheValid('teamStats') && state.teamStatsData) {
          console.log('📦 Utilisation cache teamStats');
          return state.teamStatsData;
        }
        
        state.setLoading('teamStats', true);
        
        try {
          // Logique de chargement teamStats (existant)
          const teamStats = await state.loadTeamStats(userId);
          state.setTeamStatsData(teamStats);
          
          return teamStats;
          
        } catch (error) {
          console.error('Erreur fetchTeamStatsData:', error);
          
          if (state.teamStatsData) {
            console.log('⚠️ Fallback cache teamStats');
            return state.teamStatsData;
          }
          throw error;
          
        } finally {
          state.setLoading('teamStats', false);
        }
      },
      
      // Fonctions utilitaires (copiées de votre code existant)
      createFixedWallet: async (userId) => {
        try {
          const { db } = await import('@/lib/firebase');
          const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
          
          const walletRef = doc(db, 'wallets', userId);
          const now = serverTimestamp();
          
          const walletData = {
            userId,
            userEmail: '',
            userPhone: '',
            balances: {
              wallet: { amount: 0, currency: 'CDF', lastUpdated: now },
              action: { amount: 0, currency: 'CDF', lastUpdated: now },
              totalDeposited: { amount: 0, currency: 'DF', lastUpdated: now }
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
          
          return {
            id: userId,
            ...walletData
          };
          
        } catch (error) {
          console.error('Erreur création wallet:', error);
          throw error;
        }
      },
      
      loadTeamStats: async (userId) => {
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          
          // Niveau 1 (direct)
          const level1Query = query(
            collection(db, 'users'),
            where('referrerId', '==', userId)
          );
          const level1Snap = await getDocs(level1Query);
          const level1Count = level1Snap.docs.length;
          
          // Niveau 2
          const level1Users = level1Snap.docs.map(doc => doc.id);
          let level2Count = 0;
          let level3Count = 0;
          
          if (level1Users.length > 0) {
            const level2Query = query(
              collection(db, 'users'),
              where('referrerId', 'in', level1Users.slice(0, 10))
            );
            const level2Snap = await getDocs(level2Query);
            level2Count = level2Snap.docs.length;
            
            // Niveau 3
            const level2Users = level2Snap.docs.map(doc => doc.id);
            if (level2Users.length > 0) {
              const level3Query = query(
                collection(db, 'users'),
                where('referrerId', 'in', level2Users.slice(0, 10))
              );
              const level3Snap = await getDocs(level3Query);
              level3Count = level3Snap.docs.length;
            }
          }
          
          return {
            level1: level1Count,
            level2: level2Count,
            level3: level3Count,
            total: level1Count + level2Count + level3Count
          };
          
        } catch (error) {
          console.error('Erreur chargement stats équipe:', error);
          return { level1: 0, level2: 0, level3: 0, total: 0 };
        }
      },
      
      // Nettoyage
      clearUserData: () => {
        set({
          userData: null,
          walletData: null,
          userLevelsData: [],
          userProfileData: null,
          teamStatsData: null,
          cacheMetadata: {
            wallet: { lastUpdated: null, ttl: 2 * 60 * 1000, isFresh: false },
            levels: { lastUpdated: null, ttl: 60 * 60 * 1000, isFresh: false },
            userLevels: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false },
            userProfile: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false },
            teamStats: { lastUpdated: null, ttl: 15 * 60 * 1000, isFresh: false }
          }
        });
      }
    }),
    {
      name: 'app-cache-storage',
      partialize: (state) => ({
        walletData: state.walletData,
        levelsData: state.levelsData,
        userLevelsData: state.userLevelsData,
        userProfileData: state.userProfileData,
        teamStatsData: state.teamStatsData,
        cacheMetadata: state.cacheMetadata
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Après réhydratation, marquer comme non frais
          Object.keys(state.cacheMetadata).forEach(key => {
            state.cacheMetadata[key].isFresh = false;
          });
        }
      }
    }
  )
);