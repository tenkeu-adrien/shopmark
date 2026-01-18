// stores/teamStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTeamStore = create(
  persist(
    (set, get) => ({
      // Cache des stats d'équipe par utilisateur
      teamStatsCache: {},
      
      // Cache des filleuls par utilisateur
      filleulsCache: {},
      
      // Cache des transactions de commission
      commissionsCache: {},
      
      // Timestamps pour la validation du cache
      lastUpdated: {},
      
      // Durée de validité du cache (5 minutes)
      cacheDuration: 5 * 60 * 1000,
      
      // Ajouter des stats au cache
      setTeamStats: (userId, stats) => {
        set((state) => ({
          teamStatsCache: {
            ...state.teamStatsCache,
            [userId]: {
              ...stats,
              timestamp: Date.now()
            }
          },
          lastUpdated: {
            ...state.lastUpdated,
            [userId]: Date.now()
          }
        }));
      },
      
      // Récupérer les stats du cache si valides
      getTeamStats: (userId) => {
        const { teamStatsCache, cacheDuration } = get();
        const cached = teamStatsCache[userId];
        
        if (cached && Date.now() - cached.timestamp < cacheDuration) {
          console.log('📦 Cache HIT pour teamStats de', userId);
          return cached;
        }
        
        console.log('📦 Cache MISS pour teamStats de', userId);
        return null;
      },
      
      // Ajouter des filleuls au cache
      setFilleuls: (userId, filleuls) => {
        set((state) => ({
          filleulsCache: {
            ...state.filleulsCache,
            [userId]: {
              data: filleuls,
              timestamp: Date.now()
            }
          }
        }));
      },
      
      // Récupérer les filleuls du cache
      getFilleuls: (userId) => {
        const { filleulsCache, cacheDuration } = get();
        const cached = filleulsCache[userId];
        
        if (cached && Date.now() - cached.timestamp < cacheDuration) {
          console.log('📦 Cache HIT pour filleuls de', userId);
          return cached.data;
        }
        
        console.log('📦 Cache MISS pour filleuls de', userId);
        return null;
      },
      
      // Invalider le cache d'un utilisateur
      invalidateCache: (userId) => {
        set((state) => {
          const newState = { ...state };
          delete newState.teamStatsCache[userId];
          delete newState.filleulsCache[userId];
          delete newState.commissionsCache[userId];
          delete newState.lastUpdated[userId];
          return newState;
        });
      },
      
      // Purger tout le cache
      clearAllCache: () => {
        set({
          teamStatsCache: {},
          filleulsCache: {},
          commissionsCache: {},
          lastUpdated: {}
        });
      }
    }),
    {
      name: 'team-cache-storage',
      getStorage: () => localStorage
    }
  )
);

export default useTeamStore;