// lib/store/dailyGainsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 🎯 DAILY GAINS STORE
 * 
 * Gère le système de gains journaliers avec sélection manuelle
 * 
 * Fonctionnalités:
 * - Calcul automatique des gains journaliers
 * - Sélection manuelle des bénéficiaires
 * - Historique des calculs
 * - Rapports détaillés
 * - Gestion des investissements éligibles
 */

export const useDailyGainsStore = create(
  persist(
    (set, get) => ({
      // === ÉTAT DES DONNÉES ===
      dailyGainsData: {
        eligibleInvestments: [],
        selectedInvestments: [],
        calculationResults: null,
        lastCalculation: null,
        calculationHistory: []
      },

      // === ÉTATS UI ===
      uiStates: {
        selectionMode: false,
        calculationDrawerOpen: false,
        calculatingDailyGains: false
      },

      // === PROGRESSION ===
      calculationProgress: {
        current: 0,
        total: 0,
        processed: 0,
        errors: 0,
        totalAmount: 0
      },

      // === MÉTADONNÉES DU CACHE ===
      cacheMetadata: {
        eligibleInvestments: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false }, // 10 min
        lastCalculation: { lastUpdated: null, ttl: 60 * 60 * 1000, isFresh: false } // 1 heure
      },

      // === ACTIONS ===

      // Mettre à jour les investissements éligibles
      setEligibleInvestments: (investments) => {
        set((state) => ({
          dailyGainsData: {
            ...state.dailyGainsData,
            eligibleInvestments: investments
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            eligibleInvestments: {
              ...state.cacheMetadata.eligibleInvestments,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Sélectionner/Désélectionner un investissement
      toggleInvestmentSelection: (investmentId) => {
        set((state) => {
          const selected = state.dailyGainsData.selectedInvestments;
          const newSelected = selected.includes(investmentId)
            ? selected.filter(id => id !== investmentId)
            : [...selected, investmentId];

          return {
            dailyGainsData: {
              ...state.dailyGainsData,
              selectedInvestments: newSelected
            }
          };
        });
      },

      // Sélectionner/Désélectionner tous les investissements
      toggleSelectAllInvestments: () => {
        set((state) => {
          const allIds = state.dailyGainsData.eligibleInvestments.map(inv => inv.id);
          const allSelected = state.dailyGainsData.selectedInvestments.length === allIds.length;

          return {
            dailyGainsData: {
              ...state.dailyGainsData,
              selectedInvestments: allSelected ? [] : allIds
            }
          };
        });
      },

      // Réinitialiser la sélection
      resetSelection: () => {
        set((state) => ({
          dailyGainsData: {
            ...state.dailyGainsData,
            selectedInvestments: []
          }
        }));
      },

      // Mettre à jour les résultats du calcul
      setCalculationResults: (results) => {
        set((state) => ({
          dailyGainsData: {
            ...state.dailyGainsData,
            calculationResults: results
          }
        }));
      },

      // Mettre à jour le dernier calcul
      setLastCalculation: (calculation) => {
        set((state) => ({
          dailyGainsData: {
            ...state.dailyGainsData,
            lastCalculation: calculation
          },
          cacheMetadata: {
            ...state.cacheMetadata,
            lastCalculation: {
              ...state.cacheMetadata.lastCalculation,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },

      // Mettre à jour la progression
      setCalculationProgress: (progress) => {
        set({ calculationProgress: progress });
      },

      // Gérer les états UI
      setSelectionMode: (mode) => {
        set((state) => ({
          uiStates: {
            ...state.uiStates,
            selectionMode: mode
          }
        }));
      },

      setCalculationDrawerOpen: (open) => {
        set((state) => ({
          uiStates: {
            ...state.uiStates,
            calculationDrawerOpen: open
          }
        }));
      },

      setCalculatingDailyGains: (calculating) => {
        set((state) => ({
          uiStates: {
            ...state.uiStates,
            calculatingDailyGains: calculating
          }
        }));
      },

      // === FETCHERS ===

      // Charger les investissements éligibles
      fetchEligibleInvestments: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.cacheMetadata.eligibleInvestments.isFresh) {
          console.log('📦 Cache investissements éligibles valide');
          return state.dailyGainsData.eligibleInvestments;
        }

        try {
          const { db } = await import('@/lib/firebase');
          const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore');

          console.log('📊 Récupération des investissements actifs...');

          // Récupérer tous les investissements actifs
          const activeInvestmentsQuery = query(
            collection(db, 'user_levels'),
            where('status', '==', 'active')
          );

          const investmentsSnapshot = await getDocs(activeInvestmentsQuery);
          const activeInvestments = investmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          console.log(`📈 ${activeInvestments.length} investissements actifs trouvés`);

          // Filtrer les investissements éligibles
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const eligibleInvestments = [];

          for (const investment of activeInvestments) {
            try {
              // Vérifier le wallet
              const walletRef = doc(db, 'wallets', investment.userId);
              const walletSnap = await getDoc(walletRef);

              if (!walletSnap.exists()) continue;

              const walletData = walletSnap.data();
              const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();

              // Vérifier si déjà payé aujourd'hui
              const alreadyProcessedToday = lastGainDate &&
                lastGainDate.getDate() === today.getDate() &&
                lastGainDate.getMonth() === today.getMonth() &&
                lastGainDate.getFullYear() === today.getFullYear();

              if (alreadyProcessedToday) continue;

              // Vérifier si l'investissement est toujours valide
              const endDate = investment.scheduledEndDate?.toDate?.();
              if (endDate && endDate < today) continue;

              eligibleInvestments.push(investment);
            } catch (error) {
              console.error(`Erreur vérification ${investment.userId}:`, error);
            }
          }

          console.log(`✅ ${eligibleInvestments.length} investissements éligibles`);

          state.setEligibleInvestments(eligibleInvestments);

          return eligibleInvestments;

        } catch (error) {
          console.error('❌ Erreur fetchEligibleInvestments:', error);
          return state.dailyGainsData.eligibleInvestments;
        }
      },

      // Charger le dernier calcul
      fetchLastCalculation: async (forceRefresh = false) => {
        const state = get();

        if (!forceRefresh && state.cacheMetadata.lastCalculation.isFresh) {
          console.log('📦 Cache dernier calcul valide');
          return state.dailyGainsData.lastCalculation;
        }

        try {
          const { db } = await import('@/lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');

          const calculationRef = doc(db, 'admin_logs', 'dailyGainsCalculation');
          const calculationSnap = await getDoc(calculationRef);

          if (calculationSnap.exists()) {
            const calculation = {
              id: calculationSnap.id,
              ...calculationSnap.data(),
              timestamp: calculationSnap.data().timestamp?.toDate?.() || new Date()
            };

            state.setLastCalculation(calculation);
            return calculation;
          }

          return null;

        } catch (error) {
          console.error('❌ Erreur fetchLastCalculation:', error);
          return state.dailyGainsData.lastCalculation;
        }
      },

      // === CALCUL DES GAINS ===

      // Calculer les gains pour tous les utilisateurs éligibles
      calculateDailyGainsForAll: async (currentAdmin) => {
        const state = get();

        try {
          state.setCalculatingDailyGains(true);
          state.setCalculationProgress({
            current: 0,
            total: 0,
            processed: 0,
            errors: 0,
            totalAmount: 0
          });

          const startTime = Date.now();

          // Charger les investissements éligibles
          const eligibleInvestments = await state.fetchEligibleInvestments(true);

          state.setCalculationProgress({
            current: 0,
            total: eligibleInvestments.length,
            processed: 0,
            errors: 0,
            totalAmount: 0
          });

          // Exécuter le calcul
          const results = await state.executeDailyGainsCalculation(
            eligibleInvestments.map(inv => inv.id),
            currentAdmin,
            startTime
          );

          return results;

        } catch (error) {
          console.error('❌ Erreur calculateDailyGainsForAll:', error);
          throw error;
        } finally {
          state.setCalculatingDailyGains(false);
        }
      },

      // Calculer les gains pour les investissements sélectionnés
      calculateDailyGainsForSelected: async (currentAdmin) => {
        const state = get();

        try {
          state.setCalculatingDailyGains(true);

          const selectedIds = state.dailyGainsData.selectedInvestments;

          if (selectedIds.length === 0) {
            throw new Error('Aucun investissement sélectionné');
          }

          state.setCalculationProgress({
            current: 0,
            total: selectedIds.length,
            processed: 0,
            errors: 0,
            totalAmount: 0
          });

          const startTime = Date.now();

          // Exécuter le calcul
          const results = await state.executeDailyGainsCalculation(
            selectedIds,
            currentAdmin,
            startTime
          );

          // Réinitialiser la sélection
          state.resetSelection();
          state.setSelectionMode(false);

          return results;

        } catch (error) {
          console.error('❌ Erreur calculateDailyGainsForSelected:', error);
          throw error;
        } finally {
          state.setCalculatingDailyGains(false);
        }
      },

      // Exécuter le calcul des gains (logique commune)
      executeDailyGainsCalculation: async (investmentIds, currentAdmin, startTime) => {
        const state = get();

        try {
          const { db } = await import('@/lib/firebase');
          const { doc, getDoc, collection, serverTimestamp, increment, runTransaction, setDoc } = await import('firebase/firestore');

          const eligibleInvestments = state.dailyGainsData.eligibleInvestments.filter(
            inv => investmentIds.includes(inv.id)
          );

          const results = {
            success: [],
            failed: [],
            totalAmount: 0
          };

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Traiter par lots
          const batchSize = 500;

          for (let i = 0; i < eligibleInvestments.length; i += batchSize) {
            const batch = eligibleInvestments.slice(i, i + batchSize);

            for (const investment of batch) {
              try {
                state.setCalculationProgress(prev => ({
                  ...prev,
                  current: i + batch.indexOf(investment) + 1
                }));

                // Calculer le gain
                const dailyGain = investment.dailyGain ||
                  (investment.investedAmount * (investment.dailyReturnRate || 0));

                if (!dailyGain || dailyGain <= 0) {
                  results.failed.push({
                    userId: investment.userId,
                    investmentId: investment.id,
                    reason: 'Gain journalier invalide ou nul',
                    dailyGain,
                    investment
                  });
                  state.setCalculationProgress(prev => ({ ...prev, errors: prev.errors + 1 }));
                  continue;
                }

                // Utiliser une transaction Firestore
                await runTransaction(db, async (transaction) => {
                  const walletRef = doc(db, 'wallets', investment.userId);
                  const walletSnap = await transaction.get(walletRef);

                  if (!walletSnap.exists()) {
                    throw new Error('Portefeuille non trouvé');
                  }

                  const walletData = walletSnap.data();

                  // Vérifier à nouveau la date
                  const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
                  const alreadyProcessed = lastGainDate &&
                    lastGainDate.getDate() === today.getDate() &&
                    lastGainDate.getMonth() === today.getMonth() &&
                    lastGainDate.getFullYear() === today.getFullYear();

                  if (alreadyProcessed) {
                    throw new Error('Déjà payé aujourd\'hui');
                  }

                  // Mettre à jour le wallet
                  transaction.update(walletRef, {
                    'balances.wallet.amount': increment(dailyGain),
                    'balances.wallet.lastUpdated': serverTimestamp(),
                    'stats.totalEarned': increment(dailyGain),
                    'stats.totalDailyGains': increment(dailyGain),
                    'stats.lastDailyGainAt': serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    version: increment(1)
                  });

                  // Créer la transaction
                  const transactionRef = doc(collection(db, 'transactions'));
                  transaction.set(transactionRef, {
                    transactionId: `GAIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId: investment.userId,
                    userEmail: investment.userEmail,
                    type: 'daily_gain',
                    amount: dailyGain,
                    currency: 'CDF',
                    status: 'completed',
                    description: `Gain journalier - ${investment.levelName || 'Niveau actif'}`,
                    metadata: {
                      investmentId: investment.id,
                      levelId: investment.levelId,
                      levelName: investment.levelName,
                      investedAmount: investment.investedAmount,
                      dailyReturnRate: investment.dailyReturnRate,
                      dailyGain: investment.dailyGain,
                      calculationBatch: startTime.toString(),
                      adminId: currentAdmin.uid,
                      adminName: currentAdmin.displayName || currentAdmin.email
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                  });
                });

                results.success.push({
                  userId: investment.userId,
                  investmentId: investment.id,
                  dailyGain,
                  investment
                });

                results.totalAmount += dailyGain;
                state.setCalculationProgress(prev => ({
                  ...prev,
                  processed: prev.processed + 1,
                  totalAmount: prev.totalAmount + dailyGain
                }));

              } catch (error) {
                console.error(`Erreur traitement ${investment.userId}:`, error);
                results.failed.push({
                  userId: investment.userId,
                  investmentId: investment.id,
                  reason: error.message,
                  error,
                  investment
                });
                state.setCalculationProgress(prev => ({ ...prev, errors: prev.errors + 1 }));
              }
            }
          }

          // Enregistrer le calcul
          const calculationRef = doc(db, 'admin_logs', 'dailyGainsCalculation');
          const calculationData = {
            date: today.toISOString().split('T')[0],
            timestamp: serverTimestamp(),
            adminId: currentAdmin.uid,
            adminName: currentAdmin.displayName || currentAdmin.email,
            usersProcessed: results.success.length,
            totalAmountDistributed: results.totalAmount,
            errors: results.failed.length,
            processingTime: Date.now() - startTime,
            status: 'completed',
            details: {
              totalInvestments: investmentIds.length,
              successCount: results.success.length,
              failedCount: results.failed.length
            }
          };

          await setDoc(calculationRef, calculationData, { merge: true });

          // Mettre à jour l'état
          state.setLastCalculation({
            id: 'dailyGainsCalculation',
            ...calculationData,
            timestamp: new Date()
          });

          state.setCalculationResults({
            ...results,
            processingTime: Date.now() - startTime,
            calculationDate: new Date()
          });

          state.setCalculationDrawerOpen(true);

          return results;

        } catch (error) {
          console.error('❌ Erreur executeDailyGainsCalculation:', error);
          throw error;
        }
      },

      // Nettoyer les données
      clearDailyGainsData: () => {
        set({
          dailyGainsData: {
            eligibleInvestments: [],
            selectedInvestments: [],
            calculationResults: null,
            lastCalculation: null,
            calculationHistory: []
          },
          uiStates: {
            selectionMode: false,
            calculationDrawerOpen: false,
            calculatingDailyGains: false
          },
          calculationProgress: {
            current: 0,
            total: 0,
            processed: 0,
            errors: 0,
            totalAmount: 0
          },
          cacheMetadata: {
            eligibleInvestments: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false },
            lastCalculation: { lastUpdated: null, ttl: 60 * 60 * 1000, isFresh: false }
          }
        });
      }
    }),
    {
      name: 'daily-gains-cache-storage',
      partialize: (state) => ({
        dailyGainsData: {
          ...state.dailyGainsData,
          selectedInvestments: [], // Ne pas persister la sélection
          calculationResults: null // Ne pas persister les résultats
        },
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
