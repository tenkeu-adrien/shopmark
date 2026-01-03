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
  limit as firestoreLimit,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Gift,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BarChart3,
  CalendarDays,
  Wallet,
  Users
} from "lucide-react";
import Link from "next/link";

export default function HistoriqueRevenusPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [revenusData, setRevenusData] = useState([]);
  const [periodeFilter, setPeriodeFilter] = useState("30jours");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [stats, setStats] = useState({
    totalGains: 0,
    totalBonusParrainage: 0,
    totalAutresBonus: 0,
    joursAvecGains: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user?.uid) {
      loadRevenusData();
    }
  }, [user, authLoading, periodeFilter]);

  const loadRevenusData = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      // 1. Déterminer la période
      const now = new Date();
      let startDate = new Date();
      
      switch(periodeFilter) {
        case "7jours":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30jours":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90jours":
          startDate.setDate(now.getDate() - 90);
          break;
        case "tout":
          startDate = new Date(0); // Toutes les dates
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }
      
      // 2. Récupérer les transactions de gains quotidiens
      const dailyEarningsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        where('type', '==', 'daily_earnings'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      );
      
      const dailyEarningsSnapshot = await getDocs(dailyEarningsQuery);
      
      // 3. Récupérer les transactions de commission parrainage
      const referralQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        where('type', '==', 'referral_commission'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      );
      
      const referralSnapshot = await getDocs(referralQuery);
      
      // 4. Récupérer les transactions de bonus (autres)
      const bonusQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        where('type', 'in', ['bonus', 'promotion', 'reward']),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      );
      
      const bonusSnapshot = await getDocs(bonusQuery);
      
      // 5. Grouper par jour
      const revenusParJour = {};
      
      // Traiter les gains quotidiens
      dailyEarningsSnapshot.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.() || new Date();
        const dateKey = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        if (!revenusParJour[dateKey]) {
          revenusParJour[dateKey] = {
            date: date,
            gainsJournaliers: 0,
            bonusParrainage: 0,
            autresBonus: 0,
            totalJour: 0,
            transactions: [],
            statut: data.status === 'completed' ? 'crédité' : 
                   data.status === 'pending' ? 'en attente' : 'échoué'
          };
        }
        
        revenusParJour[dateKey].gainsJournaliers += data.amount || 0;
        revenusParJour[dateKey].totalJour += data.amount || 0;
        revenusParJour[dateKey].transactions.push({
          type: 'daily_earnings',
          amount: data.amount,
          description: data.description
        });
      });
      
      // Traiter les commissions parrainage
      referralSnapshot.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.() || new Date();
        const dateKey = date.toISOString().split('T')[0];
        
        if (!revenusParJour[dateKey]) {
          revenusParJour[dateKey] = {
            date: date,
            gainsJournaliers: 0,
            bonusParrainage: 0,
            autresBonus: 0,
            totalJour: 0,
            transactions: [],
            statut: 'crédité' // Les commissions sont généralement créditées
          };
        }
        
        revenusParJour[dateKey].bonusParrainage += data.amount || 0;
        revenusParJour[dateKey].totalJour += data.amount || 0;
        revenusParJour[dateKey].transactions.push({
          type: 'referral_commission',
          amount: data.amount,
          description: data.description,
          metadata: data.metadata
        });
      });
      
      // Traiter les autres bonus
      bonusSnapshot.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.() || new Date();
        const dateKey = date.toISOString().split('T')[0];
        
        if (!revenusParJour[dateKey]) {
          revenusParJour[dateKey] = {
            date: date,
            gainsJournaliers: 0,
            bonusParrainage: 0,
            autresBonus: 0,
            totalJour: 0,
            transactions: [],
            statut: data.status === 'completed' ? 'crédité' : 'en attente'
          };
        }
        
        revenusParJour[dateKey].autresBonus += data.amount || 0;
        revenusParJour[dateKey].totalJour += data.amount || 0;
        revenusParJour[dateKey].transactions.push({
          type: 'bonus',
          amount: data.amount,
          description: data.description
        });
      });
      
      // 6. Convertir en tableau et calculer les stats
      const revenusArray = Object.values(revenusParJour)
        .sort((a, b) => b.date - a.date); // Tri décroissant
      
      // Calculer les statistiques
      const totalGains = revenusArray.reduce((sum, jour) => sum + jour.gainsJournaliers, 0);
      const totalBonusParrainage = revenusArray.reduce((sum, jour) => sum + jour.bonusParrainage, 0);
      const totalAutresBonus = revenusArray.reduce((sum, jour) => sum + jour.autresBonus, 0);
      const joursAvecGains = revenusArray.filter(jour => jour.totalJour > 0).length;
      
      setRevenusData(revenusArray);
      setStats({
        totalGains,
        totalBonusParrainage,
        totalAutresBonus,
        joursAvecGains
      });
      
    } catch (error) {
      console.error('Erreur chargement revenus:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRevenus = revenusData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(revenusData.length / itemsPerPage);

  const formatDate = (date) => {
    if (!date) return "Date inconnue";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
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

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'crédité':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'en attente':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case 'échoué':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock };
    }
  };

  const handleRefresh = () => {
    loadRevenusData();
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Gains journaliers (CDF)', 'Bonus parrainage (CDF)', 'Autres bonus (CDF)', 'Total jour (CDF)', 'Statut'],
      ...revenusData.map(jour => [
        formatDate(jour.date),
        jour.gainsJournaliers,
        jour.bonusParrainage,
        jour.autresBonus,
        jour.totalJour,
        jour.statut
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_revenus_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre historique...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Historique des revenus</h1>
                <p className="text-gray-600 text-sm mt-1">Suivez vos gains quotidiens et bonus</p>
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
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total gains</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalGains)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bonus parrainage</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalBonusParrainage)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Autres bonus</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalAutresBonus)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Jours avec gains</p>
                <p className="text-2xl font-bold text-amber-600">{stats.joursAvecGains}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <CalendarDays className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et période */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Période d'analyse</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "7jours", label: "7 derniers jours" },
                  { value: "30jours", label: "30 derniers jours" },
                  { value: "90jours", label: "90 derniers jours" },
                  { value: "tout", label: "Tout l'historique" }
                ].map((periode) => (
                  <button
                    key={periode.value}
                    onClick={() => {
                      setPeriodeFilter(periode.value);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      periodeFilter === periode.value
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {periode.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">
                {revenusData.length} jour(s) trouvé(s)
              </p>
              <p className="text-lg font-bold text-gray-900">
                Total période : {formatCurrency(stats.totalGains + stats.totalBonusParrainage + stats.totalAutresBonus)}
              </p>
            </div>
          </div>
        </div>

        {/* Tableau des revenus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Gains journaliers
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Bonus parrainage
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Autres bonus
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total jour
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {currentRevenus.length > 0 ? (
                  currentRevenus.map((jour, index) => {
                    const StatusIcon = getStatusColor(jour.statut).icon;
                    
                    return (
                      <tr 
                        key={jour.date.toISOString()} 
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(jour.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {jour.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${jour.gainsJournaliers > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formatCurrency(jour.gainsJournaliers)}
                          </div>
                          {jour.transactions.filter(t => t.type === 'daily_earnings').length > 0 && (
                            <div className="text-xs text-gray-500">
                              {jour.transactions.filter(t => t.type === 'daily_earnings').length} transaction(s)
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${jour.bonusParrainage > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                            {formatCurrency(jour.bonusParrainage)}
                          </div>
                          {jour.transactions.filter(t => t.type === 'referral_commission').length > 0 && (
                            <div className="text-xs text-gray-500">
                              {jour.transactions.filter(t => t.type === 'referral_commission').length} commission(s)
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${jour.autresBonus > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                            {formatCurrency(jour.autresBonus)}
                          </div>
                          {jour.transactions.filter(t => t.type === 'bonus').length > 0 && (
                            <div className="text-xs text-gray-500">
                              {jour.transactions.filter(t => t.type === 'bonus').length} bonus
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(jour.totalJour)}
                          </div>
                          {jour.totalJour > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              +{formatCurrency(jour.totalJour)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(jour.statut).bg
                            } ${getStatusColor(jour.statut).text}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {jour.statut.charAt(0).toUpperCase() + jour.statut.slice(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg font-medium">Aucun revenu trouvé</p>
                        <p className="text-gray-400 mt-2">
                          Aucun revenu enregistré pour la période sélectionnée
                        </p>
                        <button
                          onClick={() => setPeriodeFilter("tout")}
                          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Voir tout l'historique →
                        </button>
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
                  <span className="font-medium">{Math.min(indexOfLastItem, revenusData.length)}</span> sur{" "}
                  <span className="font-medium">{revenusData.length}</span> jours
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
        </div>

        {/* Résumé et informations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique synthétique */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Synthèse des revenus
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Gains journaliers</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(stats.totalGains)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.totalGains / (stats.totalGains + stats.totalBonusParrainage + stats.totalAutresBonus)) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Bonus parrainage</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(stats.totalBonusParrainage)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(stats.totalBonusParrainage / (stats.totalGains + stats.totalBonusParrainage + stats.totalAutresBonus)) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Autres bonus</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(stats.totalAutresBonus)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(stats.totalAutresBonus / (stats.totalGains + stats.totalBonusParrainage + stats.totalAutresBonus)) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">Total période</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.totalGains + stats.totalBonusParrainage + stats.totalAutresBonus)}
                </span>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations sur les revenus
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Gains journaliers</p>
                  <p className="text-sm text-gray-600">
                    Revenus générés par vos investissements quotidiens. Crédités chaque jour sur votre portefeuille.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Bonus parrainage</p>
                  <p className="text-sm text-gray-600">
                    Commissions reçues lorsque vos filleuls effectuent leur premier investissement.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Autres bonus</p>
                  <p className="text-sm text-gray-600">
                    Promotions, récompenses ponctuelles et bonus exceptionnels.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 font-medium mb-1">💡 Conseil :</p>
                <p className="text-xs text-amber-700">
                  Pour augmenter vos revenus, pensez à inviter des amis via votre lien de parrainage.
                  Vous gagnerez 3% sur leur premier investissement.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/equipe"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Users className="w-4 h-4" />
                Voir mes filleuls et augmenter mes revenus →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}