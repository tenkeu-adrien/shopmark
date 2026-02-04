// lib/store/filleulsStore.js
import { create } from 'zustand';

export const useFilleulsStore = create((set, get) => ({
  // Filtres et états UI
  searchTerm: "",
  statusFilter: "all",
  currentPage: 1,
  itemsPerPage: 10,
  
  // Actions pour les filtres
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Getter pour les filleuls filtrés
  getFilteredFilleuls: (filleuls) => {
    const { searchTerm, statusFilter } = get();
    
    return filleuls.filter(filleul => {
      // Filtre par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          filleul.name.toLowerCase().includes(searchLower) ||
          filleul.phone.toLowerCase().includes(searchLower) ||
          filleul.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Filtre par statut
      if (statusFilter !== "all") {
        return filleul.status === statusFilter;
      }
      
      return true;
    });
  },
  
  // Getter pour la pagination
  getPaginatedFilleuls: (filleuls) => {
    const { currentPage, itemsPerPage } = get();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    return filleuls.slice(indexOfFirstItem, indexOfLastItem);
  },
  
  // Reset des filtres
  resetFilters: () => set({
    searchTerm: "",
    statusFilter: "all",
    currentPage: 1
  })
}));