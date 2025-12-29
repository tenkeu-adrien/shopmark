// app/dashboard/utilisateurs/page.js
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
  
  // États pour les modales
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  
  // Formulaire d'édition
  const [editForm, setEditForm] = useState({
    phone: '',
    email: '',
    displayName: '',
    role: 'user',
    status: 'active',
    invitationCode: ''
  });

  // Charger les utilisateurs
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

  // Charger les détails complets d'un utilisateur
  const loadUserDetails = async (userId) => {
    try {
      setDrawerLoading(true);
      
      // 1. Charger l'utilisateur
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          id: userDoc.id,
          ...userData
        });
        
        // Pré-remplir le formulaire d'édition
        setEditForm({
          phone: userData.phone || '',
          email: userData.email || '',
          displayName: userData.displayName || '',
          role: userData.role || 'user',
          status: userData.status || 'active',
          invitationCode: userData.invitationCode || ''
        });
      }

      // 2. Charger le wallet
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

      // 3. Charger les transactions récentes
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

  // Ouvrir la modale de visualisation
  const handleViewUser = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setViewDrawerOpen(true);
  };

  // Ouvrir la modale d'édition
  const handleEditUser = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setEditDrawerOpen(true);
  };

  // Sauvegarder les modifications
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
      await loadUsers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  // Gérer les actions sur les utilisateurs
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
          // Supprimer aussi le wallet associé
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

  // Actions groupées
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

  // Filtrer les utilisateurs
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

  // Utilitaires d'affichage
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

  // Stats
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gestion des utilisateurs</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadUsers}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <Link 
            href="/dashboard/utilisateurs/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Nouvel utilisateur
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Suspendus</p>
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-blue-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Nouveaux (jour)</p>
          <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
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
                placeholder="Rechercher par nom, email ou téléphone..."
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
              <option value="suspended">Suspendus</option>
              <option value="inactive">Inactifs</option>
            </select>
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
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  {actionLoading ? 'Traitement...' : 'Activer'}
                </button>
                <button 
                  onClick={() => handleBulkAction('suspend')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" />
                  {actionLoading ? 'Traitement...' : 'Suspendre'}
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {actionLoading ? 'Traitement...' : 'Supprimer'}
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
                  Inscription
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || user.phone?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.phone || user.displayName || 'Sans nom'}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email || 'Pas d\'email'}
                          </div>
                          {user.phone && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role || 'user']}`}>
                        {user.role || 'user'}
                      </span>
                      {user.emailVerified && (
                        <div className="mt-1 text-xs text-green-600 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Email vérifié
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status || 'active']}`}>
                        {user.status || 'active'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Dernière connexion: {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {formatDate(user.registration)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.status === 'suspended' ? (
                          <button 
                            onClick={() => handleUserAction('activate', user.id)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Réactiver"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUserAction('suspend', user.id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Suspendre"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleUserAction('delete', user.id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                    {search && (
                      <p className="text-sm text-gray-400 mt-1">
                        Aucun résultat pour "{search}"
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
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
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-gray-900">{userDetails.displayName || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{userDetails.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900">{userDetails.phone || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[userDetails.status || 'active']}`}>
                    {userDetails.status || 'active'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Code d'invitation</label>
                  <p className="text-gray-900 font-mono">{userDetails.invitationCode || 'Non défini'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Inscription</label>
                  <p className="text-gray-900">{formatDate(userDetails.createdAt)}</p>
                </div>
                {userDetails.referrerId && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Parrain</label>
                    <p className="text-gray-900">ID: {userDetails.referrerId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Soldes financiers */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Soldes financiers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Solde Disponible</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatAmount(userWallet.available)} CDF
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Pour investissements/retraits</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Solde Investi</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatAmount(userWallet.invested)} CDF
                  </p>
                  <p className="text-xs text-green-700 mt-1">Actuellement en action</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Total Dépôts</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatAmount(userWallet.totalDeposited)} CDF
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900">Gains Parrainage</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatAmount(userWallet.referralEarnings)} CDF
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">Total Investi</span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatAmount(userWallet.totalInvested)} CDF
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Total Retiré</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatAmount(userWallet.totalWithdrawn)} CDF
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions récentes */}
            {userTransactions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  10 dernières transactions
                </h3>
                <div className="space-y-3">
                  {userTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.type === 'investment' ? 'Investissement' : 
                           transaction.type === 'deposit' ? 'Dépôt' : 
                           transaction.type === 'withdrawal' ? 'Retrait' : 
                           transaction.type === 'referral_commission' ? 'Commission parrainage' : transaction.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </p>
                        {transaction.status && (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                            transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        )}
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} CDF
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={editForm.displayName}
              onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="+243 XX XXX XX XX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code d'invitation
            </label>
            <input
              type="text"
              value={editForm.invitationCode}
              onChange={(e) => setEditForm({...editForm, invitationCode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Code d'invitation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveEdit}
              disabled={actionLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}