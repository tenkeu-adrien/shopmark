"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  ChevronRight,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users
} from "lucide-react";
import WebTabFooter from "@/components/WebTabFooter";
import WhatsAppButtonSimple from "@/components/WhatsAppButtonSimple";
import TelegramAppButtone from "@/components/TelegramAppButton";
import HeroSlider from "@/components/HeroSlider";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  updateDoc, 
  writeBatch,
  serverTimestamp,
  increment,
  onSnapshot,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firestoreService } from "@/lib/initCollections";
import { useRouter } from "next/navigation";

export default function CriteoWelcomePage() { 
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [userLevels, setUserLevels] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const router = useRouter();
    const url = "https://shopmark.fr";
const inviteCode = user?.invitationCode || user.uid.substring(0, 8).toUpperCase();
   const inviteLinkCode = `${url}/invite/${inviteCode}`;
  // Vérification d'authentification


  console.log("wallet:", wallet);
useEffect(() => {
  if (!authLoading && !user) {
    router.push(`/invite/${inviteCode}`);
  }
}, [user]);

  // Charger les données utilisateur avec la nouvelle logique
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        firestoreService.initializeIfNeeded();
        
        // 1. Charger le profil utilisateur
        const userDoc = await getDoc(doc(db, 'users', user?.uid));
        if (userDoc.exists()) {
          setUserProfile({
            id: userDoc.id,
            ...userDoc.data()
          });
        }

        // 2. Charger le wallet avec la nouvelle structure
        const walletRef = doc(db, 'wallets', user.uid);
        const walletSnap = await getDoc(walletRef);
        
        if (walletSnap.exists()) {
          const walletData = walletSnap.data();
          setWallet({
            id: walletSnap.id,
            ...walletData
          });
        } else {
          // Créer wallet avec structure corrigée
          await createFixedWallet(user.uid);
        }

        // 3. Charger les niveaux de l'utilisateur
        const userLevelsQuery = query(
          collection(db, 'user_levels'),
          where('userId', '==', user.uid),
          // orderBy('startDate', 'desc') 
        );
        
        const userLevelsSnapshot = await getDocs(userLevelsQuery);
        const userLevelsData = userLevelsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserLevels(userLevelsData);

        // 4. Charger tous les niveaux disponibles
        const levelsSnapshot = await getDocs(collection(db, 'levels'));
        const levelsData = levelsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => a.order - b.order);
        setLevels(levelsData);

        // 5. Charger les stats de l'équipe
        await loadTeamStats(user.uid);

      } catch (error) {
        console.error('Erreur chargement données:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Écoute en temps réel
    const unsubscribeWallet = onSnapshot(
      doc(db, 'wallets', user.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setWallet({
            id: snapshot.id,
            ...snapshot.data()
          });
        }
      }
    );

    const unsubscribeUserLevels = onSnapshot(
      query(
        collection(db, 'user_levels'),
        where('userId', '==', user.uid),
        orderBy('startDate', 'desc')
      ),
      (snapshot) => {
        const userLevelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserLevels(userLevelsData);
      }
    );

    return () => {
      unsubscribeWallet();
      unsubscribeUserLevels();
    };
  }, [user?.uid]);

  // Créer un wallet avec la structure corrigée
  const createFixedWallet = async (userId) => {
    try {
      const walletRef = doc(db, 'wallets', userId);
      const now = serverTimestamp();
      
      const walletData = {
        userId,
        userEmail: user?.email || '',
        userPhone: user?.phone || '',
        // SOLDE CORRIGÉ : Total des dépôts = wallet + action
        balances: {
          wallet: { // Solde disponible pour investir/retirer
            amount: 0,
            currency: 'CDF',
            lastUpdated: now
          },
          action: { // Solde actuellement investi
            amount: 0,
            currency: 'CDF',
            lastUpdated: now
          },
          totalDeposited: { // Total historique des dépôts (NE CHANGE PAS)
            amount: 0,
            currency: 'CDF',
            lastUpdated: now
          }
        },
        stats: {
          totalDeposited: 0, // Somme de tous les dépôts
          totalWithdrawn: 0,
          totalInvested: 0, // Somme de tous les investissements
          totalEarned: 0,   // Gains totaux des niveaux
          referralEarnings: 0, // Gains de parrainage
          lastDepositAt: null,
          lastWithdrawalAt: null,
          lastInvestmentAt: null
        },
        createdAt: now,
        updatedAt: now,
        version: 1
      };

      await setDoc(walletRef, walletData);
      setWallet({
        id: userId,
        ...walletData
      });
    } catch (error) {
      console.error('Erreur création wallet:', error);
    }
  };

  // Charger les stats de l'équipe
  const loadTeamStats = async (userId) => {
    try {
      // Niveau 1 (direct)
      const level1Query = query(
        collection(db, 'users'),
        where('referrerId', '==', userId)
      );
      const level1Snap = await getDocs(level1Query);
      const level1Count = level1Snap.docs.length;

      // Niveau 2
      const level1Users = level1Snap.docs.map(doc => doc.id);
      let level2Count = 0;
      if (level1Users.length > 0) {
        const level2Query = query(
          collection(db, 'users'),
          where('referrerId', 'in', level1Users)
        );
        const level2Snap = await getDocs(level2Query);
        level2Count = level2Snap.docs.length;
        
        // Niveau 3
        const level2Users = level2Snap.docs.map(doc => doc.id);
        let level3Count = 0;
        if (level2Users.length > 0) {
          const level3Query = query(
            collection(db, 'users'),
            where('referrerId', 'in', level2Users)
          );
          const level3Snap = await getDocs(level3Query);
          level3Count = level3Snap.docs.length;
        }

        setTeamStats({
          level1: level1Count,
          level2: level2Count,
          level3: level3Count,
          total: level1Count + level2Count + level3Count
        });
      }
    } catch (error) {
      console.error('Erreur chargement stats équipe:', error);
    }
  };

  // NOUVELLE FONCTION : Vérifier l'éligibilité au changement de niveau
  const canSwitchToLevel = useCallback((targetLevel) => {
    if (!userLevels || userLevels.length === 0) return true; // Premier investissement
    
    const currentActive = userLevels.find(ul => ul.status === 'active');
    if (!currentActive) return true; // Aucun niveau actif
    
    // RÈGLE : Progression irréversible - uniquement vers le haut
    const currentLevel = levels.find(l => l.levelId === currentActive.levelId);
    const targetLevelOrder = levels.find(l => l.levelId === targetLevel.levelId)?.order;
    
    if (!currentLevel || !targetLevelOrder) return false;
    
    return targetLevelOrder > currentLevel.order;
  }, [userLevels, levels]);

  // NOUVELLE LOGIQUE : Gestion des participations avec cohérence financière
  const handleParticipate = async (level) => {
    if (!user || !wallet) {
      setError('Veuillez vous connecter pour participer');
      return;
    }

    // Vérifier si déjà actif dans ce niveau
    const isAlreadyActive = userLevels.some(
      ul => ul.levelId === level.levelId && ul.status === 'active'
    );
    
    if (isAlreadyActive) {
      setError('Vous participez déjà à ce niveau');
      return;
    }

    // Vérifier la progression irréversible
    if (!canSwitchToLevel(level)) {
      setError('Vous ne pouvez pas revenir à un niveau inférieur. La progression est irréversible.');
      return;
    }

    // Vérifier le solde disponible
    const walletBalance = wallet.balances?.wallet?.amount || 0;
    
    if (walletBalance < level.requiredAmount) {
      setError(`Fonds insuffisants. Solde disponible: ${formatAmount(walletBalance)} CDF. Montant requis: ${formatAmount(level.requiredAmount)} CDF`);
      return;
    }

    setParticipating(prev => ({ ...prev, [level.levelId]: true }));
    setError(null);
    setSuccess(null);

    try {
      const batch = writeBatch(db);
      const now = new Date();

      // RÉCUPÉRER LE NIVEAU ACTIF EXISTANT
      const currentActive = userLevels.find(ul => ul.status === 'active');
      
      // LOGIQUE DE TRANSITION
      if (currentActive) {
        // 1. Désactiver l'ancien niveau
        const oldUserLevelRef = doc(db, 'user_levels', currentActive.id);
        batch.update(oldUserLevelRef, {
          status: 'completed',
          endedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          endReason: 'upgraded'
        });

        // 2. Ajouter les gains restants au portefeuille
        // Calculer les gains non versés (si besoin)
        // Pour l'instant, on garde la logique simple
      }

      // 3. DÉBITER LE PORTEFEUILLE
      const walletRef = doc(db, 'wallets', user.uid);
      batch.update(walletRef, {
        'balances.wallet.amount': increment(-level.requiredAmount),
        'balances.wallet.lastUpdated': serverTimestamp(),
        'balances.action.amount': increment(level.requiredAmount),
        'balances.action.lastUpdated': serverTimestamp(),
        'stats.totalInvested': increment(level.requiredAmount),
        'stats.lastInvestmentAt': serverTimestamp(),
        updatedAt: serverTimestamp(),
        version: increment(1)
      });

      // 4. CRÉER LA TRANSACTION
      const transactionRef = doc(collection(db, 'transactions'));
      batch.set(transactionRef, {
        transactionId: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.uid,
        userEmail: user.email,
        type: 'investment',
        amount: level.requiredAmount,
        currency: 'CDF',
        status: 'completed',
        description: `Investissement - Niveau ${level.name}`,
        metadata: {
          levelId: level.levelId,
          levelName: level.name,
          previousLevel: currentActive?.levelName || null,
          isUpgrade: !!currentActive
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 5. CRÉER LE NOUVEAU USER_LEVEL
      const userLevelRef = doc(collection(db, 'user_levels'));
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + level.durationDays);
      
      const nextPayoutAt = new Date(now);
      nextPayoutAt.setDate(now.getDate() + 1);
      nextPayoutAt.setHours(0, 0, 0, 0);

      batch.set(userLevelRef, {
        userLevelId: userLevelRef.id,
        userId: user.uid,
        userEmail: user.email,
        levelId: level.levelId,
        levelName: level.name,
        levelOrder: level.order,
        investedAmount: level.requiredAmount,
        dailyReturnRate: level.dailyReturnRate,
        dailyGain: level.dailyGain,
        startDate: serverTimestamp(),
        scheduledEndDate: Timestamp.fromDate(endDate),
        durationDays: level.durationDays,
        totalEarned: 0,
        status: 'active',
        previousLevelId: currentActive?.levelId || null,
        isFirstInvestment: !currentActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 6. METTRE À JOUR LE PROFIL UTILISATEUR
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        currentLevel: level.levelId,
        currentLevelName: level.name,
        lastInvestmentAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 7. DÉCLENCHER LES COMMISSIONS DE PARRAINAGE
      if (!currentActive) { // Premier investissement
        await triggerReferralCommissions(user.uid, level.requiredAmount, batch);
      }

      // EXÉCUTER LA BATCH
      await batch.commit();

      setSuccess(currentActive 
        ? `✅ Niveau mis à jour ! Vous êtes maintenant au niveau ${level.name}`
        : `✅ Investissement réussi ! Bienvenue au niveau ${level.name}`
      );

      // Recharger après succès
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Erreur investissement:', error);
      setError('Erreur lors de l\'opération. Veuillez réessayer.');
    } finally {
      setParticipating(prev => ({ ...prev, [level.levelId]: false }));
    }
  };

  // Déclencher les commissions de parrainage
// REMPLACEZ les lignes 279-342 par :
const triggerReferralCommissions = async (userId, amount, batch) => {
  console.log('Déclenchement commissions pour:', userId, 'montant:', amount);
  
  try {
    // Récupérer l'utilisateur AVANT le batch
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log('Utilisateur non trouvé:', userId);
      return;
    }
    
    const userData = userSnap.data();
    const referrerId = userData.referrerId;
    
    console.log('ReferrerId trouvé:', referrerId);
    
    if (!referrerId) {
      console.log('Pas de parrain pour cet utilisateur');
      return;
    }

    // 1. CRÉER UNE LISTE DE TOUS LES PARRAINS (3 niveaux max)
    const referrerChain = [];
    let currentReferrerId = referrerId;
    
    for (let i = 0; i < 3; i++) {
      if (!currentReferrerId) break;
      
      // Récupérer chaque parrain AVANT le batch
      const referrerSnap = await getDoc(doc(db, 'users', currentReferrerId));
      if (!referrerSnap.exists()) break;
      
      const referrerData = referrerSnap.data();
      referrerChain.push({
        id: currentReferrerId,
        phone: referrerData.phone,
        email: referrerData.email
      });
      
      // Passer au parrain suivant (pour niveau 2 et 3)
      currentReferrerId = referrerData.referrerId;
    }

    console.log('Chaîne de parrainage trouvée:', referrerChain.length, 'niveaux');

    // 2. APPLIQUER LES COMMISSIONS DANS LE BATCH
    const commissionRates = [0.03, 0.02, 0.01]; // 3%, 2%, 1%
    
    referrerChain.forEach((referrer, index) => {
      if (index >= 3) return; // Sécurité : jamais plus de 3 niveaux
      
      const commission = amount * commissionRates[index];
      console.log(`Commission niveau ${index+1}: ${commission} CDF pour ${referrer.id}`);
      
      // Mettre à jour le wallet du parrain
      const referrerWalletRef = doc(db, 'wallets', referrer.id);
      batch.update(referrerWalletRef, {
        'balances.wallet.amount': increment(commission),
        'balances.wallet.lastUpdated': serverTimestamp(),
        'stats.referralEarnings': increment(commission),
        'stats.totalEarned': increment(commission),
        updatedAt: serverTimestamp(),
        version: increment(1)
      });

      // Créer la transaction de commission
      const commissionRef = doc(collection(db, 'transactions'));
      batch.set(commissionRef, {
        transactionId: `COM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
        userId: referrer.id,
        userPhone: referrer.phone,
        userEmail: referrer.email,
        type: 'referral_commission',
        amount: commission,
        currency: 'CDF',
        status: 'completed',
        description: `Commission parrainage niveau ${index + 1}`,
        metadata: {
          referredUserId: userId,
          referredUserPhone: userData.phone,
          commissionLevel: index + 1,
          investmentAmount: amount,
          commissionRate: commissionRates[index],
          chainIndex: index
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    
    console.log('✅ Commissions préparées pour', referrerChain.length, 'niveaux');
    
  } catch (error) {
    console.error('❌ Erreur détaillée commissions parrainage:', error);
  }
};

  // Formater les montants
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '0';
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount));
  };

  // Vérifier si l'utilisateur peut participer
  const canParticipate = (level) => {
    if (!wallet || !user) return false;
    
    // Vérifier si déjà actif
    const isAlreadyActive = userLevels.some(
      ul => ul.levelId === level.levelId && ul.status === 'active'
    );
    
    if (isAlreadyActive) return false;
    
    // Vérifier progression irréversible
    if (!canSwitchToLevel(level)) return false;
    
    // Vérifier solde
    const walletBalance = wallet.balances?.wallet?.amount || 0;
    return walletBalance >= level.requiredAmount;
  };

  // Calculer le revenu mensuel
  const calculateMonthlyIncome = (dailyGain) => {
    return dailyGain * 30;
  };

  // Vérifier participation active
  const isParticipating = (levelId) => {
    return userLevels.some(
      ul => ul.levelId === levelId && ul.status === 'active'
    );
  };

  // Obtenir le code d'invitation
  const getInvitationCode = () => {
    return user?.invitationCode || user?.uid?.substring(0, 8).toUpperCase() || 'N/A';
  };

  // Obtenir le lien d'invitation
  const getInvitationLink = () => {
    const code = getInvitationCode();
    return `${url}/invite/${code}`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="containerr mx-auto px-4 py-8 w-full">
        
        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-1xl md:text-sm font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            Centre d'accueil SHOPMARK
          </h1>
          <p className="text-gray-400 text-sm">Gestion premium de vos investissements</p>
          
          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-3 max-w-md mx-auto"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-green-500/20 border border-green-500 rounded-lg p-3 max-w-md mx-auto"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        <HeroSlider />
        
        {/* Actions principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-row gap-4 mb-4 h-30"
        >
          <a
            href="/DepotPage"
            className="group bg-white text-gray-900 rounded-xl p-4 flex-1 flex flex-col items-center justify-center transition-all duration-300 hover:bg-amber-50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-95 min-w-0"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-colors" />
              <Wallet className="w-8 h-8 text-amber-600 relative z-10" />
            </div>
            <span className="text-[10px] font-semibold mb-2 text-center">Recharge en espèces</span>
            <p className="text-gray-600 text-[15px] text-center">Ajoutez des fonds à votre compte</p>
          </a>

          <a
            href="/RetraitPage"
            className="group bg-white text-gray-900 rounded-xl flex-1 flex flex-col items-center justify-center transition-all duration-300 hover:bg-amber-50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-95 p-4 min-w-0"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-colors" />
              <CreditCard className="w-10 h-10 text-amber-600 relative z-10" />
            </div>
            <span className="text-[10px] font-semibold mb-2 text-center">Retrait en espèces</span>
            <p className="text-gray-600 text-[10px] text-center">Retirez vos gains facilement</p>
          </a>
        </motion.div>

        {/* Soldes avec nouvelle logique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-12"
        >
          {/* Solde Portefeuille */}
          <div className="bg-white backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 border border-gray-700/50 hover:bg-amber-50 hover:shadow-lg">
            <Wallet className="w-8 h-8 text-blue-500 mb-3" />
            <span className="font-bold text-xl text-[#000] mb-1">
              {formatAmount(wallet?.balances?.wallet?.amount || 0)} CDF
            </span>
            <span className="font-medium text-sm text-gray-600">Solde disponible</span>
            <p className="text-xs text-gray-500 mt-1">Pour investissements/retraits</p>
          </div>

          {/* Solde en Action */}
          <div className="bg-white backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 border border-gray-700/50 hover:bg-amber-50 hover:shadow-lg">
            <TrendingUp className="w-8 h-8 text-emerald-500 mb-3" />
            <span className="font-bold text-xl text-[#000] mb-1">
              {formatAmount(wallet?.balances?.action?.amount || 0)} CDF
            </span>
            <span className="font-medium text-sm text-gray-600">Solde investi</span>
            <p className="text-xs text-gray-500 mt-1">Actuellement en action</p>
          </div>

       
        </motion.div>

        {/* Code d'invitation et stats équipe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Code d'invitation */}
          <div className="bg-white backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 border border-gray-700/50 hover:bg-amber-50 hover:shadow-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Votre lien d'invitation</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-lg text-amber-600">{inviteLinkCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLinkCode);
                  setSuccess('Code copié!');
                }}
                className="text-gray-400 hover:text-amber-600 p-1"
                title="Copier le code"
              >
                📋
              </button>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getInvitationLink());
                setSuccess('Lien copié!');
              }}
              className="text-xs text-amber-600 hover:text-amber-700 underline"
            >
              Copier le lien d'invitation
            </button>
          </div>

    
        
        </motion.div>

        {/* Section niveaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex-1">
            <h2 className="text-[12px] font-bold text-amber-300 flex items-center gap-3">
              <Star className="w-4 h-4" />
              Niveaux d'investissement
            </h2>
            <p className="text-gray-400 mt-2">Progression irréversible • Un seul niveau actif</p>
          </div>
          <div className="flex-1 text-right">
            <h2 className="text-[12px] font-bold text-amber-300 flex items-center justify-end gap-3">
              {userLevels.filter(ul => ul.status === 'active').length} niveau actif
              <TrendingUp className="w-6 h-6" />
            </h2>
            <p className="text-gray-400 mt-2 text-[9px]">Vous ne pouvez pas revenir en arrière</p>
          </div>
        </motion.div>

        {/* Liste des niveaux */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="space-y-6 mb-16"
        >
          {levels.map((level, index) => {
            const isActive = isParticipating(level.levelId);
            const canPart = canParticipate(level);
            const isLocked = !canSwitchToLevel(level) && !isActive;
            
            return (
              <motion.div
                key={level.levelId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                className={`bg-white rounded-2xl shadow-2xl overflow-hidden border ${
                  isActive ? 'border-amber-500 border-2' : 
                  isLocked ? 'border-gray-300 opacity-80' : 
                  'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Contenu gauche */}
                    <div className="flex-1">
                      <div className="inline-block">
                        <div className={`bg-gradient-to-r ${level.gradient} rounded-full border border-gray-300 shadow-inner px-5 py-2.5`}>
                          <h3 className="text-[12px] font-bold text-white text-center tracking-wide">
                            {level.displayName}
                          </h3>
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-green-700">Actuellement actif</span>
                        </div>
                      )}
                      
                      {isLocked && !isActive && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-700">Niveau inférieur</span>
                        </div>
                      )}
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-gray-700">
                            Investissement : <strong className="text-gray-900">{formatAmount(level.requiredAmount)} CDF</strong>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-gray-700">
                            Durée : <strong className="text-gray-900">{level.durationDays} jours</strong>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-700">
                            Gains journaliers : <strong className="text-green-600">{formatAmount(level.dailyGain)} CDF</strong>
                            <span className="text-xs text-gray-500 ml-1">({level.dailyReturnRate * 100}%)</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-gray-700">
                            Revenu mensuel : <strong className="text-blue-600">{formatAmount(calculateMonthlyIncome(level.dailyGain))} CDF</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contenu droite */}
                    <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
                      <div className="relative">
                        <Image 
                          src={level.imageUrl} 
                          alt={level.name} 
                          width={150} 
                          height={150} 
                          className="rounded-sm w-[150px] h-[150px] object-cover"
                          priority={index < 3}
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500 rounded-sm"></div>
                        )}
                      </div>

                      <button
                        onClick={() => handleParticipate(level)}
                        disabled={isActive || participating[level.levelId] || !canPart || isLocked}
                        className={`text-[10px] group font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 min-w-[140px] justify-center ${
                          isActive
                            ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
                            : participating[level.levelId]
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isLocked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : canPart
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Actif
                          </>
                        ) : participating[level.levelId] ? (
                          'Traitement...'
                        ) : isLocked ? (
                          'Progression verrouillée'
                        ) : canPart ? (
                          <>
                            {userLevels.some(ul => ul.status === 'active') ? 'Changer de niveau' : 'Investir'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          'Fonds insuffisants'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className={`h-1 bg-gradient-to-r ${level.gradient}`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section équipe */}
        {/* <TeamSection /> */}
        
        <WhatsAppButtonSimple />
        <TelegramAppButtone />
        <WebTabFooter />
      </div>
    </div>
  );
}