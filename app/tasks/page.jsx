'use client';

import { AirVentIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { financeService } from '@/lib/financeService';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function TasksPage() {
  const [activeView, setActiveView] = useState('retraits');
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState({
    retraits: [],
    investissements: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadTransactions(currentUser.uid);
      } else {
        // Si pas d'utilisateur, utiliser les données de démonstration
        setTransactions({
          retraits: retraitsDataDemo,
          investissements: investissementsDataDemo
        });
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Charger les transactions depuis le backend
  const loadTransactions = async (userId) => {
    try {
      setIsLoading(true);
      const userTransactions = await financeService.getUserTransactions(userId);
      
      if (userTransactions) {
        // Traiter les retraits
        const retraits = userTransactions.withdrawals.map(transaction => ({
          id: transaction.withdrawalId,
          libelle: getTransactionLabel(transaction),
          date: formatDate(transaction.createdAt),
          montant: transaction.amount,
          status: transaction.status,
          recipientName: transaction.recipientName,
          recipientPhone: transaction.recipientPhone,
          paymentMethod: transaction.paymentMethod,
          fees: transaction.fees,
          netAmount: transaction.netAmount,
          adminNotes: transaction.adminNotes,
          metadata: transaction.metadata,
          createdAt: transaction.createdAt
        }));

        // Traiter les investissements/dépôts
        const investissements = userTransactions.deposits.map(transaction => ({
          id: transaction.depositId,
          libelle: getTransactionLabel(transaction),
          date: formatDate(transaction.createdAt),
          montant: transaction.amount,
          status: transaction.status,
          paymentMethod: transaction.paymentMethod,
          agentNumber: transaction.agentNumber,
          transactionId: transaction.transactionId,
          totalAmount: transaction.totalAmount,
          adminNotes: transaction.adminNotes,
          metadata: transaction.metadata,
          createdAt: transaction.createdAt
        }));

        setTransactions({
          retraits: retraits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          investissements: investissements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        });
      }
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      // En cas d'erreur, utiliser les données de démonstration
      setTransactions({
        retraits: retraitsDataDemo,
        investissements: investissementsDataDemo
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rafraîchir les transactions
  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await loadTransactions(user.uid);
      setRefreshing(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Obtenir le libellé de la transaction
  const getTransactionLabel = (transaction) => {
    if (transaction.withdrawalId) {
      return `Retrait - ${transaction.status}`;
    } else if (transaction.depositId) {
      return `Investissement - ${transaction.status}`;
    }
    return 'Transaction';
  };

  // Obtenir la couleur en fonction du statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Obtenir l'icône en fonction du statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      case 'processing':
        return 'En traitement';
      default:
        return status;
    }
  };

  // Gérer l'approbation/rejet d'une transaction
  const handleTransactionAction = async (transactionId, action) => {
    try {
      if (!user) {
        alert('Vous devez être connecté pour effectuer cette action.');
        return;
      }

      // Ici, normalement cette action serait réservée à l'admin
      // Pour cet exemple, nous simulons simplement la mise à jour
      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          action,
          adminNotes: adminNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Transaction ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès!`);
        
        // Rafraîchir les transactions
        await loadTransactions(user.uid);
        
        // Fermer les détails
        setSelectedTransaction(null);
        setAdminNotes('');
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur action transaction:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Fonction pour formater les montants
  const formatMontant = (montant) => {
    return montant?.toLocaleString('fr-FR') || '0';
  };

  // Données de démonstration (fallback)
  const retraitsDataDemo = [
    { id: 1, libelle: 'Retrait commandé', date: '15 déc. 2024', montant: 15000, status: 'pending' },
    { id: 2, libelle: 'Retrait commandé', date: '14 déc. 2024', montant: 8500, status: 'confirmed' },
    { id: 3, libelle: 'Retrait commandé', date: '13 déc. 2024', montant: 23000, status: 'rejected' },
    { id: 4, libelle: 'Retrait commandé', date: '12 déc. 2024', montant: 12500, status: 'pending' },
    { id: 5, libelle: 'Retrait commandé', date: '11 déc. 2024', montant: 18000, status: 'confirmed' },
  ];

  const investissementsDataDemo = [
    { id: 1, libelle: 'Investissement', date: '15 déc. 2024', montant: 25000, status: 'pending' },
    { id: 2, libelle: 'Investissement', date: '14 déc. 2024', montant: 18000, status: 'confirmed' },
    { id: 3, libelle: 'Investissement', date: '13 déc. 2024', montant: 32000, status: 'pending' },
    { id: 4, libelle: 'Investissement', date: '12 déc. 2024', montant: 15500, status: 'rejected' },
    { id: 5, libelle: 'Investissement', date: '11 déc. 2024', montant: 27500, status: 'confirmed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-sm font-bold text-gray-800 mb-4">
            Historique {activeView === 'retraits' ? 'des retraits' : 'des investissements'}
          </h1>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading || refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Navigation par onglets */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('retraits')}
            className={`flex-1 py-3 rounded-full font-semibold transition-all text-[10px] ${
              activeView === 'retraits'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Retraits
          </button>
          
          <button
            onClick={() => setActiveView('investissements')}
            className={`flex-1 py-3 rounded-full font-semibold transition-all text-[10px] ${
              activeView === 'investissements'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Investissements
          </button>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-gray-600">Chargement des transactions...</span>
        </div>
      )}

      {/* Message si aucune transaction */}
      {!isLoading && transactions[activeView].length === 0 && (
        <div className="text-center py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Aucune transaction
            </h3>
            <p className="text-gray-500">
              {activeView === 'retraits' 
                ? 'Vous n\'avez effectué aucun retrait pour le moment.'
                : 'Vous n\'avez effectué aucun investissement pour le moment.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Liste des transactions */}
      {!isLoading && transactions[activeView].length > 0 && (
        <div className="space-y-4">
          {transactions[activeView].map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                {/* Colonne gauche : Libellé + Date + Statut */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      {item.libelle}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-gray-500">
                    {item.date}
                  </span>

                  {/* Détails supplémentaires */}
                  {item.paymentMethod && (
                    <span className="text-xs text-gray-600 mt-1">
                      Moyen: {item.paymentMethod}
                    </span>
                  )}

                  {item.recipientName && (
                    <span className="text-xs text-gray-600 mt-1">
                      Bénéficiaire: {item.recipientName}
                    </span>
                  )}

                  {item.fees > 0 && activeView === 'retraits' && (
                    <span className="text-xs text-red-500 mt-1">
                      Frais: {formatMontant(item.fees)} CDF
                    </span>
                  )}
                </div>
                
                {/* Colonne droite : Montant + Boutons */}
                <div className="flex flex-col items-end pl-4">
                  <span className={`font-bold text-lg ${activeView === 'retraits' ? 'text-red-600' : 'text-green-600'}`}>
                    {activeView === 'retraits' ? `-${formatMontant(item.montant)}` : `+${formatMontant(item.montant)}`} CDF
                  </span>
                  
                  {/* Montant net pour les retraits */}
                  {activeView === 'retraits' && item.netAmount && item.fees > 0 && (
                    <span className="text-xs text-gray-500 mt-1">
                      Net: {formatMontant(item.netAmount)} CDF
                    </span>
                  )}

                  {/* Boutons d'action selon le statut */}
                  <div className="flex gap-2 mt-3">
                    {/* <button
                      onClick={() => setSelectedTransaction(selectedTransaction?.id === item.id ? null : item)}
                      className="text-amber-600 hover:text-amber-700 text-[10px] font-medium px-3 py-1.5 border border-amber-600 rounded-lg transition-colors duration-200"
                    >
                      {selectedTransaction?.id === item.id ? 'Masquer' : 'Détails'}
                    </button> */}
                    
                    {/* {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleTransactionAction(item.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleTransactionAction(item.id, 'reject')}
                          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
                        >
                          Rejeter
                        </button>
                      </>
                    )} */}
                  </div>
                </div>
              </div>

              {/* Section des détails développée */}
              {selectedTransaction?.id === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Détails de la transaction</h4>
                  
                  <div className="space-y-2 text-xs">
                    {item.id && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ID Transaction:</span>
                        <span className="font-mono text-gray-700">{item.id}</span>
                      </div>
                    )}

                    {item.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Méthode:</span>
                        <span className="text-gray-700">{item.paymentMethod}</span>
                      </div>
                    )}

                    {item.recipientPhone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Numéro:</span>
                        <span className="text-gray-700">{item.recipientPhone}</span>
                      </div>
                    )}

                    {item.agentNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Numéro Agent:</span>
                        <span className="text-gray-700">{item.agentNumber}</span>
                      </div>
                    )}

                    {item.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ID Transaction client:</span>
                        <span className="font-mono text-gray-700">{item.transactionId}</span>
                      </div>
                    )}

                    {item.fees > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Frais:</span>
                        <span className="text-red-600">-{formatMontant(item.fees)} CDF</span>
                      </div>
                    )}

                    {item.netAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Montant net:</span>
                        <span className="font-semibold text-green-600">{formatMontant(item.netAmount)} CDF</span>
                      </div>
                    )}

                    {item.adminNotes && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <span className="text-yellow-700 text-xs">
                          <strong>Notes admin:</strong> {item.adminNotes}
                        </span>
                      </div>
                    )}

                    {item.status === 'pending' && (
                      <div className="mt-3">
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Ajouter des notes pour cette transaction..."
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                          rows="2"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                          Ces notes seront visibles par l'utilisateur
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

    

      <div className="h-20"></div>
    </div>
  );
}