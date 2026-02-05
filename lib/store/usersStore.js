// lib/store/usersStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 🎯 USERS STORE
 * 
 * Gère les utilisateurs du dashboard avec cache intelligent
 * 
 * Fonctionnalités:
 * - Cache des utilisateurs avec TTL
 * - Détails utilisateur avec wallet et transactions
 * - Modification des soldes avec historique
 * - Actions groupées (activer, suspendre, supprimer)
 * - Pattern "Stale-While-Revalidate"
 */

export const useUsersStore = create(
  persist(
    (set, get) => ({
      // === ÉTAT DES DONNÉES ===
      usersData: {
        users: [],
        selectedUser: null,
        userDetails: null,
        userWallet: null,
        userTransactions: [],
        balanceHistory: []
      },

      // === MÉTADONNÉES DU CACHE ===
      cacheMetadata: {
        users: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false }, // 5 min
        userDetails: { lastUpdated: null, ttl: 2 * 60 * 1000, isFresh: false }, // 2 min
        userWallet: { lastUpdated: null, ttl: 1 * 60 * 1000, isFresh: false } // 1 min
      },

      // === ÉTATS DE CHARGEMENT ===
      loadingStates: {
        users: false,
        userDetails: false,
        userWallet: false,
        balanceUpdate: false,
        userAction: false
      },

      // === ACTIONS ===

      // Mettre à jour la liste des utilisateurs
      setUsers: (users) => {
        set((state) => ({
          usersData: {
            ...state.usersData,
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

      // Mettre à jour les détails d'un utilisateur
      setUserDetails: (userDetails, userWallet, userTransactions, balanceHistory) => {
        set((state) => ({
          usersData: {
            ...state.usersData,
            userDetails,
            userWallet,
            userTransactions,
            balanceHistory
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            userDetails: {
              ...state.cacheMetadata.userDetails,
              lastUpdated: Date.now(),
              isFresh: true
            },
            userWallet: {
              ...state.cacheMetadata.userWallet,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Sélectionner un utilisateur
      setSelectedUser: (user) => {
        set((state) => ({
          usersData: {
            ...state.usersData,
            selectedUser: user
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

      // Charger tous les utilisateurs
      fetchUsers: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('users')) {
          console.log('📦 Cache utilisateurs valide');
          return state.usersData.users;
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

          if (state.usersData.users.length > 0) {
            console.log('⚠️ Fallback cache users');
            return state.usersData.users;
          }

          throw error;

        } finally {
          state.setLoading('users', false);
        }
      },

      // Charger les détails d'un utilisateur
      fetchUserDetails: async (userId, forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.isCacheValid('userDetails') && 
            state.usersData.userDetails?.id === userId) {
          console.log('📦 Cache détails utilisateur valide');
          return {
            userDetails: state.usersData.userDetails,
            userWallet: state.usersData.userWallet,
            userTransactions: state.usersData.userTransactions,
            balanceHistory: state.usersData.balanceHistory
          };
        }

        state.setLoading('userDetails', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { doc, getDoc, collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');

          // Charger les données utilisateur
          const userDoc = await getDoc(doc(db, 'users', userId));
          let userDetails = null;
          
          if (userDoc.exists()) {
            userDetails = {
              id: userDoc.id,
              ...userDoc.data()
            };
          }

          // Charger le wallet
          const walletDoc = await getDoc(doc(db, 'wallets', userId));
          let userWallet = null;
          let balanceHistory = [];
          
          if (walletDoc.exists()) {
            const walletData = walletDoc.data();
            userWallet = {
              available: walletData.balances?.wallet?.amount || 0,
              invested: walletData.balances?.action?.amount || 0,
              totalDeposited: walletData.balances?.totalDeposited?.amount || 0,
              referralEarnings: walletData.stats?.referralEarnings || 0,
              totalEarned: walletData.stats?.totalEarned || 0,
              totalInvested: walletData.stats?.totalInvested || 0,
              totalWithdrawn: walletData.stats?.totalWithdrawn || 0,
              totalDailyGains: walletData.stats?.totalDailyGains || 0,
              lastDailyGainAt: walletData.stats?.lastDailyGainAt
            };
            
            balanceHistory = walletData.balanceHistory || [];
          }

          // Charger les transactions
          const transactionsQuery = query(
            collection(db, 'transactions'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          const transactionsSnap = await getDocs(transactionsQuery);
          const userTransactions = transactionsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          state.setUserDetails(userDetails, userWallet, userTransactions, balanceHistory);

          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchUserDetails(userId, true).catch(console.error);
            }, 0);
          }

          return { userDetails, userWallet, userTransactions, balanceHistory };

        } catch (error) {
          console.error('❌ Erreur fetchUserDetails:', error);

          if (state.usersData.userDetails?.id === userId) {
            console.log('⚠️ Fallback cache userDetails');
            return {
              userDetails: state.usersData.userDetails,
              userWallet: state.usersData.userWallet,
              userTransactions: state.usersData.userTransactions,
              balanceHistory: state.usersData.balanceHistory
            };
          }

          throw error;

        } finally {
          state.setLoading('userDetails', false);
        }
      },

      // Mettre à jour un utilisateur
      updateUser: async (userId, updates) => {
        const state = get();
        state.setLoading('userAction', true);

        try {
          const { db, auth } = await import('@/lib/firebase');
          const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');

          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            ...updates,
            updatedAt: serverTimestamp()
          });

          // Invalider le cache
          state.invalidateCache('users');
          state.invalidateCache('userDetails');

          // Recharger
          await state.fetchUsers(true);
          if (state.usersData.selectedUser?.id === userId) {
            await state.fetchUserDetails(userId, true);
          }

          return { success: true };

        } catch (error) {
          console.error('❌ Erreur updateUser:', error);
          return { success: false, error: error.message };

        } finally {
          state.setLoading('userAction', false);
        }
      },

      // Modifier le solde d'un utilisateur
      updateUserBalance: async (userId, balanceForm, currentUser) => {
        const state = get();
        state.setLoading('balanceUpdate', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { doc, getDoc, updateDoc, serverTimestamp, increment, arrayUnion } = await import('firebase/firestore');

          const walletRef = doc(db, 'wallets', userId);
          const userDoc = await getDoc(walletRef);

          if (!userDoc.exists()) {
            throw new Error('Portefeuille utilisateur non trouvé');
          }

          const walletData = userDoc.data();
          const amount = parseFloat(balanceForm.amount);

          // Récupérer le solde actuel selon le type
          let currentBalance = 0;
          switch(balanceForm.balanceType) {
            case 'wallet':
              currentBalance = walletData?.balances?.wallet?.amount || 0;
              break;
            case 'action':
              currentBalance = walletData?.balances?.action?.amount || 0;
              break;
            case 'referralEarnings':
              currentBalance = walletData?.stats?.referralEarnings || 0;
              break;
          }

          const newAmount = balanceForm.type === 'add' ? amount : -amount;
          const newBalance = currentBalance + newAmount;

          // Créer l'entrée d'historique
          const balanceHistoryEntry = {
            type: balanceForm.type,
            amount: amount,
            balanceType: balanceForm.balanceType,
            balanceLabel: getBalanceLabel(balanceForm.balanceType),
            previousBalance: currentBalance,
            newBalance: newBalance,
            reason: balanceForm.reason,
            notes: balanceForm.notes,
            adminId: currentUser.uid,
            adminName: currentUser.displayName || currentUser.email || 'Administrateur',
            timestamp: Date.now(),
            date: new Date().toISOString()
          };

          // Déterminer le chemin Firestore
          let firestorePath = '';
          switch(balanceForm.balanceType) {
            case 'wallet':
              firestorePath = 'balances.wallet.amount';
              break;
            case 'action':
              firestorePath = 'balances.action.amount';
              break;
            case 'referralEarnings':
              firestorePath = 'stats.referralEarnings';
              break;
          }

          // Préparer les mises à jour
          const updateData = {
            'balanceHistory': arrayUnion(balanceHistoryEntry),
            updatedAt: serverTimestamp()
          };

          updateData[firestorePath] = newBalance;

          // Mettre à jour les statistiques
          if (balanceForm.type === 'add') {
            updateData['stats.totalEarned'] = increment(amount);
            
            if (balanceForm.balanceType === 'wallet') {
              updateData['balances.totalDeposited.amount'] = increment(amount);
              updateData['stats.totalDeposited'] = increment(amount);
            } else if (balanceForm.balanceType === 'action') {
              updateData['stats.totalInvested'] = increment(amount);
            }
          } else {
            if (balanceForm.balanceType === 'wallet') {
              updateData['stats.totalWithdrawn'] = increment(amount);
            } else if (balanceForm.balanceType === 'action') {
              updateData['stats.totalInvested'] = increment(-amount);
            } else if (balanceForm.balanceType === 'referralEarnings') {
              updateData['stats.totalEarned'] = increment(-amount);
            }
          }

          // Appliquer la mise à jour
          await updateDoc(walletRef, updateData);

          // Invalider le cache
          state.invalidateCache('userDetails');
          state.invalidateCache('userWallet');

          // Recharger les détails
          await state.fetchUserDetails(userId, true);

          return {
            success: true,
            previousBalance: currentBalance,
            newBalance: newBalance,
            amount: amount
          };

        } catch (error) {
          console.error('❌ Erreur updateUserBalance:', error);
          return { success: false, error: error.message };

        } finally {
          state.setLoading('balanceUpdate', false);
        }
      },

      // Action sur un utilisateur (activer, suspendre, supprimer)
      userAction: async (action, userId) => {
        const state = get();
        state.setLoading('userAction', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { doc, updateDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore');

          const userRef = doc(db, 'users', userId);

          switch(action) {
            case 'activate':
              await updateDoc(userRef, {
                status: 'active',
                updatedAt: serverTimestamp()
              });
              break;
            case 'suspend':
              await updateDoc(userRef, {
                status: 'suspended',
                updatedAt: serverTimestamp()
              });
              break;
            case 'delete':
              const walletRef = doc(db, 'wallets', userId);
              await deleteDoc(walletRef);
              await deleteDoc(userRef);
              break;
          }

          // Invalider le cache
          state.invalidateCache('users');

          // Recharger
          await state.fetchUsers(true);

          return { success: true };

        } catch (error) {
          console.error(`❌ Erreur ${action} utilisateur:`, error);
          return { success: false, error: error.message };

        } finally {
          state.setLoading('userAction', false);
        }
      },

      // Actions groupées
      bulkUserAction: async (action, userIds) => {
        const state = get();
        state.setLoading('userAction', true);

        try {
          const { db } = await import('@/lib/firebase');
          const { doc, updateDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore');

          for (const userId of userIds) {
            const userRef = doc(db, 'users', userId);

            switch(action) {
              case 'activate':
                await updateDoc(userRef, {
                  status: 'active',
                  updatedAt: serverTimestamp()
                });
                break;
              case 'suspend':
                await updateDoc(userRef, {
                  status: 'suspended',
                  updatedAt: serverTimestamp()
                });
                break;
              case 'delete':
                await deleteDoc(userRef);
                break;
            }
          }

          // Invalider le cache
          state.invalidateCache('users');

          // Recharger
          await state.fetchUsers(true);

          return { success: true, count: userIds.length };

        } catch (error) {
          console.error('❌ Erreur action groupée:', error);
          return { success: false, error: error.message };

        } finally {
          state.setLoading('userAction', false);
        }
      },

      // Nettoyer les données
      clearUsersData: () => {
        set({
          usersData: {
            users: [],
            selectedUser: null,
            userDetails: null,
            userWallet: null,
            userTransactions: [],
            balanceHistory: []
          },
          cacheMetadata: {
            users: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false },
            userDetails: { lastUpdated: null, ttl: 2 * 60 * 1000, isFresh: false },
            userWallet: { lastUpdated: null, ttl: 1 * 60 * 1000, isFresh: false }
          },
          loadingStates: {
            users: false,
            userDetails: false,
            userWallet: false,
            balanceUpdate: false,
            userAction: false
          }
        });
      }
    }),
    {
      name: 'users-cache-storage',
      partialize: (state) => ({
        usersData: state.usersData,
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

// Helper function
const getBalanceLabel = (balanceType) => {
  switch(balanceType) {
    case 'wallet':
      return 'Solde Disponible';
    case 'action':
      return 'Solde Investi';
    case 'referralEarnings':
      return 'Gains Parrainage';
    default:
      return 'Solde';
  }
};
