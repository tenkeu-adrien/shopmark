"use client";

import { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  DollarSign,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import DashboardCard from '@/components/DashboardCard';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingTransactions: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
console.log("ok dashboard")
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;
        
        const transactionsSnapshot = await getDocs(collection(db, 'transactions'));
        const transactions = transactionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const totalDeposits = transactions
          .filter(t => t.depositId && t.status === 'confirmed')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalWithdrawals = transactions
          .filter(t => t.withdrawalId && t.status === 'confirmed')
          .reduce((sum, t) => sum + t.amount, 0);

        const pendingTransactions = transactions
          .filter(t => t.status === 'pending').length;

        const walletsSnapshot = await getDocs(collection(db, 'wallets'));
        const totalRevenue = walletsSnapshot.docs.reduce((sum, doc) => {
          const data = doc.data();
          return sum + (data.stats?.totalEarned || 0);
        }, 0);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const activeUsersQuery = query(
          collection(db, 'users'),
          where('lastLogin', '>=', weekAgo)
        );
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        const activeUsers = activeUsersSnapshot.size;

        const recentActivityQuery = query(
          collection(db, 'transactions'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentActivitySnapshot = await getDocs(recentActivityQuery);
        const recentActivityData = recentActivitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate?.() || new Date()
        }));

        setStats({
          totalUsers,
          totalDeposits,
          totalWithdrawals,
          pendingTransactions,
          totalRevenue,
          activeUsers
        });

        setRecentActivity(recentActivityData);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // const interval = setInterval(loadDashboardData, 9000000000000000000000000000000000000000000000000000000000);
    // return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount) => {
    return amount?.toLocaleString('fr-FR') || '0';
  };

  const formatDate = (date) => {
    if (!date) return 'Date inconnue';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'deposit': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'withdrawal': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <button 
            onClick={refreshData}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm sm:text-base">Rafraîchir</span>
          </button>
          <div className="text-xs sm:text-sm text-gray-500 self-end sm:self-center">
            Mis à jour il y a quelques secondes
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Utilisateurs totaux</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatAmount(stats.totalUsers)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <Link 
              href="/dashboard/utilisateurs"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Voir tous les utilisateurs →
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Dépôts totaux</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatAmount(stats.totalDeposits)} CDF</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-6 sm:w-8 h-6 sm:h-8 text-green-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <Link 
              href="/dashboard/transactions?type=deposit"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Voir les dépôts →
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Retraits totaux</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatAmount(stats.totalWithdrawals)} CDF</p>
            </div>
            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
              <ArrowDownRight className="w-6 sm:w-8 h-6 sm:h-8 text-red-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <Link 
              href="/dashboard/transactions?type=withdrawal"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Voir les retraits →
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Revenu total</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatAmount(stats.totalRevenue)} CDF</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Transactions en attente</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pendingTransactions}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-yellow-600 font-medium">
                  Nécessite votre attention
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <Link 
              href="/dashboard/transactions?status=pending"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Traiter maintenant →
            </Link>
          </div>
        </DashboardCard>
      </div>

      {/* Activité récente */}
      <DashboardCard title="Activité récente">
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    {getActivityIcon(activity.depositId ? 'deposit' : 'withdrawal')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {activity.depositId ? 'Dépôt' : 'Retrait'} • {activity.userName || 'Utilisateur'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {activity.userEmail || 'Email non disponible'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className={`font-bold text-sm sm:text-base ${activity.depositId ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.depositId ? '+' : '-'}{formatAmount(activity.amount)} CDF
                  </p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {activity.status === 'confirmed' ? 'Confirmé' : 
                     activity.status === 'pending' ? 'En attente' : 'Rejeté'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune activité récente</p>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link 
            href="/dashboard/transactions"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            Voir toutes les transactions →
          </Link>
        </div>
      </DashboardCard>

      {/* Quick Actions et Graphique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <DashboardCard title="Actions rapides" className='mb-10'>
          <div className="space-y-2 sm:space-y-3">
            <Link 
              href="/dashboard/transactions?status=pending"
              className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg mr-2 sm:mr-3">
                  <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Traiter transactions</p>
                  <p className="text-xs sm:text-sm text-gray-600">{stats.pendingTransactions} en attente</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
            </Link>

            <Link 
              href="/dashboard/utilisateurs?status=pending"
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Vérifier utilisateurs</p>
                  <p className="text-xs sm:text-sm text-gray-600">Nouveaux inscrits</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
            </Link>
          </div>
        </DashboardCard>

        <div className="md:col-span-2">
          <DashboardCard title="Aperçu mensuel"   className='mb-30'>
            <div className="h-40 sm:h-48 md:h-56 lg:h-64 flex items-end justify-between px-2 sm:px-4">
              {Array.from({ length: 30 }).map((_, index) => {
                const day = index + 1;
                const height = Math.floor(Math.random() * 100);
                return (
                  <div key={day} className="flex flex-col items-center flex-1 mx-0.5">
                    <div 
                      className="w-2 sm:w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg"
                      style={{ height: `${height}%` }}
                      title={`Jour ${day}: ${height} transactions`}
                    ></div>
                    <div className="mt-1 sm:mt-2 text-xs text-gray-600">
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
              Transactions par jour (30 derniers jours)
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}