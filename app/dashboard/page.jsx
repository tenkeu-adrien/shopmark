"use client";

import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  MoreVertical,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Composant StatCard (à mettre dans un fichier séparé si besoin)
function StatCard({ title, value, change, trend, icon: Icon, color, description }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">{description}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Composant DashboardCard
function DashboardCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Utilisateurs totaux',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'Depuis le mois dernier'
    },
    {
      title: 'Revenu total',
      value: '€42,580',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      description: 'Ce mois-ci'
    },
    {
      title: 'Transactions',
      value: '1,248',
      change: '-3.1%',
      trend: 'down',
      icon: Activity,
      color: 'purple',
      description: '24 dernières heures'
    },
    {
      title: 'Ressources actives',
      value: '156',
      change: '+5.7%',
      trend: 'up',
      icon: Package,
      color: 'orange',
      description: 'En ligne maintenant'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Nouvelle inscription',
      time: 'Il y a 2 minutes',
      type: 'user'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      action: 'Retrait approuvé',
      time: 'Il y a 15 minutes',
      amount: '€500',
      type: 'transaction'
    },
    {
      id: 3,
      user: 'System',
      action: 'Maintenance planifiée',
      time: 'Il y a 1 heure',
      type: 'system'
    },
    {
      id: 4,
      user: 'Mike Johnson',
      action: 'Nouvelle ressource ajoutée',
      time: 'Il y a 3 heures',
      type: 'resource'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue dans votre espace d&apos;administration</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Ce mois</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Exporter</span>
          </button>
        </div>
      </div>

      {/* Cards statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphique et activités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique de performance */}
        <div className="lg:col-span-2">
          <DashboardCard 
            title="Performance" 
            subtitle="Aperçu des 30 derniers jours"
            actions={
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            }
          >
            {/* <PerformanceChart /> */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graphique de performance (à implémenter)</p>
            </div>
          </DashboardCard>
        </div>

        {/* Activités récentes */}
        <div>
          <DashboardCard 
            title="Activités récentes" 
            subtitle="Dernières actions dans le système"
            actions={
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Voir tout
              </button>
            }
          >
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    {activity.amount && (
                      <p className="text-sm font-medium text-green-600">{activity.amount}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'transaction' ? 'bg-green-500' :
                    activity.type === 'system' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Section utilisateurs */}
      <DashboardCard 
        title="Utilisateurs récents" 
        subtitle="Dernières inscriptions"
        actions={
          <Link 
            href="/dashboard/utilisateurs/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvel utilisateur
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {i}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Utilisateur {i}</div>
                        <div className="text-sm text-gray-500">user{i}@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-01-{15 + i}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Actif
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <Link 
                      href={`/dashboard/utilisateurs/${i}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Voir
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                      Éditer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Affichage de 1 à 5 sur 2,847 utilisateurs
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}