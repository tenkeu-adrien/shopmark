"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  CreditCard,
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import StatCard from '@/components/statCard/StatCard';

export default function StatistiquesPage() {
  const stats = [
    {
      title: 'Revenu mensuel',
      value: '€15,240',
      change: '+18.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      description: 'vs mois dernier'
    },
    {
      title: 'Nouveaux utilisateurs',
      value: '324',
      change: '+7.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'Ce mois-ci'
    },
    {
      title: 'Taux de conversion',
      value: '4.8%',
      change: '+1.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple',
      description: 'Augmentation'
    },
    {
      title: 'Taux d\'abandon',
      value: '2.3%',
      change: '-0.8%',
      trend: 'down',
      icon: TrendingDown,
      color: 'orange',
      description: 'Amélioration'
    }
  ];

  const chartData = [
    { month: 'Jan', revenue: 12000, users: 240 },
    { month: 'Fév', revenue: 14000, users: 280 },
    { month: 'Mar', revenue: 11000, users: 210 },
    { month: 'Avr', revenue: 18000, users: 320 },
    { month: 'Mai', revenue: 20000, users: 380 },
    { month: 'Jun', revenue: 22000, users: 420 },
  ];

  const topProducts = [
    { name: 'Formation Premium', revenue: 8500, sales: 42 },
    { name: 'Accès Pro', revenue: 6200, sales: 31 },
    { name: 'Consultation', revenue: 4800, sales: 24 },
    { name: 'Template Pack', revenue: 3200, sales: 16 },
    { name: 'Guide PDF', revenue: 2100, sales: 35 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-1">Analyse complète des performances</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <option>30 derniers jours</option>
            <option>3 derniers mois</option>
            <option>6 derniers mois</option>
            <option>Cette année</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Cards statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique revenus */}
        <DashboardCard 
          title="Revenus mensuels" 
          subtitle="Évolution sur 6 mois"
          actions={
            <button className="p-1 hover:bg-gray-100 rounded">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          }
        >
          <div className="h-80">
            {/* Placeholder pour graphique */}
            <div className="h-full flex flex-col justify-end">
              <div className="flex items-end justify-between h-64 px-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-10 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                      style={{ height: `${(item.revenue / 25000) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-sm text-gray-600">{item.month}</div>
                    <div className="text-xs text-gray-500">€{item.revenue.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Répartition */}
        <DashboardCard 
          title="Répartition des revenus" 
          subtitle="Par catégorie"
        >
          <div className="h-80 flex items-center justify-center">
            {/* Placeholder pour pie chart */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <div className="absolute inset-8 bg-white rounded-full"></div>
            </div>
            <div className="ml-8 space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Formations (42%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm">Consultations (28%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                <span className="text-sm">Produits (18%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Autres (12%)</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Top produits */}
      <DashboardCard 
        title="Top produits" 
        subtitle="Meilleures performances"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenu total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de conversion
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">€{product.revenue.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sales}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.sales > 30 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {((product.sales / 100) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          style={{ width: `${(product.revenue / 10000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {((product.revenue / 10000) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Metrics détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Trafic">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Visiteurs uniques</p>
              <p className="text-2xl font-bold text-gray-900">8,452</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pages vues</p>
              <p className="text-2xl font-bold text-gray-900">24,187</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Durée moyenne</p>
              <p className="text-2xl font-bold text-gray-900">4m 32s</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Engagement">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Taux de rebond</p>
              <p className="text-2xl font-bold text-gray-900">34.2%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Inscriptions</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Retention 30j</p>
              <p className="text-2xl font-bold text-gray-900">68.5%</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Performance">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Temps de chargement</p>
              <p className="text-2xl font-bold text-gray-900">1.2s</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Disponibilité</p>
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Erreurs API</p>
              <p className="text-2xl font-bold text-gray-900">0.02%</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}