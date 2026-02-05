// lib/store/dashboardStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      // === ÉTAT DES DONNÉES ===
      dashboardData: {
        stats: {
          totalUsers: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          pendingTransactions: 0,
          totalRevenue: 0,
          activeUsers: 0
        },
        recentActivity: [],
        users: [],
        transactions: [],
        portefeuilles: []
      },

      // === MÉTADONNÉES DU CACHE ===
      cacheMetadata: {
        stats: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false }, // 5 min
        recentActivity: { lastUpdated: null, ttl: 2 * 60 * 1000, isFresh: false }, // 2 min
        users: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false }, // 10 min
        transactions: { lastUpdated: null, ttl: 3 * 60 * 1000, isFresh: false }, // 3 min
        portefeuilles: { lastUpdated: null, ttl: 15 * 60 * 1000, isFresh: false } // 15 min
      },

      // === ÉTATS DE CHARGEMENT ===
      loadingStates: {
        stats: false,
        recentActivity: false,
        users: false,
        transactions: false,
        portefeuilles: false,
        global: false
      },

      // === ACTIONS ===

      // Mettre à jour les stats
      setStats: (stats) => {
        set((state) => ({
          dashboardData: {
            ...state.dashboardData,
            stats
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            stats: {
              ...state.cacheMetadata.stats,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Mettre à jour l'activité récente
      setRecentActivity: (recentActivity) => {
        set((state) => ({
          dashboardData: {
            ...state.dashboardData,
            recentActivity
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            recentActivity: {
              ...state.cacheMetadata.recentActivity,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Mettre à jour les utilisateurs
      setUsers: (users) => {
        set((state) => ({
          dashboardData: {
            ...state.dashboardData,
            users
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            users: {
              ...state.cacheMetadata.users,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Mettre à jour les transactions
      setTransactions: (transactions) => {
        set((state) => ({
          dashboardData: {
            ...state.dashboardData,
            transactions
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            transactions: {
              ...state.cacheMetadata.transactions,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Mettre à jour les portefeuilles
      setPortefeuilles: (portefeuilles) => {
        set((state) => ({
          dashboardData: {
            ...state.dashboardData,
            portefeuilles
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            portefeuilles: {
              ...state.cacheMetadata.portefeuilles,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Vérifier si le cache est valide
      isCacheValid: (key) => {
        const state = get();
        const cacheInfo = state.cacheMetadata[key];

        if (!cacheInfo || !cacheInfo.lastUpdated) {
          return false;
        }

        const age = Date.now() - cacheInfo.lastUpdated;
        return age < cacheInfo.ttl && cacheInfo.isFresh;
      },

      // Invalider le cache
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
          set((state) => {
            const newMetadata = {};
            Object.keys(state.cacheMetadata).forEach(k => {
              newMetadata[k] = {
                ...state.cacheMetadata[k],
                isFresh: false
              };
            });
            return { cacheMetadata: newMetadata };
          });
        }
      },

      // Gérer l'état de chargement
      setLoading: (key, isLoading) => {
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: isLoading
          }
        }));
      },

      // === FETCHERS ===

      // Charger les statistiques du dashboard
      fetchDashboardStats: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('stats')) {
          console.log('📦 Cache stats dashboard valide');
          return state.dashboardData.stats;
        }

        state.setLoading('stats', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { collection, getDocs } = await import('firebase/firestore');

          // Charger en parallèle
          const [usersSnapshot, transactionsSnapshot, walletsSnapshot] = await Promise.all([
            getDocs(collection(db, 'users')),
            getDocs(collection(db, 'transactions')),
            getDocs(collection(db, 'wallets'))
          ]);

          const totalUsers = usersSnapshot.size;

          const transactions = transactionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const totalDeposits = transactions
            .filter(t => t.depositId && t.status === 'confirmed')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          const totalWithdrawals = transactions
            .filter(t => t.withdrawalId && t.status === 'confirmed')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          const pendingTransactions = transactions
            .filter(t => t.status === 'pending').length;

          const totalRevenue = walletsSnapshot.docs.reduce((sum, doc) => {
            const data = doc.data();
            return sum + (data.stats?.totalEarned || 0);
          }, 0);

          // Utilisateurs actifs (dernière semaine)
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const activeUsers = usersSnapshot.docs.filter(doc => {
            const lastLogin = doc.data().lastLogin;
            if (!lastLogin) return false;
            const loginDate = lastLogin.toDate ? lastLogin.toDate() : new Date(lastLogin);
            return loginDate >= weekAgo;
          }).length;

          const stats = {
            totalUsers,
            totalDeposits,
            totalWithdrawals,
            pendingTransactions,
            totalRevenue,
            activeUsers
          };

          state.setStats(stats);

          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchDashboardStats(true).catch(console.error);
            }, 0);
          }

          return stats;

        } catch (error) {
          console.error('❌ Erreur fetchDashboardStats:', error);

          // Fallback au cache
          if (state.dashboardData.stats.totalUsers > 0) {
            console.log('⚠️ Fallback cache stats');
            return state.dashboardData.stats;
          }

          throw error;

        } finally {
          state.setLoading('stats', false);
        }
      },

      // Charger l'activité récente
      fetchRecentActivity: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('recentActivity')) {
          console.log('📦 Cache activité récente valide');
          return state.dashboardData.recentActivity;
        }

        state.setLoading('recentActivity', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');

          const recentActivityQuery = query(
            collection(db, 'transactions'),
            orderBy('createdAt', 'desc'),
            limit(5)
          );

          const snapshot = await getDocs(recentActivityQuery);
          const recentActivity = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate?.() || new Date()
          }));

          state.setRecentActivity(recentActivity);

          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchRecentActivity(true).catch(console.error);
            }, 0);
          }

          return recentActivity;

        } catch (error) {
          console.error('❌ Erreur fetchRecentActivity:', error);

          if (state.dashboardData.recentActivity.length > 0) {
            console.log('⚠️ Fallback cache activité');
            return state.dashboardData.recentActivity;
          }

          throw error;

        } finally {
          state.setLoading('recentActivity', false);
        }
      },

      // Charger tous les utilisateurs
      fetchUsers: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('users')) {
          console.log('📦 Cache utilisateurs valide');
          return state.dashboardData.users;
        }

        state.setLoading('users', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { collection, getDocs } = await import('firebase/firestore');

          const usersSnapshot = await getDocs(collection(db, 'users'));
          const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            registration: doc.data().createdAt?.toDate?.() || new Date(),
            lastLogin: doc.data().lastLogin?.toDate?.() || null
          }));

          state.setUsers(users);

          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchUsers(true).catch(console.error);
            }, 0);
          }

          return users;

        } catch (error) {
          console.error('❌ Erreur fetchUsers:', error);

          if (state.dashboardData.users.length > 0) {
            console.log('⚠️ Fallback cache users');
            return state.dashboardData.users;
          }

          throw error;

        } finally {
          state.setLoading('users', false);
        }
      },

      // Charger toutes les transactions
      fetchTransactions: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('transactions')) {
          console.log('📦 Cache transactions valide');
          return state.dashboardData.transactions;
        }

        state.setLoading('transactions', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, orderBy, getDocs } = await import('firebase/firestore');

          const transactionsQuery = query(
            collection(db, 'transactions'),
            orderBy('createdAt', 'desc')
          );

          const snapshot = await getDocs(transactionsQuery);
          const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate?.() || new Date()
          }));

          state.setTransactions(transactions);

          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchTransactions(true).catch(console.error);
            }, 0);
          }

          return transactions;

        } catch (error) {
          console.error('❌ Erreur fetchTransactions:', error);

          if (state.dashboardData.transactions.length > 0) {
            console.log('⚠️ Fallback cache transactions');
            return state.dashboardData.transactions;
          }

          throw error;

        } finally {
          state.setLoading('transactions', false);
        }
      },

      // Charger tous les portefeuilles
      fetchPortefeuilles: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('portefeuilles')) {
          console.log('📦 Cache portefeuilles valide');
          return state.dashboardData.portefeuilles;
        }

        state.setLoading('portefeuilles', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, orderBy, getDocs } = await import('firebase/firestore');

          const portefeuillesQuery = query(
            collection(db, 'portefeuilles'),
            orderBy('createdAt', 'desc')
          );

          const snapshot = await getDocs(portefeuillesQuery);
          const portefeuilles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          state.setPortefeuilles(portefeuilles);

          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchPortefeuilles(true).catch(console.error);
            }, 0);
          }

          return portefeuilles;

        } catch (error) {
          console.error('❌ Erreur fetchPortefeuilles:', error);

          if (state.dashboardData.portefeuilles.length > 0) {
            console.log('⚠️ Fallback cache portefeuilles');
            return state.dashboardData.portefeuilles;
          }

          throw error;

        } finally {
          state.setLoading('portefeuilles', false);
        }
      },

      // Précharger toutes les données du dashboard
      preloadDashboard: async () => {
        const state = get();
        state.setLoading('global', true);

        try {
          console.log('🔄 Préchargement dashboard...');

          // Charger en parallèle les données critiques
          await Promise.allSettled([
            state.fetchDashboardStats(false),
            state.fetchRecentActivity(false)
          ]);

          console.log('✅ Dashboard préchargé');

        } catch (error) {
          console.error('❌ Erreur preloadDashboard:', error);
        } finally {
          state.setLoading('global', false);
        }
      },

      // Nettoyer toutes les données
      clearDashboardData: () => {
        set({
          dashboardData: {
            stats: {
              totalUsers: 0,
              totalDeposits: 0,
              totalWithdrawals: 0,
              pendingTransactions: 0,
              totalRevenue: 0,
              activeUsers: 0
            },
            recentActivity: [],
            users: [],
            transactions: [],
            portefeuilles: []
          },
          cacheMetadata: {
            stats: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false },
            recentActivity: { lastUpdated: null, ttl: 2 * 60 * 1000, isFresh: false },
            users: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false },
            transactions: { lastUpdated: null, ttl: 3 * 60 * 1000, isFresh: false },
            portefeuilles: { lastUpdated: null, ttl: 15 * 60 * 1000, isFresh: false }
          },
          loadingStates: {
            stats: false,
            recentActivity: false,
            users: false,
            transactions: false,
            portefeuilles: false,
            global: false
          }
        });
      }
    }),
    {
      name: 'dashboard-cache-storage',
      partialize: (state) => ({
        dashboardData: state.dashboardData,
        cacheMetadata: state.cacheMetadata
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Marquer comme non frais après réhydratation
          Object.keys(state.cacheMetadata).forEach(key => {
            state.cacheMetadata[key].isFresh = false;
          });
        }
      }
    }
  )
);
