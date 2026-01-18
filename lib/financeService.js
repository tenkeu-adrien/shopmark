// lib/api/financeService.js
import { firestoreService } from '@/lib/initCollections';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';
class FinanceService {
  // 🔵 CRÉATION D'UN DÉPÔT
  async createDeposit(userId, depositData) {
    try {
      // await firestoreService.initializeIfNeeded();
      
      const depositId = `DEP${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      const depositDoc = {
        depositId,
        userId,
        amount: parseFloat(depositData.amount),
        paymentMethod: depositData.paymentMethod,
        agentNumber: depositData.agentNumber,
        transactionId: depositData.transactionId,
        status: 'pending',
        fees: depositData.fees || 0,
        totalAmount: depositData.totalAmount,
        userPhone: depositData.userPhone,
        userEmail: depositData.userEmail,
        // Récupérer automatiquement depuis auth
        userName: depositData.userName || '',
        metadata: {
          device: 'mobile-app',
          timestamp: new Date().toISOString(),
          version: '1.0'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        adminNotes: '',
        processedBy: null,
        processedAt: null
      };

      // Ajouter à la collection transactions
      const depositRef = doc(db, 'transactions', depositId);
      await setDoc(depositRef, depositDoc);

      // Mettre à jour l'historique utilisateur
      const userTransactionsRef = doc(db, 'user_transactions', userId);
      const userDoc = await getDoc(userTransactionsRef);
      
      if (userDoc.exists()) {
        await updateDoc(userTransactionsRef, {
          deposits: arrayUnion(depositId),
          updatedAt: new Date()
        });
      } else {
        await setDoc(userTransactionsRef, {
          userId,
          deposits: [depositId],
          withdrawals: [],
          updatedAt: new Date()
        });
      }

      return {
        success: true,
        depositId,
        message: 'Dépôt soumis avec succès. En attente de validation admin.',
        status: 'pending'
      };
    } catch (error) {
      console.error('Erreur création dépôt:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🔴 CRÉATION D'UN RETRAIT
  async createWithdrawal(userId, withdrawalData) {
    try {
      // await firestoreService.initializeIfNeeded();
      
      const withdrawalId = `WIT${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      const withdrawalDoc = {
        withdrawalId,
        userId,
        amount: parseFloat(withdrawalData.amount),
        fees: withdrawalData.fees || 0,
        netAmount: withdrawalData.netAmount,
        paymentMethod: withdrawalData.paymentMethod,
        recipientPhone: withdrawalData.recipientPhone,
        recipientName: withdrawalData.recipientName, // NOUVEAU CHAMP
        agentNumber: withdrawalData.agentNumber,
        status: 'pending',
        // Récupérer automatiquement
        userPhone: withdrawalData.userPhone,
        userEmail: withdrawalData.userEmail,
        userName: withdrawalData.userName || '',
        metadata: {
          device: 'mobile-app',
          timestamp: new Date().toISOString(),
          version: '1.0'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        adminNotes: '',
        approvedBy: null,
        approvedAt: null,
        processedAt: null,
        transactionProof: ''
      };

      // Vérifier le solde utilisateur
      const walletRef = doc(db, 'wallets', userId);
      const walletDoc = await getDoc(walletRef);
      
      if (!walletDoc.exists()) {
        return {
          success: false,
          error: 'Portefeuille utilisateur non trouvé'
        };
      }

      const walletData = walletDoc.data();
      const availableBalance = walletData.balances?.wallet?.amount || 0;
      
      if (availableBalance < parseFloat(withdrawalData.amount)) {
        return {
          success: false,
          error: 'Solde insuffisant pour ce retrait'
        };
      }

      // Ajouter à la collection transactions
      const withdrawalRef = doc(db, 'transactions', withdrawalId);
      await setDoc(withdrawalRef, withdrawalDoc);

      // Mettre à jour l'historique utilisateur
      const userTransactionsRef = doc(db, 'user_transactions', userId);
      const userDoc = await getDoc(userTransactionsRef);
      
      if (userDoc.exists()) {
        await updateDoc(userTransactionsRef, {
          withdrawals: arrayUnion(withdrawalId),
          updatedAt: new Date()
        });
      } else {
        await setDoc(userTransactionsRef, {
          userId,
          deposits: [],
          withdrawals: [withdrawalId],
          updatedAt: new Date()
        });
      }

      return {
        success: true,
        withdrawalId,
        message: 'Demande de retrait soumise avec succès. En attente de validation admin.',
        status: 'pending'
      };
    } catch (error) {
      console.error('Erreur création retrait:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 📊 RÉCUPÉRER LES STATISTIQUES UTILISATEUR
  async getUserStats(userId) {
    try {
      const walletRef = doc(db, 'wallets', userId);
      const walletDoc = await getDoc(walletRef);
      
      if (!walletDoc.exists()) {
        return null;
      }

      return walletDoc.data();
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      return null;
    }
  }

  // 📋 RÉCUPÉRER L'HISTORIQUE DES TRANSACTIONS
  async getUserTransactions(userId) {
    try {
      const userTransactionsRef = doc(db, 'user_transactions', userId);
      const userDoc = await getDoc(userTransactionsRef);
      
      if (!userDoc.exists()) {
        return { deposits: [], withdrawals: [] };
      }

      const userData = userDoc.data();
      const transactions = { deposits: [], withdrawals: [] };

      // Récupérer les détails de chaque transaction
      if (userData.deposits && userData.deposits.length > 0) {
        for (const depositId of userData.deposits) {
          const depositRef = doc(db, 'transactions', depositId);
          const depositDoc = await getDoc(depositRef);
          if (depositDoc.exists()) {
            transactions.deposits.push(depositDoc.data());
          }
        }
      }

      if (userData.withdrawals && userData.withdrawals.length > 0) {
        for (const withdrawalId of userData.withdrawals) {
          const withdrawalRef = doc(db, 'transactions', withdrawalId);
          const withdrawalDoc = await getDoc(withdrawalRef);
          if (withdrawalDoc.exists()) {
            transactions.withdrawals.push(withdrawalDoc.data());
          }
        }
      }

      return transactions;
    } catch (error) {
      console.error('Erreur récupération transactions:', error);
      return { deposits: [], withdrawals: [] };
    }
  }
}

export const financeService = new FinanceService();