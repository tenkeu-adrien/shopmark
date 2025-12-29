// "use client";

// import { 
//   TrendingUp, 
//   Users, 
//   DollarSign, 
//   Package,
//   Activity,
//   ArrowUpRight,
//   ArrowDownRight,
//   Calendar,
//   Download,
//   MoreVertical,
//   Search,
//   Filter,
//   Plus
// } from 'lucide-react';
// import Link from 'next/link';

// // Composant StatCard (à mettre dans un fichier séparé si besoin)
// function StatCard({ title, value, change, trend, icon: Icon, color, description }) {
//   const colorClasses = {
//     blue: 'bg-blue-100 text-blue-600',
//     green: 'bg-green-100 text-green-600',
//     purple: 'bg-purple-100 text-purple-600',
//     orange: 'bg-orange-100 text-orange-600',
//     red: 'bg-red-100 text-red-600',
//   };

//   return (
//     <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-500 font-medium">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
//           <div className="flex items-center mt-3">
//             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//               trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//               {trend === 'up' ? (
//                 <ArrowUpRight className="w-3 h-3 mr-1" />
//               ) : (
//                 <ArrowDownRight className="w-3 h-3 mr-1" />
//               )}
//               {change}
//             </span>
//             <span className="text-sm text-gray-500 ml-2">{description}</span>
//           </div>
//         </div>
//         <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
//           <Icon className="w-6 h-6" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Composant DashboardCard
// function DashboardCard({ title, subtitle, actions, children, className = '' }) {
//   return (
//     <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
//       <div className="px-5 py-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//             {subtitle && (
//               <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
//             )}
//           </div>
//           {actions && (
//             <div className="flex items-center space-x-2">
//               {actions}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="p-5">
//         {children}
//       </div>
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const stats = [
//     {
//       title: 'Utilisateurs totaux',
//       value: '2,847',
//       change: '+12.5%',
//       trend: 'up',
//       icon: Users,
//       color: 'blue',
//       description: 'Depuis le mois dernier'
//     },
//     {
//       title: 'Revenu total',
//       value: '€42,580',
//       change: '+8.2%',
//       trend: 'up',
//       icon: DollarSign,
//       color: 'green',
//       description: 'Ce mois-ci'
//     },
//     {
//       title: 'Transactions',
//       value: '1,248',
//       change: '-3.1%',
//       trend: 'down',
//       icon: Activity,
//       color: 'purple',
//       description: '24 dernières heures'
//     },
//     {
//       title: 'Ressources actives',
//       value: '156',
//       change: '+5.7%',
//       trend: 'up',
//       icon: Package,
//       color: 'orange',
//       description: 'En ligne maintenant'
//     }
//   ];

//   const recentActivities = [
//     {
//       id: 1,
//       user: 'John Doe',
//       action: 'Nouvelle inscription',
//       time: 'Il y a 2 minutes',
//       type: 'user'
//     },
//     {
//       id: 2,
//       user: 'Sarah Smith',
//       action: 'Retrait approuvé',
//       time: 'Il y a 15 minutes',
//       amount: '€500',
//       type: 'transaction'
//     },
//     {
//       id: 3,
//       user: 'System',
//       action: 'Maintenance planifiée',
//       time: 'Il y a 1 heure',
//       type: 'system'
//     },
//     {
//       id: 4,
//       user: 'Mike Johnson',
//       action: 'Nouvelle ressource ajoutée',
//       time: 'Il y a 3 heures',
//       type: 'resource'
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
//           <p className="text-gray-600 mt-1">Bienvenue dans votre espace d&apos;administration</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//             <Calendar className="w-4 h-4" />
//             <span className="text-sm font-medium">Ce mois</span>
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//             <Download className="w-4 h-4" />
//             <span className="text-sm font-medium">Exporter</span>
//           </button>
//         </div>
//       </div>

//       {/* Cards statistiques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Graphique et activités */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Graphique de performance */}
//         <div className="lg:col-span-2">
//           <DashboardCard 
//             title="Performance" 
//             subtitle="Aperçu des 30 derniers jours"
//             actions={
//               <button className="p-1 hover:bg-gray-100 rounded">
//                 <MoreVertical className="w-5 h-5 text-gray-500" />
//               </button>
//             }
//           >
//             {/* <PerformanceChart /> */}
//             <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//               <p className="text-gray-500">Graphique de performance (à implémenter)</p>
//             </div>
//           </DashboardCard>
//         </div>

//         {/* Activités récentes */}
//         <div>
//           <DashboardCard 
//             title="Activités récentes" 
//             subtitle="Dernières actions dans le système"
//             actions={
//               <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                 Voir tout
//               </button>
//             }
//           >
//             <div className="space-y-4">
//               {recentActivities.map((activity) => (
//                 <div key={activity.id} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium text-gray-900">{activity.user}</p>
//                     <p className="text-sm text-gray-600">{activity.action}</p>
//                     {activity.amount && (
//                       <p className="text-sm font-medium text-green-600">{activity.amount}</p>
//                     )}
//                     <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
//                   </div>
//                   <div className={`w-2 h-2 rounded-full mt-2 ${
//                     activity.type === 'user' ? 'bg-blue-500' :
//                     activity.type === 'transaction' ? 'bg-green-500' :
//                     activity.type === 'system' ? 'bg-yellow-500' : 'bg-purple-500'
//                   }`}></div>
//                 </div>
//               ))}
//             </div>
//           </DashboardCard>
//         </div>
//       </div>

//       {/* Section utilisateurs */}
//       <DashboardCard 
//         title="Utilisateurs récents" 
//         subtitle="Dernières inscriptions"
//         actions={
//           <Link 
//             href="/dashboard/utilisateurs/nouveau"
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="w-4 h-4" />
//             Nouvel utilisateur
//           </Link>
//         }
//       >
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Utilisateur
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Inscription
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Statut
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
//                         {i}
//                       </div>
//                       <div className="ml-3">
//                         <div className="text-sm font-medium text-gray-900">Utilisateur {i}</div>
//                         <div className="text-sm text-gray-500">user{i}@example.com</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     2024-01-{15 + i}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
//                       Actif
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm">
//                     <Link 
//                       href={`/dashboard/utilisateurs/${i}`}
//                       className="text-blue-600 hover:text-blue-900 mr-3"
//                     >
//                       Voir
//                     </Link>
//                     <button className="text-gray-600 hover:text-gray-900">
//                       Éditer
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="mt-4 flex justify-between items-center">
//           <div className="text-sm text-gray-500">
//             Affichage de 1 à 5 sur 2,847 utilisateurs
//           </div>
//           <div className="flex gap-2">
//             <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
//               Précédent
//             </button>
//             <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
//               Suivant
//             </button>
//           </div>
//         </div>
//       </DashboardCard>
//     </div>
//   );




// }


// app/dashboard/page.js
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
  ArrowDownRight
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

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Charger les utilisateurs
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;
        
        // Charger les transactions
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

        // Charger les wallets pour le revenu total
        const walletsSnapshot = await getDocs(collection(db, 'wallets'));
        const totalRevenue = walletsSnapshot.docs.reduce((sum, doc) => {
          const data = doc.data();
          return sum + (data.stats?.totalEarned || 0);
        }, 0);

        // Utilisateurs actifs (connectés dans les 7 derniers jours)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const activeUsersQuery = query(
          collection(db, 'users'),
          where('lastLogin', '>=', weekAgo)
        );
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        const activeUsers = activeUsersSnapshot.size;

        // Activité récente
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
    
    // Recharger les données toutes les 30 secondes
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Rafraîchir
          </button>
          <div className="text-sm text-gray-500">
            Mis à jour il y a quelques secondes
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Utilisateurs totaux</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(stats.totalUsers)}</p>
              <div className="flex items-center mt-1">
                {/* <span className="text-xs text-green-600 font-medium flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stats.activeUsers} actifs
                </span> */}
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/utilisateurs"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir tous les utilisateurs →
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dépôts totaux</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(stats.totalDeposits)} CDF</p>
              <div className="flex items-center mt-1">
                {/* <span className="text-xs text-green-600 font-medium">
                  +{formatAmount(stats.totalDeposits / 30)} CDF/jour
                </span> */}
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/transactions?type=deposit"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir les dépôts →
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Retraits totaux</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(stats.totalWithdrawals)} CDF</p>
              <div className="flex items-center mt-1">
                {/* <span className="text-xs text-red-600 font-medium">
                  -{formatAmount(stats.totalWithdrawals / 30)} CDF/jour
                </span> */}
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDownRight className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/transactions?type=withdrawal"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir les retraits →
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenu total</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(stats.totalRevenue)} CDF</p>
              <div className="flex items-center mt-1">
                {/* <span className="text-xs text-green-600 font-medium">
                  +{formatAmount(stats.totalRevenue / 30)} CDF/jour
                </span> */}
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions en attente</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingTransactions}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-yellow-600 font-medium">
                  Nécessite votre attention
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/transactions?status=pending"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Traiter maintenant →
            </Link>
          </div>
        </DashboardCard>

    
      </div>

      {/* Activité récente */}
      <DashboardCard title="Activité récente">
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActivityIcon(activity.depositId ? 'deposit' : 'withdrawal')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.depositId ? 'Dépôt' : 'Retrait'} • {activity.userName || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.userEmail || 'Email non disponible'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${activity.depositId ? 'text-green-600' : 'text-red-600'}`}>
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
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Voir toutes les transactions →
          </Link>
        </div>
      </DashboardCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Actions rapides">
          <div className="space-y-3">
            <Link 
              href="/dashboard/transactions?status=pending"
              className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Traiter transactions</p>
                  <p className="text-sm text-gray-600">{stats.pendingTransactions} en attente</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link 
              href="/dashboard/utilisateurs?status=pending"
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Vérifier utilisateurs</p>
                  <p className="text-sm text-gray-600">Nouveaux inscrits</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link 
              href="/dashboard/parametres"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Paramètres système</p>
                  <p className="text-sm text-gray-600">Configurer la plateforme</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </DashboardCard>

        <div className="md:col-span-2">
          <DashboardCard title="Aperçu mensuel">
            <div className="h-64 flex items-end justify-between px-4">
              {Array.from({ length: 30 }).map((_, index) => {
                const day = index + 1;
                const height = Math.floor(Math.random() * 100);
                return (
                  <div key={day} className="flex flex-col items-center">
                    <div 
                      className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg"
                      style={{ height: `${height}%` }}
                      title={`Jour ${day}: ${height} transactions`}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600">
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Transactions par jour (30 derniers jours)
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}