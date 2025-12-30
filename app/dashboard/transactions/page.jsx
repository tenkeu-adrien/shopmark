"use client";

import { 
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  TrendingUp,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  Shield,
  Receipt,
  Banknote,
  Smartphone,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardCard from '@/components/DashboardCard';
import Drawer from '@/components/Drawer';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('status') || 'all';
  const initialType = searchParams.get('type') || 'all';
  
  const [filter, setFilter] = useState(initialFilter);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    totalAmount: 0
  });
  
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
    const interval = setInterval(loadTransactions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      let transactionsQuery = query(
        collection(db, 'transactions'),
        orderBy('createdAt', 'desc')
      );
      
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactionsData = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate?.() || new Date()
      }));

      const totalAmount = transactionsData.reduce((sum, t) => sum + t.amount, 0);
      const pending = transactionsData.filter(t => t.status === 'pending').length;
      const confirmed = transactionsData.filter(t => t.status === 'confirmed').length;
      const rejected = transactionsData.filter(t => t.status === 'rejected').length;

      setStats({
        total: transactionsData.length,
        pending,
        confirmed,
        rejected,
        totalAmount
      });

      setTransactions(transactionsData);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactionDetails = async (transactionId) => {
    try {
      setDrawerLoading(true);
      
      const transactionDoc = await getDoc(doc(db, 'transactions', transactionId));
      if (transactionDoc.exists()) {
        const data = transactionDoc.data();
        
        let userInfo = {};
        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            userInfo = userDoc.data();
          }
        }
        
        setTransactionDetails({
          id: transactionDoc.id,
          ...data,
          userInfo
        });
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleViewTransaction = async (transaction) => {
    setSelectedTransaction(transaction);
    await loadTransactionDetails(transaction.id);
    setViewDrawerOpen(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.status !== filter) return false;
    if (typeFilter !== 'all') {
      const isDeposit = transaction.type === 'deposit' || transaction.depositId ? 'deposit' : 'withdrawal';
      if (typeFilter !== isDeposit) return false;
    }
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.userName?.toLowerCase().includes(searchLower) ||
        transaction.userEmail?.toLowerCase().includes(searchLower) ||
        transaction.recipientName?.toLowerCase().includes(searchLower) ||
        (transaction.depositId || transaction.withdrawalId)?.toLowerCase().includes(searchLower) ||
        transaction.transactionId?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(field);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  const handleTransactionAction = async (transactionId, action) => {
    if (!confirm(`${action === 'approve' ? 'Approuver' : 'Rejeter'} cette transaction ?`)) {
      return;
    }

    try {
      setProcessing(transactionId);
      
      const transactionRef = doc(db, 'transactions', transactionId);
      const transaction = transactions.find(t => t.id === transactionId);
      
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      const newStatus = action === 'approve' ? 'confirmed' : 'rejected';
      
      await updateDoc(transactionRef, {
        status: newStatus,
        processedAt: new Date(),
        processedBy: 'admin',
        updatedAt: new Date()
      });

      if (action === 'approve' && (transaction.type === 'deposit' || transaction.depositId)) {
        const walletRef = doc(db, 'wallets', transaction.userId);
        const walletDoc = await getDoc(walletRef);
        
        if (walletDoc.exists()) {
          const walletData = walletDoc.data();
          const currentBalance = walletData.balances?.wallet?.amount || 0;
          
          await updateDoc(walletRef, {
            'balances.wallet.amount': currentBalance + transaction.amount,
            'balances.wallet.lastUpdated': new Date(),
            'stats.totalDeposited': (walletData.stats?.totalDeposited || 0) + transaction.amount,
            'stats.lastDepositAt': new Date(),
            updatedAt: new Date()
          });
        }
      }

      if (action === 'approve' && (transaction.type === 'withdrawal' || transaction.withdrawalId)) {
        const walletRef = doc(db, 'wallets', transaction.userId);
        const walletDoc = await getDoc(walletRef);
        
        if (walletDoc.exists()) {
          const walletData = walletDoc.data();
          const currentBalance = walletData.balances?.wallet?.amount || 0;
          
          if (currentBalance < transaction.amount) {
            await updateDoc(transactionRef, {
              status: 'rejected',
              adminNotes: `Solde insuffisant. ${transaction.adminNotes || ''}`.trim(),
              updatedAt: new Date()
            });
            
            alert('Erreur: Solde insuffisant pour ce retrait');
            return;
          }

          await updateDoc(walletRef, {
            'balances.wallet.amount': currentBalance - transaction.amount,
            'balances.wallet.lastUpdated': new Date(),
            'stats.totalWithdrawn': (walletData.stats?.totalWithdrawn || 0) + transaction.amount,
            'stats.lastWithdrawalAt': new Date(),
            updatedAt: new Date()
          });
        }
      }

      alert(`Transaction ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès !`);
      
      await loadTransactions();
      
    } catch (error) {
      console.error('Erreur action transaction:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    deposit: 'bg-blue-100 text-blue-800',
    withdrawal: 'bg-purple-100 text-purple-800'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeIcon = (transaction) => {
    if (transaction.type === 'deposit' || transaction.depositId) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    } else {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    }
  };

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

  const exportTransactions = () => {
    const csv = [
      ['ID', 'Type', 'Utilisateur', 'Montant', 'Statut', 'Date', 'Méthode', 'Notes'],
      ...filteredTransactions.map(t => [
        t.transactionId || t.id,
        t.type === 'deposit' || t.depositId ? 'Dépôt' : 'Retrait',
        t.userName || t.userEmail,
        t.amount,
        t.status,
        formatDate(t.date),
        t.paymentMethod,
        t.adminNotes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gestion des transactions financières</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button 
            onClick={loadTransactions}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <button 
            onClick={exportTransactions}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Montant total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)} CDF</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Confirmées</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">En attente</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Rejetées</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
              <XCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
            </div>
          </div>
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
                placeholder="Rechercher une transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="deposit">Dépôts</option>
              <option value="withdrawal">Retraits</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Table des transactions */}
      <DashboardCard>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Utilisateur
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3">
                          <div className="flex items-center">
                            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                              {getTypeIcon(transaction)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {(transaction.type === 'deposit' ? 'DEP' : 'WIT')}-{transaction.id.substring(0, 6)}...
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {transaction.paymentMethod}
                              </div>
                              <div className="text-xs text-gray-500 sm:hidden">
                                {transaction.userName || 'Utilisateur'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.userName || 'Utilisateur'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {transaction.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <div className={`text-base sm:text-lg font-bold ${transaction.type === 'deposit' || transaction.depositId ? 'text-green-600' : 'text-red-600'}`}>
                            {(transaction.type === 'deposit' || transaction.depositId) ? '+' : '-'}{formatAmount(transaction.amount)} CDF
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[transaction.type === 'deposit' || transaction.depositId ? 'deposit' : 'withdrawal']}`}>
                            {transaction.type === 'deposit' || transaction.depositId ? 'Dépôt' : 'Retrait'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                              {getStatusIcon(transaction.status)}
                              <span className="ml-1 hidden sm:inline">
                                {transaction.status === 'confirmed' ? 'Confirmé' : 
                                 transaction.status === 'pending' ? 'En attente' : 'Rejeté'}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {transaction.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleTransactionAction(transaction.id, 'approve')}
                                  disabled={processing === transaction.id}
                                  className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                  title="Approuver"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleTransactionAction(transaction.id, 'reject')}
                                  disabled={processing === transaction.id}
                                  className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                  title="Rejeter"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button 
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Voir détails"
                              onClick={() => handleViewTransaction(transaction)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-500 text-sm sm:text-base">Aucune transaction trouvée</p>
                        {(search || filter !== 'all' || typeFilter !== 'all') && (
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Essayez de modifier vos filtres
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
        
        {filteredTransactions.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500">
              Affichage de 1 à {filteredTransactions.length} sur {transactions.length} transactions
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Drawer de visualisation */}
      <Drawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        title={`Détails de la transaction`}
        size="lg"
        loading={drawerLoading}
      >
        {transactionDetails && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ID Transaction</p>
                <p className="font-mono text-gray-900 font-bold text-sm sm:text-base truncate">{transactionDetails.transactionId || transactionDetails.id}</p>
              </div>
              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[transactionDetails.status]}`}>
                {getStatusIcon(transactionDetails.status)}
                <span className="ml-1 sm:ml-2">
                  {transactionDetails.status === 'confirmed' ? 'Confirmé' : 
                   transactionDetails.status === 'pending' ? 'En attente' : 'Rejeté'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <DollarSign className="w-4 sm:w-5 h-4 sm:h-5" />
                    Montant
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">Montant {transactionDetails.type === 'deposit' ? 'déposé' : 'retiré'}:</span>
                      <span className={`text-lg sm:text-xl md:text-2xl font-bold ${transactionDetails.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transactionDetails.amount?.toLocaleString('fr-FR')} CDF
                      </span>
                    </div>
                    {transactionDetails.fees > 0 && (
                      <div className="flex justify-between items-center border-t border-gray-100 pt-2 sm:pt-3">
                        <span className="text-gray-600 text-sm sm:text-base">Frais:</span>
                        <span className="text-base sm:text-lg font-semibold text-red-600">
                          -{transactionDetails.fees.toLocaleString('fr-FR')} CDF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(transactionDetails.recipientName || transactionDetails.recipientPhone) && (
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                      <User className="w-4 sm:w-5 h-4 sm:h-5" />
                      Bénéficiaire
                    </h4>
                    <div className="space-y-2">
                      {transactionDetails.recipientName && (
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Nom</p>
                          <p className="text-gray-900 font-medium text-sm sm:text-base">{transactionDetails.recipientName}</p>
                        </div>
                      )}
                      {transactionDetails.recipientPhone && (
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Téléphone</p>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Phone className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                            <p className="text-gray-900 font-medium text-sm sm:text-base">{transactionDetails.recipientPhone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <User className="w-4 sm:w-5 h-4 sm:h-5" />
                    Utilisateur
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {transactionDetails.userInfo && (
                      <>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Nom</p>
                          <p className="text-gray-900 text-sm sm:text-base">{transactionDetails.userInfo.displayName || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Email</p>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Mail className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                            <p className="text-gray-900 text-sm sm:text-base">{transactionDetails.userInfo.email}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Téléphone</p>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Phone className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                            <p className="text-gray-900 text-sm sm:text-base">{transactionDetails.userInfo.phone || 'Non spécifié'}</p>
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">ID Utilisateur</p>
                      <p className="text-gray-900 font-mono text-xs sm:text-sm truncate">{transactionDetails.userId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
                    Détails
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Type</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${typeColors[transactionDetails.type === 'deposit' ? 'deposit' : 'withdrawal']}`}>
                        {transactionDetails.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Méthode de paiement</p>
                      <p className="text-gray-900 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                        {transactionDetails.paymentMethod?.includes('Orange') ? (
                          <Smartphone className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" />
                        ) : transactionDetails.paymentMethod?.includes('Airtel') ? (
                          <Smartphone className="w-3 sm:w-4 h-3 sm:h-4 text-red-600" />
                        ) : (
                          <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
                        )}
                        {transactionDetails.paymentMethod || 'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Créée le</p>
                      <p className="text-gray-900 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                        {formatDate(transactionDetails.createdAt)}
                      </p>
                    </div>
                    {transactionDetails.adminNotes && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Notes admin</p>
                        <p className="text-gray-900 bg-yellow-50 p-2 rounded text-xs sm:text-sm">{transactionDetails.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}