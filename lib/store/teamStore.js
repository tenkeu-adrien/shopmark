// lib/store/teamStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTeamStore = create(
  persist(
    (set, get) => ({
      // === ÉTAT ===
      teamData: {
        invitationCode: "",
        invitationLink: "",
        teamMembers: { level1: 0, level2: 0, level3: 0, total: 0 },
        totalRevenue: 0,
        commissionEarned: 0,
        levels: []
      },
      
      filleulsData: {
        filleuls: [],
        stats: {
          total: 0,
          actifs: 0,
          inactifs: 0,
          totalInvesti: 0,
          bonusMois: 0,
          bonusSemaine: 0,
          totalBonus: 0
        }
      },
      
      // === MÉTADONNÉES DU CACHE ===
      cacheMetadata: {
        teamStats: {
          lastUpdated: null,
          ttl: 10 * 60 * 1000, // 10 minutes
          isFresh: false
        },
        filleuls: {
          lastUpdated: null,
          ttl: 5 * 60 * 1000, // 5 minutes
          isFresh: false
        }
      },
      
      loadingStates: {
        teamStats: false,
        filleuls: false
      },
      
      // === ACTIONS ===
      
      // Action: Mettre à jour les stats d'équipe
      setTeamData: (data) => {
        set((state) => ({
          teamData: data,
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
      
      // Action: Mettre à jour les filleuls
      setFilleulsData: (data) => {
        set((state) => ({
          filleulsData: data,
          cacheMetadata: {
            ...state.cacheMetadata,
            filleuls: {
              ...state.cacheMetadata.filleuls,
              lastUpdated: Date.now(),
              isFresh: true
            }
          }
        }));
      },
      
      // Action: Vérifier si le cache est valide
      isCacheValid: (key) => {
        const state = get();
        const cacheInfo = state.cacheMetadata[key];
        
        if (!cacheInfo || !cacheInfo.lastUpdated) {
          return false;
        }
        
        const age = Date.now() - cacheInfo.lastUpdated;
        return age < cacheInfo.ttl && cacheInfo.isFresh;
      },
      
      // Action: Forcer le rechargement
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
              teamStats: { ...state.cacheMetadata.teamStats, isFresh: false },
              filleuls: { ...state.cacheMetadata.filleuls, isFresh: false }
            }
          }));
        }
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
      
      // Action: Récupérer intelligemment les données (stale-while-revalidate)
      fetchTeamData: async (userId, forceRefresh = false) => {
        const state = get();
        
        // Si pas de forceRefresh et cache valide, retourner les données cache
        if (!forceRefresh && state.isCacheValid('teamStats')) {
          console.log('📦 Utilisation du cache pour teamStats');
          return state.teamData;
        }
        
        // Sinon, charger depuis le service
        state.setLoading('teamStats', true);
        
        try {
          const teamService = (await import('@/services/teamService')).default;
          const data = await teamService.getTeamStats(userId);
          
          // Mettre à jour le store
          state.setTeamData(data);
          
          // Rafraîchir en arrière-plan si forceRefresh = false
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchTeamData(userId, true).catch(console.error);
            }, 0);
          }
          
          return data;
        } catch (error) {
          console.error('Erreur fetchTeamData:', error);
          
          // Si erreur mais qu'on a des données cache, les retourner
          if (state.teamData.invitationCode) {
            console.log('⚠️ Retour aux données cache suite à erreur');
            return state.teamData;
          }
          throw error;
        } finally {
          state.setLoading('teamStats', false);
        }
      },
      
      // Action: Récupérer les filleuls
      fetchFilleulsData: async (userId, forceRefresh = false) => {
        const state = get();
        
        // Si pas de forceRefresh et cache valide
        if (!forceRefresh && state.isCacheValid('filleuls')) {
          console.log('📦 Utilisation du cache pour filleuls');
          return state.filleulsData;
        }
        
        // Sinon, charger depuis le service
        state.setLoading('filleuls', true);
        
        try {
          const teamService = (await import('@/services/teamService')).default;
          const data = await teamService.getFilleulsData(userId);
          
          // Mettre à jour le store
          state.setFilleulsData(data);
          
          // Rafraîchir en arrière-plan
          if (!forceRefresh) {
            setTimeout(() => {
              state.fetchFilleulsData(userId, true).catch(console.error);
            }, 0);
          }
          
          return data;
        } catch (error) {
          console.error('Erreur fetchFilleulsData:', error);
          
          // Retourner les données cache si disponibles
          if (state.filleulsData.filleuls.length > 0) {
            console.log('⚠️ Retour aux données cache suite à erreur');
            return state.filleulsData;
          }
          throw error;
        } finally {
          state.setLoading('filleuls', false);
        }
      },
      
      // Action: Précharger toutes les données
      preloadAllData: async (userId) => {
        try {
          const [teamData, filleulsData] = await Promise.allSettled([
            get().fetchTeamData(userId, false),
            get().fetchFilleulsData(userId, false)
          ]);
          
          return {
            teamData: teamData.status === 'fulfilled' ? teamData.value : null,
            filleulsData: filleulsData.status === 'fulfilled' ? filleulsData.value : null
          };
        } catch (error) {
          console.error('Erreur preloadAllData:', error);
        }
      },
      
      // Action: Nettoyer les données spécifiques à un utilisateur
      clearUserData: (userId) => {
        // Garder seulement les données non liées à l'utilisateur
        set({
          teamData: {
            invitationCode: "",
            invitationLink: "",
            teamMembers: { level1: 0, level2: 0, level3: 0, total: 0 },
            totalRevenue: 0,
            commissionEarned: 0,
            levels: []
          },
          filleulsData: {
            filleuls: [],
            stats: {
              total: 0,
              actifs: 0,
              inactifs: 0,
              totalInvesti: 0,
              bonusMois: 0,
              bonusSemaine: 0,
              totalBonus: 0
            }
          },
          cacheMetadata: {
            teamStats: { lastUpdated: null, ttl: 10 * 60 * 1000, isFresh: false },
            filleuls: { lastUpdated: null, ttl: 5 * 60 * 1000, isFresh: false }
          }
        });
      }
    }),
    {
      name: 'team-cache-storage',
      partialize: (state) => ({
        teamData: state.teamData,
        filleulsData: state.filleulsData,
        cacheMetadata: state.cacheMetadata
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Après réhydratation, marquer les données comme non fraîches
          // pour forcer un rafraîchissement au prochain chargement
          state.cacheMetadata.teamStats.isFresh = false;
          state.cacheMetadata.filleuls.isFresh = false;
        }
      }
    }
  )
);