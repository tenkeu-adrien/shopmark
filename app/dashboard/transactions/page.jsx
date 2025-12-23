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
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';

export default function TransactionsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const transactions = [
    {
      id: 'TRX-001',
      user: 'John Doe',
      email: 'john@example.com',
      amount: 150.00,
      type: 'deposit',
      status: 'completed',
      date: '2024-01-15 14:30',
      method: 'Carte bancaire',
      reference: 'REF-789456'
    },
    {
      id: 'TRX-002',
      user: 'Sarah Smith',
      email: 'sarah@example.com',
      amount: 500.00,
      type: 'withdrawal',
      status: 'pending',
      date: '2024-01-15 12:15',
      method: 'Virement bancaire',
      reference: 'REF-789457'
    },
    {
      id: 'TRX-003',
      user: 'Mike Johnson',
      email: 'mike@example.com',
      amount: 75.50,
      type: 'purchase',
      status: 'completed',
      date: '2024-01-14 16:45',
      method: 'PayPal',
      reference: 'REF-789458'
    },
    {
      id: 'TRX-004',
      user: 'Emma Wilson',
      email: 'emma@example.com',
      amount: 250.00,
      type: 'deposit',
      status: 'failed',
      date: '2024-01-14 11:20',
      method: 'Carte bancaire',
      reference: 'REF-789459'
    },
    {
      id: 'TRX-005',
      user: 'David Brown',
      email: 'david@example.com',
      amount: 1000.00,
      type: 'withdrawal',
      status: 'completed',
      date: '2024-01-13 09:30',
      method: 'Virement bancaire',
      reference: 'REF-789460'
    },
    {
      id: 'TRX-006',
      user: 'Lisa Taylor',
      email: 'lisa@example.com',
      amount: 45.00,
      type: 'refund',
      status: 'completed',
      date: '2024-01-12 15:10',
      method: 'Stripe',
      reference: 'REF-789461'
    },
    {
      id: 'TRX-007',
      user: 'Robert Garcia',
      email: 'robert@example.com',
      amount: 300.00,
      type: 'deposit',
      status: 'pending',
      date: '2024-01-12 10:45',
      method: 'Crypto',
      reference: 'REF-789462'
    },
    {
      id: 'TRX-008',
      user: 'Sophia Martinez',
      email: 'sophia@example.com',
      amount: 89.99,
      type: 'purchase',
      status: 'completed',
      date: '2024-01-11 18:20',
      method: 'Apple Pay',
      reference: 'REF-789463'
    }
  ];

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    deposit: 'bg-blue-100 text-blue-800',
    withdrawal: 'bg-purple-100 text-purple-800',
    purchase: 'bg-indigo-100 text-indigo-800',
    refund: 'bg-pink-100 text-pink-800'
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.user.toLowerCase().includes(searchLower) ||
        transaction.email.toLowerCase().includes(searchLower) ||
        transaction.reference.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleApprove = (id) => {
    if (confirm(`Approuver la transaction ${id} ?`)) {
      // Logique d'approbation
      alert(`Transaction ${id} approuvée !`);
    }
  };

  const handleReject = (id) => {
    if (confirm(`Rejeter la transaction ${id} ?`)) {
      // Logique de rejet
      alert(`Transaction ${id} rejetée !`);
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedAmount = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Gestion des transactions financières</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <TrendingUp className="w-4 h-4" />
            Rapports
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="text-2xl font-bold text-gray-900">€{totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant traité</p>
              <p className="text-2xl font-bold text-gray-900">€{completedAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions en attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
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
                placeholder="Rechercher une transaction..."
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
              <option value="completed">Complétées</option>
              <option value="pending">En attente</option>
              <option value="failed">Échouées</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Plus de filtres
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Table des transactions */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Référence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-xs text-gray-500">{transaction.reference}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                      <div className="text-xs text-gray-500">{transaction.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      €{transaction.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[transaction.type]}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleApprove(transaction.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approuver"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReject(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Rejeter"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
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
            Affichage de 1 à {filteredTransactions.length} sur {transactions.length} transactions
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Méthodes de paiement">
          <div className="space-y-3">
            {[
              { method: 'Carte bancaire', count: 45, amount: 12500 },
              { method: 'Virement bancaire', count: 28, amount: 8500 },
              { method: 'PayPal', count: 32, amount: 4200 },
              { method: 'Crypto', count: 12, amount: 3800 },
              { method: 'Apple Pay', count: 18, amount: 2100 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">{item.method}</span>
                  </div>
                  <div className="ml-5">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(item.count / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{item.count} trans.</div>
                  <div className="text-xs text-gray-500">€{item.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Transactions récentes par heure">
          <div className="h-64 flex items-end justify-between px-4">
            {[65, 80, 45, 90, 75, 85, 70, 95, 60, 88, 72, 82].map((value, hour) => (
              <div key={hour} className="flex flex-col items-center">
                <div 
                  className="w-6 bg-gradient-to-t from-green-400 to-green-600 rounded-t-lg"
                  style={{ height: `${value}%` }}
                ></div>
                <div className="mt-2 text-xs text-gray-600">{hour}:00</div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}