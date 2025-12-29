// lib/firebase/firestoreService.js
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  getDocs,
  query,
  where
} from 'firebase/firestore';

// Cache pour éviter des vérifications répétées
const collectionCache = new Set();

class FirestoreService {
  constructor() {
    this.initialized = false;
  }

  // Vérifie si une collection existe
  async checkCollectionExists(collectionName) {
    if (collectionCache.has(collectionName)) {
      return true;
    }

    try {
      // Tenter de lire un document (peut être vide)
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef.limit(1));
      
      // Si pas d'erreur, la collection existe
      collectionCache.add(collectionName);
      return true;
    } catch (error) {
      // Si erreur spécifique "collection not found", elle n'existe pas
      if (error.code === 'failed-precondition' || error.message.includes('not found')) {
        return false;
      }
      // Autre erreur, on suppose qu'elle existe
      console.warn(`Erreur vérification collection ${collectionName}:`, error.message);
      return true;
    }
  }

  // Initialise toutes les collections si nécessaire
  async initializeIfNeeded() {
    // if (this.initialized) return true;

    console.log('🔍 Vérification des collections Firestore...');
    
    const collectionsToCheck = [
      'wallets',
      'levels', 
      'user_levels',
      'daily_earnings',
      'system_settings',
      'transactions'
    ];

    try {
      for (const collectionName of collectionsToCheck) {
        const exists = await this.checkCollectionExists(collectionName);
        
        if (!exists) {
          console.log(`📦 Création de la collection: ${collectionName}`);
          await this.createInitialDocuments(collectionName);
        } else {
          console.log(`✅ Collection ${collectionName} existe déjà`);
        }
      }

      this.initialized = true;
      console.log('🎉 Toutes les collections sont prêtes!');
      return true;
    } catch (error) {
      console.error('❌ Erreur initialisation collections:', error);
      return false;
    }
  }

  // Crée les documents initiaux pour chaque collection
  async createInitialDocuments(collectionName) {
    switch (collectionName) {
      case 'levels':
        await this.createLevels();
        break;
      case 'system_settings':
        await this.createSystemSettings();
        break;
      case 'wallets':
        // Pas besoin de documents initiaux, créés dynamiquement
        console.log('ℹ️ Collection wallets prête pour création dynamique');
        break;
      default:
        // Pour les autres collections, créer un document vide pour "activer" la collection
        await this.createCollectionPlaceholder(collectionName);
    }
  }

  // Crée les niveaux d'investissement
  async createLevels() {
    const levels = [
      {
        levelId: "silver",
        name: "Silver",
        displayName: "LV1: Silver",
        order: 1,
        requiredAmount: 30000,
        dailyReturnRate: 0.02,
        durationDays: 365,
        dailyGain: 600,
        monthlyGain: 18000,
        totalGain: 219000,
        imageUrl: "/n1.jpeg",
        color: "gray",
        gradient: "from-gray-400 via-slate-500 to-gray-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "gold",
        name: "Gold",
        displayName: "LV2: Gold",
        order: 2,
        requiredAmount: 90000,
        dailyReturnRate: 0.02,
        durationDays: 365,
        dailyGain: 1800,
        monthlyGain: 54000,
        totalGain: 657000,
        imageUrl: "/n2.jpeg",
        color: "yellow",
        gradient: "from-yellow-400 via-amber-500 to-yellow-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "platinum",
        name: "Platinum",
        displayName: "LV3: Platinum",
        order: 3,
        requiredAmount: 170000,
        dailyReturnRate: 0.02,
        durationDays: 365,
        dailyGain: 3400,
        monthlyGain: 102000,
        totalGain: 1241000,
        imageUrl: "/n3.jpeg",
        color: "slate",
        gradient: "from-slate-400 via-zinc-500 to-slate-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "diamond",
        name: "Diamond",
        displayName: "LV4: Diamond",
        order: 4,
        requiredAmount: 245000,
        dailyReturnRate: 0.025,
        durationDays: 365,
        dailyGain: 6125,
        monthlyGain: 183750,
        totalGain: 2235625,
        imageUrl: "/n4.jpeg",
        color: "cyan",
        gradient: "from-cyan-400 via-sky-500 to-cyan-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "ruby",
        name: "Ruby",
        displayName: "LV5: Ruby",
        order: 5,
        requiredAmount: 500000,
        dailyReturnRate: 0.025,
        durationDays: 365,
        dailyGain: 12500,
        monthlyGain: 375000,
        totalGain: 4562500,
        imageUrl: "/n5.jpeg",
        color: "red",
        gradient: "from-red-400 via-rose-500 to-red-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "emerald",
        name: "Emerald",
        displayName: "LV6: Emerald",
        order: 6,
        requiredAmount: 650000,
        dailyReturnRate: 0.025,
        durationDays: 365,
        dailyGain: 16250,
        monthlyGain: 487500,
        totalGain: 5931250,
        imageUrl: "/n6.jpeg",
        color: "emerald",
        gradient: "from-emerald-400 via-green-500 to-emerald-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "sapphire",
        name: "Sapphire",
        displayName: "LV7: Sapphire",
        order: 7,
        requiredAmount: 800000,
        dailyReturnRate: 0.03,
        durationDays: 365,
        dailyGain: 24000,
        monthlyGain: 720000,
        totalGain: 8760000,
        imageUrl: "/n7.jpeg",
        color: "blue",
        gradient: "from-blue-400 via-indigo-500 to-blue-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "amethyst",
        name: "Amethyst",
        displayName: "LV8: Amethyst",
        order: 8,
        requiredAmount: 1000000,
        dailyReturnRate: 0.03,
        durationDays: 365,
        dailyGain: 30000,
        monthlyGain: 900000,
        totalGain: 10950000,
        imageUrl: "/n8.jpeg",
        color: "purple",
        gradient: "from-purple-400 via-violet-500 to-purple-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "titanium",
        name: "Titanium",
        displayName: "LV9: Titanium",
        order: 9,
        requiredAmount: 1500000,
        dailyReturnRate: 0.035,
        durationDays: 365,
        dailyGain: 52500,
        monthlyGain: 1575000,
        totalGain: 19162500,
        imageUrl: "/n9.jpeg",
        color: "zinc",
        gradient: "from-zinc-400 via-neutral-500 to-zinc-600",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        levelId: "obsidian",
        name: "Obsidian",
        displayName: "LV10: Obsidian",
        order: 10,
        requiredAmount: 2000000,
        dailyReturnRate: 0.035,
        durationDays: 365,
        dailyGain: 70000,
        monthlyGain: 2100000,
        totalGain: 25550000,
        imageUrl: "/n10.jpeg",
        color: "black",
        gradient: "from-gray-700 via-black to-gray-700",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];
    
    for (const level of levels) {
      const levelDoc = doc(db, 'levels', level.levelId);
      await setDoc(levelDoc, level);
      console.log(`✅ Niveau ${level.name} créé`);
    }
  }

  // Crée les paramètres système
  async createSystemSettings() {
    const settings = [
      {
        key: "min_deposit_amount",
        value: 6000,
        type: "number",
        description: "Montant minimum de dépôt",
        category: "deposit",
        updatedAt: serverTimestamp(),
        updatedBy: "system"
      },
      {
        key: "min_withdrawal_amount",
        value: 3000,
        type: "number",
        description: "Montant minimum de retrait",
        category: "withdrawal",
        updatedAt: serverTimestamp(),
        updatedBy: "system"
      },
      {
        key: "withdrawal_fee_percentage",
        value: 10,
        type: "number",
        description: "Pourcentage de frais sur les retraits",
        category: "withdrawal",
        updatedAt: serverTimestamp(),
        updatedBy: "system"
      },
      {
        key: "deposit_fee_percentage",
        value: 0,
        type: "number",
        description: "Pourcentage de frais sur les dépôts",
        category: "deposit",
        updatedAt: serverTimestamp(),
        updatedBy: "system"
      },
      {
        key: "maintenance_mode",
        value: false,
        type: "boolean",
        description: "Mode maintenance de l'application",
        category: "general",
        updatedAt: serverTimestamp(),
        updatedBy: "system"
      }
    ];
    
    for (const setting of settings) {
      const settingDoc = doc(db, 'system_settings', setting.key);
      await setDoc(settingDoc, setting);
      console.log(`✅ Paramètre ${setting.key} créé`);
    }
  }

  // Crée un document placeholder pour activer une collection
  async createCollectionPlaceholder(collectionName) {
    const placeholderDoc = doc(collection(db, collectionName), '_placeholder');
    await setDoc(placeholderDoc, {
      _createdAt: serverTimestamp(),
      _type: 'collection_placeholder',
      _note: 'Document créé pour initialiser la collection'
    });
  }

  // Méthode intelligente pour créer les documents utilisateur
  async ensureUserDocuments(userId, userData) {
    try {
      // 1. Vérifier/Créer le wallet
      const walletRef = doc(db, 'wallets', userId);
      const walletDoc = await getDoc(walletRef);
      
      if (!walletDoc.exists()) {
        await setDoc(walletRef, {
          userId,
          userEmail: userData.email || '',
          userPhone: userData.phone || '',
          balances: {
            wallet: {
              amount: 0,
              currency: 'CDF',
              lastUpdated: serverTimestamp()
            },
            action: {
              amount: 0,
              currency: 'CDF',
              lastUpdated: serverTimestamp()
            },
            locked: {
              amount: 0,
              currency: 'CDF',
              lastUpdated: serverTimestamp()
            }
          },
          stats: {
            totalDeposited: 0,
            totalWithdrawn: 0,
            totalInvested: 0,
            totalEarned: 0,
            lastDepositAt: null,
            lastWithdrawalAt: null,
            lastInvestmentAt: null
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          version: 1
        });
        console.log('✅ Wallet créé pour:', userId);
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur création documents utilisateur:', error);
      throw error;
    }
  }

  // Vérifie et complète les niveaux manquants
  async ensureLevelsExist() {
    const requiredLevelIds = [
      'silver', 'gold', 'platinum', 'diamond', 'ruby', 
      'emerald', 'sapphire', 'amethyst', 'titanium', 'obsidian'
    ];

    for (const levelId of requiredLevelIds) {
      const levelRef = doc(db, 'levels', levelId);
      const levelDoc = await getDoc(levelRef);
      
      if (!levelDoc.exists()) {
        console.log(`⚠️ Niveau ${levelId} manquant, création...`);
        await this.createLevels(); // Recrée tous les niveaux
        break; // Sortir après avoir tout recréé
      }
    }
  }
}

// Instance unique (singleton)
export const firestoreService = new FirestoreService();