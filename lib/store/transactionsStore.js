// // lib/store/transactionsStore.js
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useTransactionsStore = create(
//   persist(
//     (set, get) => ({
//       // === ÉTAT ===
//     transactionsData: {
//         retraits: [],
//         investissements: []
//       },
      
//       // === MÉTADONNÉES ===
//       cacheMetadata: {
//         transactions: {
//           lastUpdated: null,
//           ttl: 10 * 60 * 1000, // 10 minutes
//           isFresh: false
//         }
//       },
      
//       // === ÉTATS ===
//       loadingStates: {
//         transactions: false
//       },
      
//       // === ACTIONS ===
//       setTransactionsData: (data) => {
//         set((state) => ({
//           transactionsData: data,
//           cacheMetadata: {
//             ...state.cacheMetadata,
//             transactions: {
//               ...state.cacheMetadata.transactions,
//               lastUpdated: Date.now(),
//               isFresh: true
//             }
//           }
//         }));
//       },
      
//       setLoading: (key, isLoading) => {
//         set((state) => ({
//           loadingStates: {
//             ...state.loadingStates,
//             [key]: isLoading
//           }
//         }));
//       },
      
//       isCacheValid: () => {
//         const state = get();
//         const cacheInfo = state.cacheMetadata.transactions;
        
//         if (!cacheInfo || !cacheInfo.lastUpdated) {
//           return false;
//         }
        
//         const age = Date.now() - cacheInfo.lastUpdated;
//         return age < cacheInfo.ttl && cacheInfo.isFresh;
//       },
      
//       invalidateCache: () => {
//         set((state) => ({
//           cacheMetadata: {
//             ...state.cacheMetadata,
//             transactions: {
//               ...state.cacheMetadata.transactions,
//               isFresh: false
//             }
//           }
//         }));
//       },
      
//       // Récupérer les transactions
//       fetchTransactionsData: async (userId, forceRefresh = false) => {
//         const state = get();
        
//         if (!forceRefresh && state.isCacheValid() && state.transactionsData.retraits.length > 0) {
//           console.log('📦 Utilisation cache transactions');
//           return state.transactionsData;
//         }
        
//         state.setLoading('transactions', true);
        
//         try {
//           // Simuler le chargement depuis votre service financeService
//           // Vous adapterez avec votre logique existante
//           const transactions = await state.loadUserTransactions(userId);
          
//           state.setTransactionsData(transactions);
          
//           // Rafraîchir en arrière-plan
//           if (!forceRefresh) {
//             setTimeout(() => {
//               state.fetchTransactionsData(userId, true).catch(console.error);
//             }, 0);
//           }
          
//           return transactions;
          
//         } catch (error) {
//           console.error('Erreur fetchTransactionsData:', error);
          
//           // Fallback au cache
//           if (state.transactionsData.retraits.length > 0) {
//             console.log('⚠️ Fallback cache transactions');
//             return state.transactionsData;
//           }
          
//           // Fallback aux données demo
//           return {
//             retraits: retraitsDataDemo,
//             investissements: investissementsDataDemo
//           };
          
//         } finally {
//           state.setLoading('transactions', false);
//         }
//       },
      
//       // Fonction de chargement (à adapter avec votre logique)
//       loadUserTransactions: async (userId) => {
//         // Ici vous intégrerez votre logique financeService.getUserTransactions
//         // Pour l'exemple, je retourne des données vides
//         return {
//           retraits: [],
//           investissements: []
//         };
//       },
      
//       clearTransactionsData: () => {
//         set({
//           transactionsData: {
//             retraits: [],
//             investissements: []
//           },
//           cacheMetadata: {
//             transactions: {
//               lastUpdated: null,
//               ttl: 10 * 60 * 1000,
//               isFresh: false
//             }
//           }
//         });
//       }
//     }),
//     {
//       name: 'transactions-cache-storage',
//       partialize: (state) => ({
//         transactionsData: state.transactionsData,
//         cacheMetadata: state.cacheMetadata
//       })
//     }
//   )
// );

// // Données de démo (pour fallback)
// const retraitsDataDemo = [
//   { id: 1, libelle: 'Retrait commandé', date: '15 déc. 2024', montant: 15000, status: 'pending' },
//   { id: 2, libelle: 'Retrait commandé', date: '14 déc. 2024', montant: 8500, status: 'confirmed' },
// ];

// const investissementsDataDemo = [
//   { id: 1, libelle: 'Investissement', date: '15 déc. 2024', montant: 25000, status: 'pending' },
//   { id: 2, libelle: 'Investissement', date: '14 déc. 2024', montant: 18000, status: 'confirmed' },
// ];


// lib/store/transactionsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTransactionsStore = create(
  persist(
    (set, get) => ({
      // === ÉTAT ===
      transactionsData: {
        retraits: [],
        investissements: []
      },
      
      // === MÉTADONNÉES ===
      cacheMetadata: {
        transactions: {
          lastUpdated: null,
          ttl: 10 * 60 * 1000, // 10 minutes
          isFresh: false
        }
      },
      
      // === ÉTATS DE CHARGEMENT ===
      loadingStates: {
        transactions: false
      },
      
      // === ACTIONS ===
      
      // Action: Mettre à jour les transactions
      setTransactionsData: (data) => {
        set((state) => ({
          transactionsData: data,
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
      
      // Action: Définir l'état de chargement
      setLoading: (key, isLoading) => {
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: isLoading
          }
        }));
      },
      
      // Action: Vérifier si le cache est valide
      isCacheValid: () => {
        const state = get();
        const cacheInfo = state.cacheMetadata.transactions;
        
        if (!cacheInfo || !cacheInfo.lastUpdated) {
          return false;
        }
        
        const age = Date.now() - cacheInfo.lastUpdated;
        return age < cacheInfo.ttl && cacheInfo.isFresh;
      },
      
      // Action: Invalider le cache
      invalidateCache: () => {
        set((state) => ({
          cacheMetadata: {
            ...state.cacheMetadata,
            transactions: {
              ...state.cacheMetadata.transactions,
              isFresh: false
            }
          }
        }));
      },
      
      // Action: Récupérer les transactions depuis Firestore
      fetchTransactionsData: async (userId, forceRefresh = false) => {
        const state = get();
        
        // Si pas de forceRefresh et cache valide, retourner les données cache
        if (!forceRefresh && state.isCacheValid() && state.transactionsData.retraits.length > 0) {
          console.log('📦 Utilisation cache transactions');
          return state.transactionsData;
        }
        
        state.setLoading('transactions', true);
        
        try {
          console.log('🔄 Chargement transactions depuis Firestore pour:', userId);
          
          // Charger depuis votre service financeService
          const transactions = await state.loadUserTransactionsFromFirestore(userId);
          
          // Mettre à jour le store
          state.setTransactionsData(transactions);
          
          // Rafraîchir en arrière-plan si nécessaire
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchTransactionsData(userId, true).catch(console.error);
            }, 0);
          }
          
          return transactions;
          
        } catch (error) {
          console.error('❌ Erreur fetchTransactionsData:', error);
          
          // Fallback 1: Retourner les données cache si disponibles
          if (state.transactionsData.retraits.length > 0) {
            console.log('⚠️ Fallback aux données cache');
            return state.transactionsData;
          }
          
          // Fallback 2: Retourner les données de démo
          console.log('🔄 Utilisation données de démo');
          return {
            retraits: retraitsDataDemo,
            investissements: investissementsDataDemo
          };
          
        } finally {
          state.setLoading('transactions', false);
        }
      },
      
      // Fonction: Charger les transactions depuis Firestore
      loadUserTransactionsFromFirestore: async (userId) => {
        try {
          // Import dynamique pour éviter les erreurs de SSR
          const { financeService } = await import('@/lib/financeService');
          
          // Utiliser votre service existant
          const userTransactions = await financeService.getUserTransactions(userId);
          
          if (!userTransactions) {
            console.log('Aucune transaction trouvée pour:', userId);
            return {
              retraits: [],
              investissements: []
            };
          }
          
          // Traiter les retraits
          const retraits = (userTransactions.withdrawals || []).map(transaction => {
            const createdAt = transaction.createdAt || new Date();
            const dateFormatted = formatDateForStore(createdAt);
            
            return {
              id: transaction.withdrawalId || `retrait_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              libelle: transaction.description || `Retrait - ${transaction.status || 'pending'}`,
              date: dateFormatted,
              montant: transaction.amount || 0,
              status: transaction.status || 'pending',
              recipientName: transaction.recipientName || 'Non spécifié',
              recipientPhone: transaction.recipientPhone || 'Non spécifié',
              paymentMethod: transaction.paymentMethod || 'Non spécifié',
              fees: transaction.fees || 0,
              netAmount: transaction.netAmount || transaction.amount || 0,
              adminNotes: transaction.adminNotes || '',
              metadata: transaction.metadata || {},
              createdAt: createdAt
            };
          });
          
          // Traiter les investissements/dépôts
          const investissements = (userTransactions.deposits || []).map(transaction => {
            const createdAt = transaction.createdAt || new Date();
            const dateFormatted = formatDateForStore(createdAt);
            
            return {
              id: transaction.depositId || `invest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              libelle: transaction.description || `Investissement - ${transaction.status || 'pending'}`,
              date: dateFormatted,
              montant: transaction.amount || 0,
              status: transaction.status || 'pending',
              paymentMethod: transaction.paymentMethod || 'Non spécifié',
              agentNumber: transaction.agentNumber || 'Non spécifié',
              transactionId: transaction.transactionId || 'N/A',
              totalAmount: transaction.totalAmount || transaction.amount || 0,
              adminNotes: transaction.adminNotes || '',
              metadata: transaction.metadata || {},
              createdAt: createdAt
            };
          });
          
          // Trier par date (plus récent en premier)
          const sortedRetraits = retraits.sort((a, b) => {
            const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
          });
          
          const sortedInvestissements = investissements.sort((a, b) => {
            const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
          });
          
          console.log(`✅ Transactions chargées: ${sortedRetraits.length} retraits, ${sortedInvestissements.length} investissements`);
          
          return {
            retraits: sortedRetraits,
            investissements: sortedInvestissements
          };
          
        } catch (error) {
          console.error('❌ Erreur loadUserTransactionsFromFirestore:', error);
          throw error;
        }
      },
      
      // Action: Mettre à jour une transaction spécifique (pour admin)
      updateTransactionStatus: async (transactionId, newStatus, adminNotes = '') => {
        try {
          console.log(`🔄 Mise à jour transaction ${transactionId} -> ${newStatus}`);
          
          const state = get();
          const { transactionsData } = state;
          
          // Rechercher dans les retraits
          const updatedRetraits = transactionsData.retraits.map(transaction => {
            if (transaction.id === transactionId) {
              return {
                ...transaction,
                status: newStatus,
                adminNotes: adminNotes || transaction.adminNotes,
                updatedAt: new Date().toISOString()
              };
            }
            return transaction;
          });
          
          // Rechercher dans les investissements
          const updatedInvestissements = transactionsData.investissements.map(transaction => {
            if (transaction.id === transactionId) {
              return {
                ...transaction,
                status: newStatus,
                adminNotes: adminNotes || transaction.adminNotes,
                updatedAt: new Date().toISOString()
              };
            }
            return transaction;
          });
          
          // Mettre à jour le store
          state.setTransactionsData({
            retraits: updatedRetraits,
            investissements: updatedInvestissements
          });
          
          // TODO: Ici vous pouvez aussi mettre à jour Firestore
          // await updateTransactionInFirestore(transactionId, newStatus, adminNotes);
          
          return true;
          
        } catch (error) {
          console.error('❌ Erreur updateTransactionStatus:', error);
          return false;
        }
      },
      
      // Action: Filtrer les transactions par statut
      getTransactionsByStatus: (type, status) => {
        const state = get();
        const transactions = state.transactionsData[type] || [];
        
        if (status === 'all') {
          return transactions;
        }
        
        return transactions.filter(transaction => transaction.status === status);
      },
      
      // Action: Obtenir les statistiques
      getTransactionsStats: () => {
        const state = get();
        const { retraits, investissements } = state.transactionsData;
        
        const stats = {
          retraits: {
            total: retraits.length,
            pending: retraits.filter(t => t.status === 'pending').length,
            confirmed: retraits.filter(t => t.status === 'confirmed' || t.status === 'completed').length,
            rejected: retraits.filter(t => t.status === 'rejected').length,
            totalAmount: retraits.reduce((sum, t) => sum + (t.montant || 0), 0),
            pendingAmount: retraits
              .filter(t => t.status === 'pending')
              .reduce((sum, t) => sum + (t.montant || 0), 0)
          },
          investissements: {
            total: investissements.length,
            pending: investissements.filter(t => t.status === 'pending').length,
            confirmed: investissements.filter(t => t.status === 'confirmed' || t.status === 'completed').length,
            rejected: investissements.filter(t => t.status === 'rejected').length,
            totalAmount: investissements.reduce((sum, t) => sum + (t.montant || 0), 0),
            pendingAmount: investissements
              .filter(t => t.status === 'pending')
              .reduce((sum, t) => sum + (t.montant || 0), 0)
          }
        };
        
        return stats;
      },
      
      // Action: Nettoyer les données
      clearTransactionsData: () => {
        set({
          transactionsData: {
            retraits: [],
            investissements: []
          },
          cacheMetadata: {
            transactions: {
              lastUpdated: null,
              ttl: 10 * 60 * 1000,
              isFresh: false
            }
          },
          loadingStates: {
            transactions: false
          }
        });
      },
      
      // Action: Rechercher des transactions
      searchTransactions: (searchTerm, type = 'all') => {
        const state = get();
        const { retraits, investissements } = state.transactionsData;
        
        const searchLower = searchTerm.toLowerCase();
        
        const filterBySearch = (transactions) => {
          return transactions.filter(transaction => {
            return (
              (transaction.libelle && transaction.libelle.toLowerCase().includes(searchLower)) ||
              (transaction.recipientName && transaction.recipientName.toLowerCase().includes(searchLower)) ||
              (transaction.recipientPhone && transaction.recipientPhone.includes(searchTerm)) ||
              (transaction.transactionId && transaction.transactionId.toLowerCase().includes(searchLower)) ||
              (transaction.agentNumber && transaction.agentNumber.includes(searchTerm))
            );
          });
        };
        
        if (type === 'retraits') {
          return { retraits: filterBySearch(retraits), investissements: [] };
        } else if (type === 'investissements') {
          return { retraits: [], investissements: filterBySearch(investissements) };
        } else {
          return {
            retraits: filterBySearch(retraits),
            investissements: filterBySearch(investissements)
          };
        }
      }
    }),
    {
      name: 'transactions-cache-storage',
      partialize: (state) => ({
        transactionsData: state.transactionsData,
        cacheMetadata: state.cacheMetadata
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Après réhydratation, marquer comme non frais pour forcer un rafraîchissement
          state.cacheMetadata.transactions.isFresh = false;
        }
      }
    }
  )
);

// Helper function: Formater la date pour le store
const formatDateForStore = (dateString) => {
  if (!dateString) return 'Date inconnue';
  
  try {
    const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur formatage date:', error, dateString);
    return 'Date inconnue';
  }
};

// Helper function: Obtenir le texte du statut en français
export const getStatusText = (status) => {
  switch(status) {
    case 'confirmed':
    case 'completed':
      return 'Confirmé';
    case 'pending':
      return 'En attente';
    case 'rejected':
      return 'Rejeté';
    case 'processing':
      return 'En traitement';
    default:
      return status || 'Inconnu';
  }
};

// Helper function: Obtenir la couleur du statut
export const getStatusColor = (status) => {
  switch(status) {
    case 'confirmed':
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'pending':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'rejected':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Helper function: Formater un montant
export const formatMontant = (montant) => {
  if (montant === null || montant === undefined) return '0';
  return new Intl.NumberFormat('fr-FR').format(Math.round(montant));
};

// Données de démonstration (fallback)
export const retraitsDataDemo = [
  { 
    id: 1, 
    libelle: 'Retrait commandé', 
    date: '15 déc. 2024', 
    montant: 15000, 
    status: 'pending',
    recipientName: 'Jean Dupont',
    recipientPhone: '+243 81 123 4567',
    paymentMethod: 'Mobile Money',
    fees: 500,
    netAmount: 14500,
    adminNotes: '',
    createdAt: new Date('2024-12-15')
  },
  { 
    id: 2, 
    libelle: 'Retrait commandé', 
    date: '14 déc. 2024', 
    montant: 8500, 
    status: 'confirmed',
    recipientName: 'Marie Curie',
    recipientPhone: '+243 82 987 6543',
    paymentMethod: 'Orange Money',
    fees: 300,
    netAmount: 8200,
    adminNotes: 'Paiement effectué',
    createdAt: new Date('2024-12-14')
  },
  { 
    id: 3, 
    libelle: 'Retrait commandé', 
    date: '13 déc. 2024', 
    montant: 23000, 
    status: 'rejected',
    recipientName: 'Pierre Martin',
    recipientPhone: '+243 84 555 1234',
    paymentMethod: 'Airtel Money',
    fees: 0,
    netAmount: 0,
    adminNotes: 'Numéro incorrect',
    createdAt: new Date('2024-12-13')
  },
  { 
    id: 4, 
    libelle: 'Retrait commandé', 
    date: '12 déc. 2024', 
    montant: 12500, 
    status: 'pending',
    recipientName: 'Sophie Bernard',
    recipientPhone: '+243 89 777 8888',
    paymentMethod: 'Vodacom',
    fees: 400,
    netAmount: 12100,
    adminNotes: '',
    createdAt: new Date('2024-12-12')
  },
  { 
    id: 5, 
    libelle: 'Retrait commandé', 
    date: '11 déc. 2024', 
    montant: 18000, 
    status: 'confirmed',
    recipientName: 'Luc Dubois',
    recipientPhone: '+243 81 999 0000',
    paymentMethod: 'Mobile Money',
    fees: 600,
    netAmount: 17400,
    adminNotes: 'Transaction rapide',
    createdAt: new Date('2024-12-11')
  },
];

export const investissementsDataDemo = [
  { 
    id: 1, 
    libelle: 'Investissement Niveau 1', 
    date: '15 déc. 2024', 
    montant: 25000, 
    status: 'pending',
    paymentMethod: 'Mobile Money',
    agentNumber: '+243 81 111 2222',
    transactionId: 'TX123456',
    totalAmount: 25000,
    adminNotes: 'En attente de confirmation',
    createdAt: new Date('2024-12-15')
  },
  { 
    id: 2, 
    libelle: 'Investissement Niveau 2', 
    date: '14 déc. 2024', 
    montant: 18000, 
    status: 'confirmed',
    paymentMethod: 'Orange Money',
    agentNumber: '+243 82 333 4444',
    transactionId: 'TX654321',
    totalAmount: 18000,
    adminNotes: 'Investissement validé',
    createdAt: new Date('2024-12-14')
  },
  { 
    id: 3, 
    libelle: 'Investissement Niveau 3', 
    date: '13 déc. 2024', 
    montant: 32000, 
    status: 'pending',
    paymentMethod: 'Airtel Money',
    agentNumber: '+243 84 555 6666',
    transactionId: 'TX789012',
    totalAmount: 32000,
    adminNotes: '',
    createdAt: new Date('2024-12-13')
  },
  { 
    id: 4, 
    libelle: 'Investissement Niveau 1', 
    date: '12 déc. 2024', 
    montant: 15500, 
    status: 'rejected',
    paymentMethod: 'Vodacom',
    agentNumber: '+243 89 777 8888',
    transactionId: 'TX345678',
    totalAmount: 15500,
    adminNotes: 'Transaction expirée',
    createdAt: new Date('2024-12-12')
  },
  { 
    id: 5, 
    libelle: 'Investissement Niveau 2', 
    date: '11 déc. 2024', 
    montant: 27500, 
    status: 'confirmed',
    paymentMethod: 'Mobile Money',
    agentNumber: '+243 81 999 0000',
    transactionId: 'TX901234',
    totalAmount: 27500,
    adminNotes: 'Investissement réussi',
    createdAt: new Date('2024-12-11')
  },
];