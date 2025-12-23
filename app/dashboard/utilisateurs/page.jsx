"use client";

import { 
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserPlus,
  Ban,
  Unlock,
  Send
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';

export default function UtilisateursPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+33 6 12 34 56 78',
      role: 'admin',
      status: 'active',
      registration: '2024-01-01',
      lastLogin: '2024-01-15',
      purchases: 12,
      totalSpent: 1250.00,
      verified: true
    },
    {
      id: 'USR-002',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+33 6 23 45 67 89',
      role: 'user',
      status: 'active',
      registration: '2024-01-02',
      lastLogin: '2024-01-14',
      purchases: 8,
      totalSpent: 850.50,
      verified: true
    },
    {
      id: 'USR-003',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+33 6 34 56 78 90',
      role: 'moderator',
      status: 'inactive',
      registration: '2024-01-03',
      lastLogin: '2024-01-10',
      purchases: 3,
      totalSpent: 150.00,
      verified: true
    },
    {
      id: 'USR-004',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+33 6 45 67 89 01',
      role: 'user',
      status: 'suspended',
      registration: '2024-01-04',
      lastLogin: '2024-01-05',
      purchases: 0,
      totalSpent: 0.00,
      verified: false
    },
    {
      id: 'USR-005',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+33 6 56 78 90 12',
      role: 'premium',
      status: 'active',
      registration: '2024-01-05',
      lastLogin: '2024-01-15',
      purchases: 25,
      totalSpent: 3250.75,
      verified: true
    },
    {
      id: 'USR-006',
      name: 'Lisa Taylor',
      email: 'lisa@example.com',
      phone: '+33 6 67 89 01 23',
      role: 'user',
      status: 'active',
      registration: '2024-01-06',
      lastLogin: '2024-01-14',
      purchases: 6,
      totalSpent: 420.00,
      verified: true
    },
    {
      id: 'USR-007',
      name: 'Robert Garcia',
      email: 'robert@example.com',
      phone: '+33 6 78 90 12 34',
      role: 'user',
      status: 'pending',
      registration: '2024-01-07',
      lastLogin: null,
      purchases: 0,
      totalSpent: 0.00,
      verified: false
    },
    {
      id: 'USR-008',
      name: 'Sophia Martinez',
      email: 'sophia@example.com',
      phone: '+33 6 89 01 23 45',
      role: 'user',
      status: 'active',
      registration: '2024-01-08',
      lastLogin: '2024-01-15',
      purchases: 18,
      totalSpent: 2100.00,
      verified: true
    }
  ];

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-purple-100 text-purple-800',
    premium: 'bg-yellow-100 text-yellow-800',
    user: 'bg-blue-100 text-blue-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'all' && user.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        user.id.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    switch(action) {
      case 'activate':
        if (confirm(`Activer ${selectedUsers.length} utilisateur(s) ?`)) {
          // Logique d'activation
          alert(`${selectedUsers.length} utilisateur(s) activé(s) !`);
          setSelectedUsers([]);
        }
        break;
      case 'suspend':
        if (confirm(`Suspendre ${selectedUsers.length} utilisateur(s) ?`)) {
          // Logique de suspension
          alert(`${selectedUsers.length} utilisateur(s) suspendu(s) !`);
          setSelectedUsers([]);
        }
        break;
      case 'delete':
        if (confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ? Cette action est irréversible.`)) {
          // Logique de suppression
          alert(`${selectedUsers.length} utilisateur(s) supprimé(s) !`);
          setSelectedUsers([]);
        }
        break;
      case 'email':
        // Logique d'envoi d'email
        alert(`Email envoyé à ${selectedUsers.length} utilisateur(s) !`);
        break;
    }
  };

  const handleUserAction = (action, userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch(action) {
      case 'activate':
        if (confirm(`Activer ${user.name} ?`)) {
          alert(`${user.name} activé !`);
        }
        break;
      case 'suspend':
        if (confirm(`Suspendre ${user.name} ?`)) {
          alert(`${user.name} suspendu !`);
        }
        break;
      case 'delete':
        if (confirm(`Supprimer ${user.name} ? Cette action est irréversible.`)) {
          alert(`${user.name} supprimé !`);
        }
        break;
      case 'message':
        // Logique d'envoi de message
        alert(`Message envoyé à ${user.name} !`);
        break;
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    newToday: 12,
    pending: users.filter(u => u.status === 'pending').length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    avgSpent: Math.round(users.reduce((sum, u) => sum + u.totalSpent, 0) / users.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gestion des utilisateurs et permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/utilisateurs/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Nouvel utilisateur
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Nouveaux (24h)</p>
          <p className="text-2xl font-bold text-blue-600">{stats.newToday}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Revenu total</p>
          <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Moyenne/user</p>
          <p className="text-2xl font-bold text-gray-900">€{stats.avgSpent}</p>
        </div>
      </div>

      {/* Filtres et recherche avec actions groupées */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
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
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="suspended">Suspendus</option>
              <option value="pending">En attente</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Plus de filtres
            </button>
          </div>
        </div>
        
        {/* Actions groupées */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">
                  {selectedUsers.length} utilisateur(s) sélectionné(s)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleBulkAction('activate')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
                >
                  <Unlock className="w-4 h-4" />
                  Activer
                </button>
                <button 
                  onClick={() => handleBulkAction('suspend')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
                >
                  <Ban className="w-4 h-4" />
                  Suspendre
                </button>
                <button 
                  onClick={() => handleBulkAction('email')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Envoyer email
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Table des utilisateurs */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                    {user.verified && (
                      <div className="mt-1 text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {user.registration}
                      </div>
                      {user.lastLogin && (
                        <div className="text-xs text-gray-500">
                          Dernière connexion: {user.lastLogin}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.purchases} achats
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      €{user.totalSpent.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/dashboard/utilisateurs/${user.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir profil"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleUserAction('message', user.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Envoyer message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleUserAction('activate', user.id)}
                        className="text-green-600 hover:text-green-900"
                        title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <Link 
                        href={`/dashboard/utilisateurs/${user.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleUserAction('delete', user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
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

      {/* Graphiques et analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Répartition par rôle">
          <div className="h-64 flex items-center justify-center">
            <div className="flex items-center space-x-8">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    background: `conic-gradient(
                      #EF4444 0% 20%,
                      #8B5CF6 20% 40%,
                      #F59E0B 40% 60%,
                      #3B82F6 60% 100%
                    )`
                  }}
                ></div>
                <div className="absolute inset-8 bg-white rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">Admins (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm">Modérateurs (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Premium (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Utilisateurs (40%)</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Inscriptions par jour (7 derniers jours)">
          <div className="h-64 flex items-end justify-between px-4">
            {[12, 8, 15, 10, 18, 14, 20].map((count, day) => (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                  style={{ height: `${(count / 25) * 100}%` }}
                ></div>
                <div className="mt-2 text-xs text-gray-600">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][day]}
                </div>
                <div className="text-xs font-medium text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}