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
  Send,
  RefreshCw,
  AlertCircle,
  Wallet,
  TrendingUp,
  CreditCard,
  User,
  Globe,
  PhoneCall,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';
import Drawer from '@/components/Drawer';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

export default function UtilisateursPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  
  const [editForm, setEditForm] = useState({
    phone: '',
    email: '',
    displayName: '',
    role: 'user',
    status: 'active',
    invitationCode: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registration: doc.data().createdAt?.toDate?.() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate?.() || null
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      setDrawerLoading(true);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          id: userDoc.id,
          ...userData
        });
        
        setEditForm({
          phone: userData.phone || '',
          email: userData.email || '',
          displayName: userData.displayName || '',
          role: userData.role || 'user',
          status: userData.status || 'active',
          invitationCode: userData?.invitationCode || ''
        });
      }

      const walletDoc = await getDoc(doc(db, 'wallets', userId));
      if (walletDoc.exists()) {
        const walletData = walletDoc.data();
        setUserWallet({
          available: walletData.balances?.wallet?.amount || 0,
          invested: walletData.balances?.action?.amount || 0,
          totalDeposited: walletData.balances?.totalDeposited?.amount || 0,
          referralEarnings: walletData.stats?.referralEarnings || 0,
          totalEarned: walletData.stats?.totalEarned || 0,
          totalInvested: walletData.stats?.totalInvested || 0,
          totalWithdrawn: walletData.stats?.totalWithdrawn || 0
        });
      }

      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const transactionsSnap = await getDocs(transactionsQuery);
      setUserTransactions(transactionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setViewDrawerOpen(true);
  };

  const handleEditUser = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setEditDrawerOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      const userRef = doc(db, 'users', selectedUser.id);
      
      await updateDoc(userRef, {
        ...editForm,
        updatedAt: new Date()
      });
      
      alert('Utilisateur mis à jour avec succès !');
      setEditDrawerOpen(false);
      await loadUsers();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserAction = async (action, userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const actionText = {
      activate: 'Activer',
      suspend: 'Suspendre',
      delete: 'Supprimer'
    }[action];

    if (!confirm(`${actionText} ${user.displayName || user.email || user.phone} ?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const userRef = doc(db, 'users', userId);
      
      switch(action) {
        case 'activate':
          await updateDoc(userRef, { 
            status: 'active',
            updatedAt: new Date()
          });
          alert(`${user.displayName || user.email || user.phone} activé !`);
          break;
        case 'suspend':
          await updateDoc(userRef, { 
            status: 'suspended',
            updatedAt: new Date()
          });
          alert(`${user.displayName || user.email || user.phone} suspendu !`);
          break;
        case 'delete':
          const walletRef = doc(db, 'wallets', userId);
          await deleteDoc(walletRef);
          await deleteDoc(userRef);
          alert(`${user.displayName || user.email || user.phone} supprimé !`);
          break;
      }

      await loadUsers();
    } catch (error) {
      console.error(`Erreur ${action} utilisateur:`, error);
      alert('Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    if (!confirm(`${action === 'delete' ? 'Supprimer' : action === 'suspend' ? 'Suspendre' : 'Activer'} ${selectedUsers.length} utilisateur(s) ?`)) {
      return;
    }

    try {
      setActionLoading(true);
      
      for (const userId of selectedUsers) {
        const userRef = doc(db, 'users', userId);
        
        switch(action) {
          case 'activate':
            await updateDoc(userRef, { 
              status: 'active',
              updatedAt: new Date()
            });
            break;
          case 'suspend':
            await updateDoc(userRef, { 
              status: 'suspended',
              updatedAt: new Date()
            });
            break;
          case 'delete':
            await deleteDoc(userRef);
            break;
        }
      }

      alert(`${selectedUsers.length} utilisateur(s) ${action === 'delete' ? 'supprimé(s)' : action === 'suspend' ? 'suspendu(s)' : 'activé(s)'} !`);
      
      await loadUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Erreur action groupée:', error);
      alert('Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'all' && user.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        user.id?.toLowerCase().includes(searchLower) ||
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.phoneNumber?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800'
  };

  const formatDate = (date) => {
    if (!date) return 'Jamais';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return amount?.toLocaleString('fr-FR') || '0';
  };

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

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    today: users.filter(u => {
      const today = new Date();
      const regDate = u.registration.toDate ? u.registration.toDate() : new Date(u.registration);
      return regDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gestion des utilisateurs</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button 
            onClick={loadUsers}
            disabled={actionLoading}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <Link 
            href="/dashboard/utilisateurs/nouveau"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Actifs</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Suspendus</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.suspended}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Admins</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Nouveaux</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.today}</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>
        
        {/* Actions groupées */}
        {selectedUsers.length > 0 && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900 text-sm sm:text-base">
                  {selectedUsers.length} sélectionné(s)
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <button 
                  onClick={() => handleBulkAction('activate')}
                  disabled={actionLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Unlock className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Activer</span>
                </button>
                <button 
                  onClick={() => handleBulkAction('suspend')}
                  disabled={actionLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Ban className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Suspendre</span>
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Table des utilisateurs */}
      <DashboardCard>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleSelectAll}
                          className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
                        />
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Rôle
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Inscription
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || user.phone?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-2 sm:ml-3 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {user.phone || user.displayName || 'Sans nom'}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center truncate">
                                <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{user.email || 'Pas d\'email'}</span>
                              </div>
                              {user.phone && (
                                <div className="text-xs text-gray-500 flex items-center truncate">
                                  <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role || 'user']}`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status || 'active']}`}>
                            {user.status || 'active'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1 truncate hidden sm:block">
                            Dernière connexion: {formatDate(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              {formatDate(user.registration)}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Voir profil"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.status === 'suspended' ? (
                              <button 
                                onClick={() => handleUserAction('activate', user.id)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                title="Réactiver"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction('suspend', user.id)}
                                disabled={actionLoading}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                title="Suspendre"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-500 text-sm sm:text-base">Aucun utilisateur trouvé</p>
                        {search && (
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Aucun résultat pour "{search}"
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500">
              Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Drawer de visualisation */}
      <Drawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        title={`Profil de ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
        size="lg"
        loading={drawerLoading}
      >
        {userDetails && userWallet && (
          <div className="space-y-4 sm:space-y-6">
            {/* Informations personnelles */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <User className="w-4 sm:w-5 h-4 sm:h-5" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-gray-900 text-sm sm:text-base">{userDetails.displayName || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 text-sm sm:text-base">{userDetails.email}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900 text-sm sm:text-base">{userDetails.phone || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Statut</label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[userDetails.status || 'active']}`}>
                    {userDetails.status || 'active'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Code d'invitation</label>
                  <p className="text-gray-900 font-mono text-sm sm:text-base">{userDetails?.invitationCode || 'Non défini'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Inscription</label>
                  <p className="text-gray-900 text-sm sm:text-base">{formatDate(userDetails?.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Soldes financiers */}
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <Wallet className="w-4 sm:w-5 h-4 sm:h-5" />
                Soldes financiers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-blue-900">Solde Disponible</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                    {formatAmount(userWallet.available)} CDF
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Pour investissements/retraits</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium text-green-900">Solde Investi</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                    {formatAmount(userWallet.invested)} CDF
                  </p>
                  <p className="text-xs text-green-700 mt-1">Actuellement en action</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" />
                    <span className="text-xs sm:text-sm font-medium text-purple-900">Total Dépôts</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                    {formatAmount(userWallet.totalDeposited)} CDF
                  </p>
                </div>
                <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" />
                    <span className="text-xs sm:text-sm font-medium text-amber-900">Gains Parrainage</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
                    {formatAmount(userWallet.referralEarnings)} CDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Drawer d'édition */}
      <Drawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        title={`Modifier ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
        size="md"
      >
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={editForm.displayName}
              onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="Nom de l'utilisateur"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="email@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="+243 XX XXX XX XX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="user">Utilisateur</option>
              <option value="moderator">Modérateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveEdit}
              disabled={actionLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
            >
              {actionLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}