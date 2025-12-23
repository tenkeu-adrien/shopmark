"use client";

import { 
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Server,
  Database,
  Cpu,
  HardDrive,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';

export default function RessourcesPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const resources = [
    {
      id: 'RS-001',
      name: 'Serveur Principal',
      type: 'server',
      status: 'active',
      cpu: 65,
      memory: 78,
      storage: 42,
      uptime: '99.8%',
      location: 'Paris, FR',
      ip: '192.168.1.100',
      lastBackup: '2024-01-14',
      alerts: 2
    },
    {
      id: 'RS-002',
      name: 'Base de données MySQL',
      type: 'database',
      status: 'active',
      cpu: 45,
      memory: 62,
      storage: 85,
      uptime: '99.9%',
      location: 'Paris, FR',
      ip: '192.168.1.101',
      lastBackup: '2024-01-14',
      alerts: 0
    },
    {
      id: 'RS-003',
      name: 'Cache Redis',
      type: 'cache',
      status: 'warning',
      cpu: 85,
      memory: 92,
      storage: 35,
      uptime: '99.5%',
      location: 'Paris, FR',
      ip: '192.168.1.102',
      lastBackup: '2024-01-13',
      alerts: 3
    },
    {
      id: 'RS-004',
      name: 'Serveur de fichiers',
      type: 'storage',
      status: 'active',
      cpu: 30,
      memory: 45,
      storage: 68,
      uptime: '99.7%',
      location: 'Lille, FR',
      ip: '192.168.2.100',
      lastBackup: '2024-01-14',
      alerts: 1
    },
    {
      id: 'RS-005',
      name: 'Load Balancer',
      type: 'network',
      status: 'maintenance',
      cpu: 55,
      memory: 60,
      storage: 25,
      uptime: '98.9%',
      location: 'Paris, FR',
      ip: '192.168.1.103',
      lastBackup: '2024-01-12',
      alerts: 0
    },
    {
      id: 'RS-006',
      name: 'API Gateway',
      type: 'api',
      status: 'inactive',
      cpu: 0,
      memory: 0,
      storage: 15,
      uptime: '0%',
      location: 'Lyon, FR',
      ip: '192.168.3.100',
      lastBackup: '2024-01-10',
      alerts: 5
    },
    {
      id: 'RS-007',
      name: 'Analytics Server',
      type: 'analytics',
      status: 'active',
      cpu: 72,
      memory: 68,
      storage: 55,
      uptime: '99.6%',
      location: 'Paris, FR',
      ip: '192.168.1.104',
      lastBackup: '2024-01-14',
      alerts: 0
    },
    {
      id: 'RS-008',
      name: 'Backup Server',
      type: 'backup',
      status: 'active',
      cpu: 40,
      memory: 55,
      storage: 90,
      uptime: '99.8%',
      location: 'Marseille, FR',
      ip: '192.168.4.100',
      lastBackup: '2024-01-14',
      alerts: 2
    }
  ];

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    maintenance: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
    inactive: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const typeConfig = {
    server: { icon: Server, color: 'text-blue-500' },
    database: { icon: Database, color: 'text-purple-500' },
    cache: { icon: Cpu, color: 'text-orange-500' },
    storage: { icon: HardDrive, color: 'text-green-500' },
    network: { icon: Activity, color: 'text-indigo-500' },
    api: { icon: Activity, color: 'text-pink-500' },
    analytics: { icon: Activity, color: 'text-cyan-500' },
    backup: { icon: HardDrive, color: 'text-gray-500' }
  };

  const filteredResources = resources.filter(resource => {
    if (filter !== 'all' && resource.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        resource.id.toLowerCase().includes(searchLower) ||
        resource.name.toLowerCase().includes(searchLower) ||
        resource.location.toLowerCase().includes(searchLower) ||
        resource.ip.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleAction = (action, resourceId) => {
    switch(action) {
      case 'start':
        alert(`Démarrer ${resourceId}`);
        break;
      case 'stop':
        if (confirm(`Arrêter ${resourceId} ?`)) {
          alert(`${resourceId} arrêté`);
        }
        break;
      case 'restart':
        if (confirm(`Redémarrer ${resourceId} ?`)) {
          alert(`${resourceId} redémarré`);
        }
        break;
      case 'delete':
        if (confirm(`Supprimer ${resourceId} ? Cette action est irréversible.`)) {
          alert(`${resourceId} supprimé`);
        }
        break;
    }
  };

  const stats = {
    total: resources.length,
    active: resources.filter(r => r.status === 'active').length,
    warning: resources.filter(r => r.status === 'warning').length,
    issues: resources.reduce((sum, r) => sum + r.alerts, 0),
    avgCpu: Math.round(resources.reduce((sum, r) => sum + r.cpu, 0) / resources.length),
    avgMemory: Math.round(resources.reduce((sum, r) => sum + r.memory, 0) / resources.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ressources</h1>
          <p className="text-gray-600 mt-1">Gestion de l&apos;infrastructure système</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Nouvelle ressource
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Actives</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Avertissements</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Alertes</p>
          <p className="text-2xl font-bold text-red-600">{stats.issues}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">CPU moyen</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgCpu}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Mémoire moyenne</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgMemory}%</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une ressource..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="warning">Avertissements</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactives</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Plus de filtres
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Table des ressources */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ressource
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière sauvegarde
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResources.map((resource) => {
                const StatusIcon = statusConfig[resource.status].icon;
                const TypeIcon = typeConfig[resource.type].icon;
                return (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${typeConfig[resource.type].color.replace('text', 'bg')} bg-opacity-20`}>
                          <TypeIcon className={`w-5 h-5 ${typeConfig[resource.type].color}`} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                          <div className="text-xs text-gray-500">{resource.id} • {resource.ip}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-2" />
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusConfig[resource.status].color}`}>
                          {resource.status}
                        </span>
                        {resource.alerts > 0 && (
                          <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {resource.alerts} alertes
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>CPU</span>
                            <span>{resource.cpu}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${resource.cpu > 80 ? 'bg-red-500' : resource.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${resource.cpu}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Mémoire</span>
                            <span>{resource.memory}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${resource.memory > 80 ? 'bg-red-500' : resource.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${resource.memory}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resource.location}</div>
                      <div className="text-xs text-gray-500">{resource.ip}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resource.lastBackup}</div>
                      <div className="text-xs text-gray-500">Uptime: {resource.uptime}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleAction('start', resource.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Démarrer"
                        >
                          ▶
                        </button>
                        <button 
                          onClick={() => handleAction('stop', resource.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Arrêter"
                        >
                          ⏸
                        </button>
                        <button 
                          onClick={() => handleAction('restart', resource.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Redémarrer"
                        >
                          ↻
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('delete', resource.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Affichage de 1 à {filteredResources.length} sur {resources.length} ressources
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Précédent
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Vue d'ensemble système */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Utilisation des ressources">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Utilisation CPU globale</span>
                <span className="text-sm font-bold text-gray-900">{stats.avgCpu}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${stats.avgCpu > 80 ? 'bg-red-500' : stats.avgCpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${stats.avgCpu}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Utilisation mémoire globale</span>
                <span className="text-sm font-bold text-gray-900">{stats.avgMemory}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${stats.avgMemory > 80 ? 'bg-red-500' : stats.avgMemory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${stats.avgMemory}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Stockage utilisé</span>
                <span className="text-sm font-bold text-gray-900">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="h-4 rounded-full bg-blue-500" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Alertes récentes">
          <div className="space-y-3">
            {[
              { resource: 'Serveur Principal', type: 'warning', message: 'CPU > 80%', time: 'Il y a 2h' },
              { resource: 'Base de données', type: 'critical', message: 'Connexions > 1000', time: 'Il y a 4h' },
              { resource: 'Cache Redis', type: 'warning', message: 'Mémoire > 90%', time: 'Il y a 6h' },
              { resource: 'API Gateway', type: 'info', message: 'Redémarrage planifié', time: 'Il y a 12h' },
              { resource: 'Backup Server', type: 'success', message: 'Sauvegarde réussie', time: 'Il y a 24h' }
            ].map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    alert.type === 'critical' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.resource}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{alert.time}</div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}