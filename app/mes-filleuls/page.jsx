"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit
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
  RefreshCw
} from "lucide-react";
import Link from "next/link";

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
    totalInvesti: 0
  });

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
      
      // 1. Récupérer tous les filleuls directs (niveau 1)
      const filleulsQuery = query(
        collection(db, 'users'),
        where('referrerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const filleulsSnapshot = await getDocs(filleulsQuery);
      const filleulsList = [];
      let totalBonusCalc = 0;
      let totalInvesti = 0;
      let actifsCount = 0;
      
      // 2. Pour chaque filleul, récupérer les détails supplémentaires
      for (const filleulDoc of filleulsSnapshot.docs) {
        const filleulData = filleulDoc.data();
        const filleulId = filleulDoc.id;
        
        // Récupérer les investissements du filleul
        const userLevelsQuery = query(
          collection(db, 'user_levels'),
          where('userId', '==', filleulId),
          where('isFirstInvestment', '==', true)
        );
        
        const userLevelsSnapshot = await getDocs(userLevelsQuery);
        const firstInvestment = userLevelsSnapshot.docs[0];
        
        // Récupérer le wallet du filleul
        const walletDoc = await getDoc(doc(db, 'wallets', filleulId));
        const walletData = walletDoc.exists() ? walletDoc.data() : {};
        
        // Récupérer les transactions de parrainage liées à ce filleul
        const commissionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid),
          where('type', '==', 'referral_commission'),
          where('metadata.referredUserId', '==', filleulId)
        );
        
        const commissionsSnapshot = await getDocs(commissionsQuery);
        const totalCommission = commissionsSnapshot.docs.reduce((sum, doc) => {
          return sum + (doc.data().amount || 0);
        }, 0);
        
        totalBonusCalc += totalCommission;
        
        // Déterminer le statut
        let status = "inactif";
        if (firstInvestment) {
          status = "actif";
          actifsCount++;
          totalInvesti += firstInvestment.data().investedAmount || 0;
        }
        
        // Déterminer le pourcentage de commission (3% pour niveau 1)
        const commissionRate = 3;
        
        filleulsList.push({
          id: filleulId,
          name: filleulData.displayName || filleulData.phone || "Utilisateur",
          phone: filleulData.phone || "Non renseigné",
          email: filleulData.email || "Sans email",
          inscriptionDate: filleulData.createdAt?.toDate?.() || new Date(),
          montantInvesti: firstInvestment?.data()?.investedAmount || 0,
          niveauInvestissement: firstInvestment?.data()?.levelName || "Non investi",
          commissionRate: commissionRate,
          bonusGagne: totalCommission,
          status: status,
          lastLogin: filleulData.lastLogin?.toDate?.() || null,
          walletBalance: walletData.balances?.wallet?.amount || 0,
          investedBalance: walletData.balances?.action?.amount || 0
        });
      }
      
      setFilleuls(filleulsList);
      setTotalBonus(totalBonusCalc);
      setStats({
        total: filleulsList.length,
        actifs: actifsCount,
        inactifs: filleulsList.length - actifsCount,
        totalInvesti: totalInvesti
      });
      
    } catch (error) {
      console.error('Erreur chargement filleuls:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des filleuls
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRefresh = () => {
    loadFilleulsData();
  };

  const handleExport = () => {
    const csv = [
      ['Nom', 'Téléphone', 'Email', 'Date inscription', 'Montant investi', 'Niveau', 'Bonus %', 'Bonus gagné', 'Statut'],
      ...filteredFilleuls.map(f => [
        f.name,
        f.phone,
        f.email,
        formatDate(f.inscriptionDate),
        f.montantInvesti,
        f.niveauInvestissement,
        `${f.commissionRate}%`,
        f.bonusGagne,
        f.status === 'actif' ? 'Actif' : 'Inactif'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes_filleuls_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos filleuls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes filleuls</h1>
                <p className="text-gray-600 text-sm mt-1">Gérez votre réseau de parrainage</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualiser</span>
              </button>
              
              <Link 
                href="/equipe"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
              >
                <Award className="w-4 h-4" />
                <span>Vue d'ensemble</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques en haut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total filleuls</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total investi</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalInvesti)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bonus total</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalBonus)}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
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
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            {filteredFilleuls.length} filleul(s) trouvé(s) sur {filleuls.length}
          </div>
        </div>

        {/* Table des filleuls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Filleul
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Inscription
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Investissement
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Bonus %
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonus gagné
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {currentFilleuls.length > 0 ? (
                  currentFilleuls.map((filleul, index) => (
                    <tr 
                      key={filleul.id} 
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {filleul.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{filleul.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">{filleul.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{filleul.phone}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(filleul.inscriptionDate)}</div>
                        {filleul.lastLogin && (
                          <div className="text-xs text-gray-500">
                            Dernière connexion: {formatDate(filleul.lastLogin)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${filleul.montantInvesti > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {formatCurrency(filleul.montantInvesti)}
                        </div>
                        {filleul.montantInvesti > 0 && (
                          <div className="text-xs text-gray-500">
                            Actuel: {formatCurrency(filleul.investedBalance)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          filleul.niveauInvestissement === "Non investi" 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {filleul.niveauInvestissement}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-blue-600">{filleul.commissionRate}%</div>
                        <div className="text-xs text-gray-500">Commission niveau 1</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-amber-600">
                          {formatCurrency(filleul.bonusGagne)}
                        </div>
                        {filleul.bonusGagne > 0 && (
                          <div className="text-xs text-gray-500">
                            {filleul.montantInvesti > 0 ? 
                              `${(filleul.bonusGagne / filleul.montantInvesti * 100).toFixed(1)}% de son investissement` : 
                              'Bonus reçu'
                            }
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg font-medium">Aucun filleul trouvé</p>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez pas encore de filleuls'}
                        </p>
                        <Link 
                          href="/equipe" 
                          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ← Retour à l'équipe
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
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
          
          {/* Total bonus en bas */}
          <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-900">Bonus total reçu</p>
                  <p className="text-xs text-amber-700">Sur l'ensemble de vos filleuls</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalBonus)}</p>
                <p className="text-xs text-amber-600 mt-1">
                  Commission totale de parrainage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Informations sur les commissions</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Commission niveau 1</strong> : Vous recevez 3% du premier investissement de chaque filleul direct</li>
                <li>• <strong>Statut Actif</strong> : Le filleul a effectué au moins un investissement</li>
                <li>• <strong>Statut Inactif</strong> : Le filleul ne s'est pas encore investi</li>
                <li>• <strong>Bonus gagné</strong> : Montant total des commissions reçues pour ce filleul</li>
                <li>• <strong>Niveau d'investissement</strong> : Niveau actuel du filleul (Premium, VIP, etc.)</li>
                <li>• Les commissions sont versées automatiquement dès le premier investissement validé</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}