"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
// Ajoutez ces imports
import teamService from "@/services/teamService";
import useTeamStore from "@/lib/teamStore";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ArrowLeft,
  Users,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Award,
  RefreshCw,
  AlertCircle,
  TrendingDown,
  BarChart3,
  Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MesFilleulsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);
  const [filleuls, setFilleuls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalBonus, setTotalBonus] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    inactifs: 0,
    totalInvesti: 0,
    bonusMois: 0,
    bonusSemaine: 0
  });


const getFilleulsDataFromService = async () => {
  try {
    console.log('🔄 Chargement des filleuls via service avec cache...');
    const data = await teamService.getFilleulsData(user.uid);
    return data;
  } catch (error) {
    console.error('Erreur service filleuls:', error);
    return { filleuls: [], stats: {} };
  }
};

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user?.uid) {
      loadFilleulsData();
    }
  }, [user, authLoading]);

 

const loadFilleulsData = async () => {
  if (!user?.uid) return;
  
  try {
    setLoading(true);
    
    const { filleuls, stats } = await getFilleulsDataFromService();
    
    // Trier par niveau puis par date
    const filleulsTries = filleuls.sort((a, b) => {
      if (a.niveauParrainage !== b.niveauParrainage) {
        return a.niveauParrainage - b.niveauParrainage;
      }
      return new Date(b.inscriptionDate) - new Date(a.inscriptionDate);
    });
    
    setFilleuls(filleulsTries);
    setTotalBonus(stats.totalBonus || 0);
    setStats({
      total: stats.total || 0,
      actifs: stats.actifs || 0,
      inactifs: (stats.total || 0) - (stats.actifs || 0),
      totalInvesti: stats.totalInvesti || 0,
      bonusMois: stats.bonusMois || 0,
      bonusSemaine: stats.bonusSemaine || 0
    });
    
  } catch (error) {
    console.error('❌ Erreur chargement filleuls:', error);
  } finally {
    setLoading(false);
  }
};
  const filteredFilleuls = filleuls.filter(filleul => {
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilleuls = filteredFilleuls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFilleuls.length / itemsPerPage);

  const formatDate = (date) => {
    if (!date) return "Date inconnue";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
  
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' CDF';
  };

// Remplacer handleRefresh par :
const handleRefresh = () => {
  useTeamStore.getState().invalidateCache(user.uid);
  loadFilleulsData();
};

  

  const getNiveauColor = (niveau) => {
    switch(niveau) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos filleuls...</p>
          <p className="text-sm text-gray-400 mt-2">Récupération des commissions sur 3 niveaux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes filleuls</h1>
                <p className="text-gray-600 text-sm mt-1">Gestion du réseau de parrainage (3 niveaux)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistiques en haut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total filleuls</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? `${((stats.actifs / stats.total) * 100).toFixed(1)}%` : '0%'} taux d'activation
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total investi</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalInvesti)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs uniquement</option>
                <option value="inactif">Inactifs uniquement</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-4">
            <span>{filteredFilleuls.length} filleul(s) trouvé(s) sur {filleuls.length}</span>
            {totalBonus > 0 && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-amber-600 font-medium text-[18px]">
                  Bonus total: {formatCurrency(totalBonus)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Table des filleuls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredFilleuls.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <Users className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">Aucun filleul trouvé</p>
                <p className="text-gray-400 mt-2 max-w-md">
                  {searchTerm 
                    ? 'Aucun résultat pour votre recherche'
                    : 'Vous n\'avez pas encore de filleuls. Partagez votre lien d\'invitation pour agrandir votre réseau !'
                  }
                </p>
                {!searchTerm && (
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Obtenir mon lien d'invitation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filleul
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investissement
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                        Niveau
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bonus %
                      </th>
                      
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200">
                    {currentFilleuls.map((filleul, index) => (
                      <motion.tr 
                        key={filleul.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {filleul.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {filleul.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(filleul.inscriptionDate)}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{filleul.phone}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className={`text-sm font-semibold ${filleul.montantInvesti > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                            {formatCurrency(filleul.montantInvesti)}
                          </div>
                          {filleul.totalInvestissements > 0 && (
                            <div className="text-xs text-gray-500">
                              {filleul.totalInvestissements} investissement(s)
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${getNiveauColor(filleul.niveauParrainage)}`}>
                            Niveau {filleul.niveauParrainage}
                          </span>
                          <div className="text-[10px] text-gray-500 mt-1">
                            {filleul.niveauInvestissement}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-blue-600">{filleul.commissionRate}%</div>
                          <div className="text-[10px] text-gray-500">
                            Commission niveau {filleul.niveauParrainage}
                          </div>
                        </td>

                        
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              filleul.status === 'actif' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {filleul.status === 'actif' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Actif
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Inactif
                                </>
                              )}
                            </span>
                          </div>
                          {filleul.premierInvestissementDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              1er invest: {formatDate(filleul.premierInvestissementDate)}
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredFilleuls.length)}</span> sur{" "}
                      <span className="font-medium">{filteredFilleuls.length}</span> filleuls
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Précédent
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                      >
                        Suivant
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Section Bonus Total en bas */}
          {totalBonus > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-900">Bonus total reçu</p>
                      <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalBonus)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Performance</p>
                      <p className="text-2xl font-bold text-green-700">
                        {stats.totalInvesti > 0 
                          ? `${((totalBonus / stats.totalInvesti) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </p>
                      <p className="text-xs text-green-700 mt-1">Retour sur investissements</p>
                    </div>
                  </div>
                </div>
                
             
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-amber-700">
                  💰 Ces commissions sont automatiquement ajoutées à votre solde disponible
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Informations sur les commissions */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">Comment fonctionnent les commissions ?</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Niveau 1 : 3%</strong> sur le premier investissement de chaque filleul direct</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Niveau 2 : 2%</strong> sur le premier investissement des filleuls indirects (niveau 2)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Niveau 3 : 1%</strong> sur le premier investissement des filleuls indirects (niveau 3)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Les commissions sont <strong>versées instantanément</strong> dès que votre filleul investit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Limite à 3 niveaux</strong> : Aucune commission au-delà du niveau 3</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}