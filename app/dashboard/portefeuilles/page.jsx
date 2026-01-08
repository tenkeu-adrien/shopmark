// /app/dashboard/portefeuilles/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw, 
  Wallet,
  Smartphone,
  DollarSign,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Copy,
  QrCode,
  Eye,
  Save,
  X,
  ChevronDown,
  Loader2
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import Drawer from '@/components/Drawer';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';

export default function PortefeuillesPage() {
  const [portefeuilles, setPortefeuilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // États pour les modales
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedPortefeuille, setSelectedPortefeuille] = useState(null);
  
  // États pour les formulaires
  const [newPortefeuille, setNewPortefeuille] = useState({
    provider: 'airtel',
    number: '',
    name: '',
    type: 'mobile',
    status: 'active',
    fees: '0%',
    minAmount: 6000,
    maxAmount: 5000000,
    processingTime: 'Instantané',
    instructions: [],
    notes: ''
  });
  
  const [editForm, setEditForm] = useState({
    number: '',
    name: '',
    status: 'active',
    fees: '0%',
    minAmount: 6000,
    maxAmount: 5000000,
    processingTime: 'Instantané',
    instructions: [],
    notes: ''
  });

  // États pour les actions
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Charger les portefeuilles
  useEffect(() => {
    loadPortefeuilles();
  }, []);

  const loadPortefeuilles = async () => {
    try {
      setLoading(true);
      const portefeuillesQuery = query(
        collection(db, 'portefeuilles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(portefeuillesQuery);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPortefeuilles(data);
      console.log('Portefeuilles chargés:', data);
    } catch (error) {
      console.error('Erreur chargement portefeuilles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les portefeuilles
  const filteredPortefeuilles = portefeuilles.filter(portefeuille => {
    if (filter !== 'all' && portefeuille.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        portefeuille.number?.toLowerCase().includes(searchLower) ||
        portefeuille.name?.toLowerCase().includes(searchLower) ||
        portefeuille.provider?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Gestion des actions
  const handleAddPortefeuille = async () => {
    if (!newPortefeuille.number.trim() || !newPortefeuille.name.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setActionLoading(true);
      await addDoc(collection(db, 'portefeuilles'), {
        ...newPortefeuille,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      alert('Portefeuille ajouté avec succès !');
      setAddDrawerOpen(false);
      resetNewPortefeuille();
      await loadPortefeuilles();
    } catch (error) {
      console.error('Erreur ajout portefeuille:', error);
      alert('Erreur lors de l\'ajout');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPortefeuille = async () => {
    if (!selectedPortefeuille) return;
    
    try {
      setActionLoading(true);
      const portefeuilleRef = doc(db, 'portefeuilles', selectedPortefeuille.id);
      await updateDoc(portefeuilleRef, {
        ...editForm,
        updatedAt: serverTimestamp()
      });
      
      alert('Portefeuille mis à jour avec succès !');
      setEditDrawerOpen(false);
      await loadPortefeuilles();
    } catch (error) {
      console.error('Erreur modification portefeuille:', error);
      alert('Erreur lors de la modification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePortefeuille = async (id, provider, number) => {
    if (!confirm(`Supprimer le portefeuille ${provider} - ${number} ?`)) return;
    
    try {
      setActionLoading(true);
      await deleteDoc(doc(db, 'portefeuilles', id));
      alert('Portefeuille supprimé avec succès !');
      await loadPortefeuilles();
    } catch (error) {
      console.error('Erreur suppression portefeuille:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewPortefeuille = (portefeuille) => {
    setSelectedPortefeuille(portefeuille);
    setViewDrawerOpen(true);
  };

  const handleEditClick = (portefeuille) => {
    setSelectedPortefeuille(portefeuille);
    setEditForm({
      number: portefeuille.number,
      name: portefeuille.name,
      status: portefeuille.status,
      fees: portefeuille.fees,
      minAmount: portefeuille.minAmount,
      maxAmount: portefeuille.maxAmount,
      processingTime: portefeuille.processingTime,
      instructions: portefeuille.instructions || [],
      notes: portefeuille.notes || ''
    });
    setEditDrawerOpen(true);
  };

  const resetNewPortefeuille = () => {
    setNewPortefeuille({
      provider: 'airtel',
      number: '',
      name: '',
      type: 'mobile',
      status: 'active',
      fees: '0%',
      minAmount: 6000,
      maxAmount: 5000000,
      processingTime: 'Instantané',
      instructions: [],
      notes: ''
    });
  };

  // Copier dans le presse-papier
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Formater les montants
  const formatAmount = (amount) => {
    return amount?.toLocaleString('fr-FR') || '0';
  };

  // Icônes selon le provider
  const getProviderIcon = (provider) => {
    switch(provider) {
      case 'orange': return '🟠';
      case 'airtel': return '🔴';
      case 'mpesa': return '🟢';
      case 'crypto': return '💰';
      default: return '📱';
    }
  };

  // Couleurs selon le provider
  const getProviderColor = (provider) => {
    switch(provider) {
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'airtel': return 'bg-red-100 text-red-800';
      case 'mpesa': return 'bg-green-100 text-green-800';
      case 'crypto': return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Couleurs selon le statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistiques
  const stats = {
    total: portefeuilles.length,
    active: portefeuilles.filter(p => p.status === 'active').length,
    orange: portefeuilles.filter(p => p.provider === 'orange').length,
    airtel: portefeuilles.filter(p => p.provider === 'airtel').length,
    mpesa: portefeuilles.filter(p => p.provider === 'mpesa').length,
    crypto: portefeuilles.filter(p => p.provider === 'crypto').length
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
       <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gestion des Portefeuilles</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gérez les numéros de paiement et les portefeuilles</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={loadPortefeuilles}
            disabled={actionLoading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <button 
            onClick={() => setAddDrawerOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau portefeuille</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Actifs</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Orange</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.orange}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Airtel</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.airtel}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">M-Pesa</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.mpesa}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Crypto</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.crypto}</p>
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
                placeholder="Rechercher par numéro, nom ou provider..."
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
              <option value="inactive">Inactifs</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Table des portefeuilles */}
      <DashboardCard className='mb-40'>
        <div className="overflow-x-auto -mx-2 sm:mx-0 ">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro / Adresse
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Nom associé
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Limites
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPortefeuilles.length > 0 ? (
                    filteredPortefeuilles.map((portefeuille) => (
                      <motion.tr 
                        key={portefeuille.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-2 sm:px-4 py-3">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getProviderIcon(portefeuille.provider)}</span>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(portefeuille.provider)}`}>
                              {portefeuille.provider === 'orange' ? 'Orange Money' :
                               portefeuille.provider === 'airtel' ? 'Airtel Money' :
                               portefeuille.provider === 'mpesa' ? 'M-Pesa' :
                               'USDT BEP20'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {portefeuille.number}
                              </div>
                              {portefeuille.type && (
                                <div className="text-xs text-gray-500">
                                  {portefeuille.type === 'crypto' ? 'Adresse BEP20' : 'Numéro mobile'}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => copyToClipboard(portefeuille.number, portefeuille.id)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Copier"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm font-medium text-gray-900">
                            {portefeuille.name || 'Non spécifié'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Propriétaire
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(portefeuille.status)}`}>
                            {portefeuille.status === 'active' ? 'Actif' :
                             portefeuille.status === 'inactive' ? 'Inactif' : 'Maintenance'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-900">
                            Min: {formatAmount(portefeuille.minAmount)} CDF
                          </div>
                          <div className="text-sm text-gray-900">
                            Max: {formatAmount(portefeuille.maxAmount)} CDF
                          </div>
                          <div className="text-xs text-gray-500">
                            Frais: {portefeuille.fees}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleViewPortefeuille(portefeuille)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Voir détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditClick(portefeuille)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePortefeuille(portefeuille.id, portefeuille.provider, portefeuille.number)}
                              disabled={actionLoading}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-500 text-sm sm:text-base">Aucun portefeuille trouvé</p>
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
      </DashboardCard>

      {/* Drawer d'ajout */}
      <Drawer
        isOpen={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title="Ajouter un nouveau portefeuille"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider *
            </label>
            <select
              value={newPortefeuille.provider}
              onChange={(e) => setNewPortefeuille({...newPortefeuille, provider: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="airtel">Airtel Money</option>
              <option value="orange">Orange Money</option>
              <option value="mpesa">M-Pesa</option>
              <option value="crypto">USDT BEP20</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newPortefeuille.provider === 'crypto' ? 'Adresse BEP20 *' : 'Numéro argent *'}
            </label>
            <input
              type="text"
              value={newPortefeuille.number}
              onChange={(e) => setNewPortefeuille({...newPortefeuille, number: e.target.value})}
              placeholder={newPortefeuille.provider === 'crypto' ? '0x...' : 'XX XXX XX XX'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom associé *
            </label>
            <input
              type="text"
              value={newPortefeuille.name}
              onChange={(e) => setNewPortefeuille({...newPortefeuille, name: e.target.value})}
              placeholder="Nom du propriétaire"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={newPortefeuille.status}
              onChange={(e) => setNewPortefeuille({...newPortefeuille, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
{/* 
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant minimum (CDF)
              </label>
              <input
                type="number"
                value={newPortefeuille.minAmount}
                onChange={(e) => setNewPortefeuille({...newPortefeuille, minAmount: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant maximum (CDF)
              </label>
              <input
                type="number"
                value={newPortefeuille.maxAmount}
                onChange={(e) => setNewPortefeuille({...newPortefeuille, maxAmount: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
            </div>
          </div> */}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleAddPortefeuille}
              disabled={actionLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
            >
              {actionLoading ? 'Ajout en cours...' : 'Ajouter le portefeuille'}
            </button>
          </div>
        </div>
      </Drawer>

      {/* Drawer de modification */}
      <Drawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        title={`Modifier le portefeuille ${selectedPortefeuille?.provider}`}
        size="md"
      >
        {selectedPortefeuille && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedPortefeuille.provider === 'crypto' ? 'Adresse BEP20 *' : 'Numéro  argent*'}
              </label>
              <input
                type="text"
                value={editForm.number}
                onChange={(e) => setEditForm({...editForm, number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom associé *
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
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
                <option value="inactive">Inactif</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant minimum (CDF)
                </label>
                <input
                  type="number"
                  value={editForm.minAmount}
                  onChange={(e) => setEditForm({...editForm, minAmount: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant maximum (CDF)
                </label>
                <input
                  type="number"
                  value={editForm.maxAmount}
                  onChange={(e) => setEditForm({...editForm, maxAmount: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleEditPortefeuille}
                disabled={actionLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {actionLoading ? 'Mise à jour...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Drawer de visualisation */}
      <Drawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        title="Détails du portefeuille"
        size="lg"
      >
        {selectedPortefeuille && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getProviderIcon(selectedPortefeuille.provider)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPortefeuille.provider === 'orange' ? 'Orange Money' :
                       selectedPortefeuille.provider === 'airtel' ? 'Airtel Money' :
                       selectedPortefeuille.provider === 'mpesa' ? 'M-Pesa' :
                       'Crypto BEP20'}
                    </h3>
                    <p className="text-sm text-gray-600">Provider</p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPortefeuille.status)}`}>
                  {selectedPortefeuille.status === 'active' ? 'Actif' :
                   selectedPortefeuille.status === 'inactive' ? 'Inactif' : 'Maintenance'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Numéro / Adresse</label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-medium text-gray-900 font-mono break-all">
                      {selectedPortefeuille.number}
                    </p>
                    <button
                      onClick={() => copyToClipboard(selectedPortefeuille.number, 'view')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">Nom associé</label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {selectedPortefeuille.name || 'Non spécifié'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Frais</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedPortefeuille.fees}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Délai de traitement</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedPortefeuille.processingTime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-blue-700">Minimum</label>
                    <p className="text-lg font-bold text-blue-900 mt-1">
                      {formatAmount(selectedPortefeuille.minAmount)} CDF
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-green-700">Maximum</label>
                    <p className="text-lg font-bold text-green-900 mt-1">
                      {formatAmount(selectedPortefeuille.maxAmount)} CDF
                    </p>
                  </div>
                </div>

                {selectedPortefeuille.notes && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Notes</label>
                    <p className="text-sm text-gray-700 mt-1 bg-yellow-50 p-3 rounded">
                      {selectedPortefeuille.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}