// // services/teamService.js
// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs,
//   doc,
//   getDoc,
//   limit,
//   orderBy,
//   writeBatch,
//   serverTimestamp
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import useTeamStore from '@/lib/teamStore';

// class TeamService {
//   constructor() {
//     this.batchSize = 30; // Limite Firestore 'in'
//   }

//   // ========== SERVICE POUR TEAM SECTION ==========

//   // async getTeamStats(userId) {
//   //   const store = useTeamStore.getState();
    
//   //   // Vérifier le cache
//   //   const cached = store.getTeamStats(userId);
//   //   if (cached) {
//   //     return cached;
//   //   }
    
//   //   try {

//   //     console.log('getTeamStats');
      
//   //      const commissionsQuery = query(
//   //   collection(db, 'transactions'),
//   //   where('userId', '==', userId),
//   //   where('type', '==', 'referral_commission')
//   // )
  
//   //     // 1. Récupérer les stats de base en parallèle
//   //     const [userDoc, walletDoc] = await Promise.all([
//   //       getDoc(doc(db, 'users', userId)),
//   //       getDoc(doc(db, 'wallets', userId))
//   //     ]);
      
//   //     const invitationCode = userDoc.data()?.invitationCode || userId.substring(0, 8).toUpperCase();
      
//   //     // 2. Calculer les membres avec approche optimisée
//   //     const teamStats = await this.calculateTeamMembersOptimized(userId);
      
//   //     // 3. Préparer les données
//   //     const walletData = walletDoc.exists() ? walletDoc.data() : {};
//   //     const commissionEarned = walletData.stats?.referralEarnings || 0;
//   //     const totalRevenue = commissionEarned + (walletData.stats?.totalEarned || 0);
      
//   //     const result = {
//   //       invitationCode,
//   //       invitationLink: `https://shopmark.fr/invite/${invitationCode}`,
//   //       teamMembers: {
//   //         level1: teamStats.level1,
//   //         level2: teamStats.level2,
//   //         level3: teamStats.level3,
//   //         total: teamStats.level1 + teamStats.level2 + teamStats.level3
//   //       },
//   //       totalRevenue,
//   //       commissionEarned,
//   //       levels: this.prepareCommissionLevels(
//   //         teamStats.level1,
//   //         teamStats.level2,
//   //         teamStats.level3,
//   //         teamStats.level1Investment,
//   //         teamStats.level2Investment,
//   //         teamStats.level3Investment
//   //       ),
//   //       timestamp: Date.now()
//   //     };
      
//   //     // Mettre en cache
//   //     store.setTeamStats(userId, result);
      
//   //     console.log('getTeamStats');
//   //     return result;
      
//   //   } catch (error) {
//   //     console.error('Erreur getTeamStats:', error);
//   //     throw error;
//   //   }
//   // }

//   async getTeamStats(userId) {
//   const store = useTeamStore.getState();
  
//   // Vérifier le cache
//   const cached = store.getTeamStats(userId);
//   if (cached) {
//     return cached;
//   }
  
//   try {
//     console.log('getTeamStats');
    
//     // 1. Récupérer les stats de base en parallèle
//     const [userDoc, walletDoc] = await Promise.all([
//       getDoc(doc(db, 'users', userId)),
//       getDoc(doc(db, 'wallets', userId))
//     ]);
    
//     const invitationCode = userDoc.data()?.invitationCode || userId.substring(0, 8).toUpperCase();
    
//     // 2. Calculer les membres avec approche optimisée
//     const teamStats = await this.calculateTeamMembersOptimized(userId);
    
//     // 3. RÉCUPÉRER LES TRANSACTIONS RÉELLES
//     const commissionsQuery = query(
//       collection(db, 'transactions'),
//       where('userId', '==', userId), // VOUS comme bénéficiaire
//       where('type', '==', 'referral_commission')
//     );
    
//     const commissionsSnapshot = await getDocs(commissionsQuery);
//     let commissionReelle = 0;
//     let commissionsParNiveau = { niveau1: 0, niveau2: 0, niveau3: 0 };
    
//     commissionsSnapshot.docs.forEach(doc => {
//       const data = doc.data();
//       const montant = data.amount || 0;
//       commissionReelle += montant;
      
//       // Classer par niveau pour prepareCommissionLevels
//       const niveau = data.metadata?.commissionLevel || 1;
//       if (niveau === 1) commissionsParNiveau.niveau1 += montant;
//       else if (niveau === 2) commissionsParNiveau.niveau2 += montant;
//       else if (niveau === 3) commissionsParNiveau.niveau3 += montant;
//     });
    
//     // 4. Calcul théorique (pour vérification)
//     const commissionTheorique = this.calculerCommissionTheorique(teamStats);
    
//     // 5. Récupérer la valeur du wallet
//     const walletData = walletDoc.exists() ? walletDoc.data() : {};
//     const commissionWallet = walletData.stats?.referralEarnings || 0;
    
//     // 6. CHOISIR LA MEILLEURE SOURCE (priorité aux transactions réelles)
//     const commissionEarned = commissionReelle > 0 ? commissionReelle : 
//                             commissionWallet > 0 ? commissionWallet : 
//                             commissionTheorique;
    
//     const totalRevenue = commissionEarned + (walletData.stats?.totalEarned || 0);
    
//     // 7. DEBUG LOG (important pour comprendre les différences)
//     console.log('🔍 DEBUG Commission Sources:', {
//       transactionsReelles: commissionReelle,
//       walletValue: commissionWallet,
//       calculTheorique: commissionTheorique,
//       utilise: commissionEarned,
//       niveau1Investment: teamStats.level1Investment,
//       niveau2Investment: teamStats.level2Investment,
//       niveau3Investment: teamStats.level3Investment
//     });
    
//     const result = {
//       invitationCode,
//       invitationLink: `https://shopmark.fr/invite/${invitationCode}`,
//       teamMembers: {
//         level1: teamStats.level1,
//         level2: teamStats.level2,
//         level3: teamStats.level3,
//         total: teamStats.level1 + teamStats.level2 + teamStats.level3
//       },
//       totalRevenue,
//       commissionEarned, // VALEUR SYNCHRONISÉE
//       levels: this.prepareCommissionLevels(
//         teamStats.level1,
//         teamStats.level2,
//         teamStats.level3,
//         teamStats.level1Investment,
//         teamStats.level2Investment,
//         teamStats.level3Investment,
//         commissionsParNiveau // Passer les commissions réelles
//       ),
//       timestamp: Date.now()
//     };
    
//     // Mettre en cache
//     store.setTeamStats(userId, result);
    
//     console.log('getTeamStats terminé');
//     return result;
    
//   } catch (error) {
//     console.error('Erreur getTeamStats:', error);
//     throw error;
//   }
// }

//   // Nouvelle méthode optimisée
//   async calculateTeamMembersOptimized(userId) {
//     try {
//       // Niveau 1 - Direct (simple)
//       const level1Query = query(
//         collection(db, 'users'),
//         where('referrerId', '==', userId),
//         limit(100) // Limiter pour performance
//       );
      
//       const level1Snap = await getDocs(level1Query);
//       const level1Count = level1Snap.docs.length;
//       const level1Users = level1Snap.docs.map(doc => doc.id);
      
//       // Récupérer les investissements niveau 1 en BATCH
//       let level1Investment = 0;
//       if (level1Users.length > 0) {
//         level1Investment = await this.getTotalInvestmentsForUsers(level1Users ,1);
//       }
      
//       // Niveau 2 - Avec chunks pour respecter limite 'in'
//       let level2Count = 0;
//       let level2Investment = 0;
      
//       if (level1Users.length > 0) {
//         // Diviser en chunks de 30
//         const level1Chunks = this.chunkArray(level1Users, this.batchSize);
//         let level2Users = [];
        
//         // Exécuter les requêtes en parallèle
//         const level2Promises = level1Chunks.map(chunk =>
//           getDocs(query(
//             collection(db, 'users'),
//             where('referrerId', 'in', chunk)
//           ))
//         );
        
//         const level2Results = await Promise.all(level2Promises);
        
//         // Compter et collecter les IDs
//         level2Results.forEach(result => {
//           level2Count += result.docs.length;
//           level2Users.push(...result.docs.map(doc => doc.id));
//         });
        
//         // Récupérer les investissements niveau 2
//         if (level2Users.length > 0) {
//           level2Investment = await this.getTotalInvestmentsForUsers(level2Users,2);
          
//           // Niveau 3 - Même approche
//           let level3Count = 0;
//           let level3Users = []; 
//           let level3Investment = 0;
          
//           if (level2Users.length > 0) {
//             const level2Chunks = this.chunkArray(level2Users, this.batchSize);
            
//             const level3Promises = level2Chunks.map(chunk =>
//               getDocs(query(
//                 collection(db, 'users'),
//                 where('referrerId', 'in', chunk)
//               ))
//             );
            
//             const level3Results = await Promise.all(level3Promises);
            
//             level3Results.forEach(result => {
//               level3Count += result.docs.length;
//               level3Users.push(...result.docs.map(doc => doc.id));
//             });
            
//             // Note: Pour les investissements niveau 3, on pourrait les récupérer
//             // mais on limite pour performance
//           level3Investment = await this.getTotalInvestmentsForUsers(level3Users, 3);
//           }
          
//           return {
//             level1: level1Count,
//             level2: level2Count,
//             level3: level3Count,
//             level1Investment,
//             level2Investment,
//             level3Investment
//           };
//         }
//       }
      
//       return {
//         level1: level1Count,
//         level2: 0,
//         level3: 0,
//         level1Investment,
//         level2Investment: 0,
//         level3Investment: 0
//       };
      
//     } catch (error) {
//       console.error('Erreur calculateTeamMembersOptimized:', error);
//       return {
//         level1: 0, level2: 0, level3: 0,
//         level1Investment: 0, level2Investment: 0, level3Investment: 0
//       };
//     }
//   }

//   async getFirstInvestmentsOnly(userIds) {
//   if (userIds.length === 0) return 0;
  
//   try {
//     // Approche par lots plus petite pour niveau 3
//     const batchSize = 5;
//     let total = 0;
    
//     for (let i = 0; i < userIds.length; i += batchSize) {
//       const batch = userIds.slice(i, i + batchSize);
      
//       // Utiliser une seule requête avec 'in' pour chaque lot
//       const queryRef = query(
//         collection(db, 'user_levels'),
//         where('userId', 'in', batch),
//         where('isFirstInvestment', '==', true)
//       );
      
//       const snapshot = await getDocs(queryRef);
      
//       // Somme des investissements
//       snapshot.docs.forEach(doc => {
//         total += doc.data().investedAmount || 0;
//       });
//     }
    
//     return total;
//   } catch (error) {
//     console.error('Erreur getFirstInvestmentsOnly:', error);
//     return 0;
//   }
// }
//   // Récupérer les investissements totaux pour une liste d'utilisateurs
//   async getTotalInvestmentsForUsers(userIds , niveau = null) {
//     if (userIds.length === 0) return 0;
    
//     try {
//       // Utiliser une approche par lots pour éviter trop de requêtes
//       let total = 0;
//       const batchSize = 10;

//       if (niveau == 3) {
//       return await this.getFirstInvestmentsOnly(userIds);
//     }
      
//       for (let i = 0; i < userIds.length; i += batchSize) {
//         const batch = userIds.slice(i, i + batchSize);
//         const promises = batch.map(async (userId) => {
//           const userLevelsQuery = query(
//             collection(db, 'user_levels'),
//             where('userId', '==', userId),
//             where('isFirstInvestment', '==', true),
//             limit(1)
//           );
          
//           const snapshot = await getDocs(userLevelsQuery);
//           if (!snapshot.empty) {
//             return snapshot.docs[0].data().investedAmount || 0;
//           }
//           return 0;
//         });
        
//         const results = await Promise.all(promises);
//         total += results.reduce((sum, amount) => sum + amount, 0);
//       }
      
//       return total;
//     } catch (error) {
//       console.error('Erreur getTotalInvestmentsForUsers:', error);
//       return 0;
//     }
//   }

//   // ========== SERVICE POUR MES FILLEULS ==========

//   // async getFilleulsData(userId) {
//   //   const store = useTeamStore.getState();
    
//   //   // Vérifier le cache
//   //   const cached = store.getFilleuls(userId);
//   //   if (cached) {
//   //     return cached;
//   //   }
    
//   //   try {
//   //     console.time('getFilleulsData');
      
//   //     // Utiliser une approche non récursive plus efficace
//   //     const filleuls = await this.getFilleulsNonRecursive(userId, 3);
      
//   //     // Calculer les statistiques
//   //     const stats = this.calculateFilleulsStats(filleuls);
      
//   //     const result = {
//   //       filleuls,
//   //       stats,
//   //       timestamp: Date.now()
//   //     };
      
//   //     // Mettre en cache
//   //     store.setFilleuls(userId, result);
      
//   //     console.timeEnd('getFilleulsData');
//   //     return result;
      
//   //   } catch (error) {
//   //     console.error('Erreur getFilleulsData:', error);
//   //     throw error;
//   //   }
//   // }


//   async getFilleulsData(userId) {
//   const store = useTeamStore.getState();
  
//   // Vérifier le cache
//   const cached = store.getFilleuls(userId);
//   if (cached) {
//     return cached;
//   }
  
//   try {
//     console.time('getFilleulsData');
    
//     // Utiliser une approche non récursive plus efficace
//     const filleuls = await this.getFilleulsNonRecursive(userId, 3);
    
//     // MODIFICATION IMPORTANTE : Filtrer uniquement VOS transactions
//     const filleulsAvecVosCommissions = await Promise.all(
//       filleuls.map(async (filleul) => {
//         // Récupérer uniquement les transactions où VOUS êtes le bénéficiaire
//         const commissionsSnapshot = await getDocs(query(
//           collection(db, 'transactions'),
//           where('userId', '==', userId), // VOUS comme bénéficiaire
//           where('type', '==', 'referral_commission'),
//           where('metadata.referredUserId', '==', filleul.id),
//           limit(10)
//         ));
        
//         const bonusData = this.processCommissions(commissionsSnapshot);
        
//         return {
//           ...filleul,
//           bonusGagne: bonusData.total, // UNIQUEMENT VOS commissions
//           bonusDetails: bonusData.details
//         };
//       })
//     );
    
//     // Calculer les statistiques AVEC les bonnes commissions
//     const stats = this.calculateFilleulsStats(filleulsAvecVosCommissions);
    
//     const result = {
//       filleuls: filleulsAvecVosCommissions,
//       stats,
//       timestamp: Date.now()
//     };
    
//     // Mettre en cache
//     store.setFilleuls(userId, result);
    
//     console.timeEnd('getFilleulsData');
//     return result;
    
//   } catch (error) {
//     console.error('Erreur getFilleulsData:', error);
//     throw error;
//   }
// }
//   // Nouvelle approche non récursive
//   async getFilleulsNonRecursive(userId, maxDepth = 3) {
//     const allFilleuls = [];
    
//     try {
//       // Niveau 1
//       const level1 = await this.getFilleulsForLevel(userId, 1);
//       allFilleuls.push(...level1);
      
//       if (maxDepth >= 2 && level1.length > 0) {
//         // Récupérer les IDs de niveau 1
//         const level1Ids = level1.map(f => f.id);
        
//         // Niveau 2 - en parallèle par lots
//         const level2Chunks = this.chunkArray(level1Ids, this.batchSize);
//         const level2Promises = level2Chunks.map(chunk =>
//           this.getFilleulsForLevel(chunk, 2, true)
//         );
        
//         const level2Arrays = await Promise.all(level2Promises);
//         const level2 = level2Arrays.flat();
//         allFilleuls.push(...level2);
        
//         if (maxDepth >= 3 && level2.length > 0) {
//           // Niveau 3
//           const level2Ids = level2.map(f => f.id);
//           const level3Chunks = this.chunkArray(level2Ids, this.batchSize);
//           const level3Promises = level3Chunks.map(chunk =>
//             this.getFilleulsForLevel(chunk, 3, true)
//           );
          
//           const level3Arrays = await Promise.all(level3Promises);
//           const level3 = level3Arrays.flat();
//           allFilleuls.push(...level3);
//         }
//       }
      
//       return allFilleuls;
      
//     } catch (error) {
//       console.error('Erreur getFilleulsNonRecursive:', error);
//       return allFilleuls;
//     }
//   }

//   async getFilleulsForLevel(referrerIds, niveau, isArray = false) {
//     try {
//       let queryRef;
      
//       if (isArray) {
//         // Pour un tableau d'IDs (niveaux 2 et 3)
//         const chunks = this.chunkArray(referrerIds, this.batchSize);
//         const promises = chunks.map(chunk =>
//           getDocs(query(
//             collection(db, 'users'),
//             where('referrerId', 'in', chunk)
//           ))
//         );
        
//         const results = await Promise.all(promises);
//         const docs = results.flatMap(result => result.docs);
        
//         // Traiter tous les documents
//         return await this.processFilleulsBatch(docs, niveau);
//       } else {
//         // Pour un seul ID (niveau 1)
//         queryRef = query(
//           collection(db, 'users'),
//           where('referrerId', '==', referrerIds)
//         );
        
//         const snapshot = await getDocs(queryRef);
//         return await this.processFilleulsBatch(snapshot.docs, niveau);
//       }
//     } catch (error) {
//       console.error(`Erreur getFilleulsForLevel niveau ${niveau}:`, error);
//       return [];
//     }
//   }

//   async processFilleulsBatch(docs, niveau) {
//     const filleuls = [];
//     const batchSize = 5;
    
//     // Traiter par lots pour éviter trop de requêtes simultanées
//     for (let i = 0; i < docs.length; i += batchSize) {
//       const batch = docs.slice(i, i + batchSize);
//       const batchPromises = batch.map(doc => this.processFilleulDoc(doc, niveau));
//       const batchResults = await Promise.all(batchPromises);
//       filleuls.push(...batchResults.filter(Boolean));
//     }
    
//     return filleuls;
//   }

//   // async processFilleulDoc(filleulDoc, niveau) {
//   //   try {
//   //     const filleulData = filleulDoc.data();
//   //     const filleulId = filleulDoc.id;
      
//   //     // Récupérer les données en parallèle
//   //     const [userLevelsSnapshot, commissionsSnapshot] = await Promise.all([
//   //       getDocs(query(
//   //         collection(db, 'user_levels'),
//   //         where('userId', '==', filleulId),
//   //        where('isFirstInvestment', '==', true),
//   //         limit(1)
//   //       )),
//   //       getDocs(query(
//   //         collection(db, 'transactions'),
//   //         where('userId', '==', filleulData.referrerId), // Le parrain
//   //         where('type', '==', 'referral_commission'),
//   //         where('metadata.referredUserId', '==', filleulId),
//   //         limit(10)
//   //       ))
//   //     ]);
      
//   //     // Traiter l'investissement
//   //     const investissementData = this.processInvestissement(userLevelsSnapshot);
      
//   //     // Traiter les commissions
//   //     const bonusData = this.processCommissions(commissionsSnapshot);
      
//   //     return {
//   //       id: filleulId,
//   //       name: filleulData.displayName || filleulData.fullName || filleulData.phone || "Utilisateur",
//   //       phone: filleulData.phone || "Non renseigné",
//   //       email: filleulData.email || "Sans email",
//   //       inscriptionDate: filleulData.createdAt?.toDate?.() || new Date(),
//   //       montantInvesti: investissementData.montantInvesti,
//   //       niveauInvestissement: investissementData.niveauInvestissement,
//   //       commissionRate: niveau === 1 ? 3 : niveau === 2 ? 2 : 1,
//   //       bonusGagne: bonusData.total,
//   //       bonusDetails: bonusData.details,
//   //       status: investissementData.status,
//   //       niveauParrainage: niveau,
//   //       lastLogin: filleulData.lastLogin?.toDate?.() || null,
//   //       totalInvestissements: userLevelsSnapshot.size
//   //     };
      
//   //   } catch (error) {
//   //     console.error('Erreur processFilleulDoc:', error);
//   //     return null;
//   //   }
//   // }

//   // processInvestissement(snapshot) {
//   //   if (snapshot.empty) {
//   //     return {
//   //       montantInvesti: 0,
//   //       niveauInvestissement: "Non investi",
//   //       status: "inactif"
//   //     };
//   //   }
    
//   //   const latestDoc = snapshot.docs[0];
//   //   const data = latestDoc.data();
    
//   //   return {
//   //     montantInvesti: data.investedAmount || 0,
//   //     niveauInvestissement: data.levelName || "Niveau inconnu",
//   //     status: data.status === 'active' ? 'actif' : 'inactif'
//   //   };
//   // }

//   async processFilleulDoc(filleulDoc, niveau) {
//   try {
//     const filleulData = filleulDoc.data();
//     const filleulId = filleulDoc.id;
    
//     // SEULEMENT l'investissement (les commissions seront gérées dans getFilleulsData)
//     const userLevelsSnapshot = await getDocs(query(
//       collection(db, 'user_levels'),
//       where('userId', '==', filleulId),
//       where('isFirstInvestment', '==', true),
//       limit(1)
//     ));
    
//     // Traiter l'investissement
//     const investissementData = this.processInvestissement(userLevelsSnapshot);
    
//     return {
//       id: filleulId,
//       name: filleulData.displayName || filleulData.fullName || filleulData.phone || "Utilisateur",
//       phone: filleulData.phone || "Non renseigné",
//       email: filleulData.email || "Sans email",
//       inscriptionDate: filleulData.createdAt?.toDate?.() || new Date(),
//       montantInvesti: investissementData.montantInvesti,
//       niveauInvestissement: investissementData.niveauInvestissement,
//       commissionRate: niveau === 1 ? 3 : niveau === 2 ? 2 : 1,
//       bonusGagne: 0, // Sera rempli dans getFilleulsData
//       bonusDetails: [], // Sera rempli dans getFilleulsData
//       status: investissementData.status,
//       niveauParrainage: niveau,
//       lastLogin: filleulData.lastLogin?.toDate?.() || null,
//       totalInvestissements: userLevelsSnapshot.size
//     };
    
//   } catch (error) {
//     console.error('Erreur processFilleulDoc:', error);
//     return null;
//   }
// }
//   processInvestissement(snapshot) {
//   if (snapshot.empty) {
//     return {
//       montantInvesti: 0,
//       niveauInvestissement: "Non investi",
//       status: "inactif"
//     };
//   }
  
//   // Trouver le PREMIER investissement (pour la commission)
//   let premierInvestissement = null;
  
//   snapshot.docs.forEach(doc => {
//     const data = doc.data();
//     if (data.isFirstInvestment === true) {
//       premierInvestissement = data;
//     }
//   });
  
//   // Si on a trouvé un premier investissement, l'utiliser
//   if (premierInvestissement) {
//     return {
//       montantInvesti: premierInvestissement.investedAmount || 0, // PREMIER investissement
//       niveauInvestissement: premierInvestissement.levelName || "Niveau inconnu",
//       status: premierInvestissement.status === 'active' ? 'actif' : 'inactif',
//       premierInvestissementDate: premierInvestissement.startDate
//     };
//   }
  
//   // Sinon, garder l'ancienne logique (dernier investissement)
//   const latestDoc = snapshot.docs[0];
//   const data = latestDoc.data();
  
//   return {
//     montantInvesti: data.investedAmount || 0,
//     niveauInvestissement: data.levelName || "Niveau inconnu",
//     status: data.status === 'active' ? 'actif' : 'inactif'
//   };
// }
//   processCommissions(snapshot) {
//     let total = 0;
//     const details = [];
    
//     snapshot.docs.forEach(doc => {
//       const data = doc.data();
//       const montant = data.amount || 0;
//       total += montant;
//       details.push({
//         montant,
//         date: data.createdAt?.toDate?.() || new Date(),
//         niveau: data.metadata?.commissionLevel || 1
//       });
//     });
    
//     return { total, details };
//   }

//   calculateFilleulsStats(filleuls) {
//     const maintenant = new Date();
//     const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
//     const debutSemaine = new Date(maintenant);
//     debutSemaine.setDate(maintenant.getDate() - 7);
    
//     let totalInvesti = 0;
//     let actifsCount = 0;
//     let totalBonus = 0;
//     let bonusMois = 0;
//     let bonusSemaine = 0;
    
//     filleuls.forEach(filleul => {
//       totalInvesti += filleul.montantInvesti;
      
//       if (filleul.status === 'actif') {
//         actifsCount++;
//       }
      
//       totalBonus += filleul.bonusGagne;
      
//       filleul.bonusDetails?.forEach(detail => {
//         const dateBonus = detail.date;
//         if (dateBonus >= debutMois) {
//           bonusMois += detail.montant;
//         }
//         if (dateBonus >= debutSemaine) {
//           bonusSemaine += detail.montant;
//         }
//       });
//     });
    
//     return {
//       total: filleuls.length,
//       actifs: actifsCount,
//       inactifs: filleuls.length - actifsCount,
//       totalInvesti,
//       bonusMois,
//       bonusSemaine,
//       totalBonus
//     };
//   }

//   // ========== UTILS ==========

//   chunkArray(array, size) {
//     const chunks = [];
//     for (let i = 0; i < array.length; i += size) {
//       chunks.push(array.slice(i, i + size));
//     }
//     return chunks;
//   }

//   // prepareCommissionLevels(level1, level2, level3, level1Investment, level2Investment, level3Investment) {
//   //   const commissionRates = [3, 2, 1];
//   //   const levelNames = ["Menbre A", "Menbre B", "Menbre C"];
//   //   const colors = [
//   //     { gradient: "from-orange-500 to-amber-400", iconColor: "text-orange-500" },
//   //     { gradient: "from-blue-500 to-cyan-400", iconColor: "text-blue-500" },
//   //     { gradient: "from-green-500 to-emerald-400", iconColor: "text-green-500" }
//   //   ];

//   //   return [0, 1, 2].map((index) => {
//   //     const validUsers = index === 0 ? level1 : index === 1 ? level2 : index === 2 ? level3 : 0;
//   //     const totalInvestment = index === 0 ? level1Investment : 
//   //                            index === 1 ? level2Investment : 
//   //                            index === 2 ? level3Investment : 0;
      
//   //     const revenue = Math.round(totalInvestment * (commissionRates[index] / 100));
      
//   //     return {
//   //       level: levelNames[index],
//   //       commissionRate: commissionRates[index],
//   //       validUsers,
//   //       revenue,
//   //       totalInvestment,
//   //       color: colors[index].gradient,
//   //       iconColor: colors[index].iconColor,
//   //       levelNumber: index + 1
//   //     };
//   //   });
//   // }

// //   prepareCommissionLevels(level1, level2, level3, level1Investment, level2Investment, level3Investment, commissionsReels = null) {
// //   const commissionRates = [3, 2, 1];
// //   const levelNames = ["Menbre A", "Menbre B", "Menbre C"];
// //   const colors = [
// //     { gradient: "from-orange-500 to-amber-400", iconColor: "text-orange-500" },
// //     { gradient: "from-blue-500 to-cyan-400", iconColor: "text-blue-500" },
// //     { gradient: "from-green-500 to-emerald-400", iconColor: "text-green-500" }
// //   ];

// //   return [0, 1, 2].map((index) => {
// //     const validUsers = index === 0 ? level1 : index === 1 ? level2 : index === 2 ? level3 : 0;
// //     const totalInvestment = index === 0 ? level1Investment : 
// //                            index === 1 ? level2Investment : 
// //                            index === 2 ? level3Investment : 0;
    
// //     // UTILISER LES COMMISSIONS RÉELLES SI DISPONIBLES
// //     const revenue = commissionsReels 
// //       ? (index === 0 ? commissionsReels.niveau1 : 
// //          index === 1 ? commissionsReels.niveau2 : 
// //          commissionsReels.niveau3)
// //       : Math.round(totalInvestment * (commissionRates[index] / 100));
    
// //     return {
// //       level: levelNames[index],
// //       commissionRate: commissionRates[index],
// //       validUsers,
// //       revenue, // MAINTENANT C'EST LE MONTANT RÉEL
// //       totalInvestment,
// //       color: colors[index].gradient,
// //       iconColor: colors[index].iconColor,
// //       levelNumber: index + 1
// //     };
// //   });
// // }
// calculerCommissionTheorique(teamStats) {
//   // Calcul précis des commissions basé sur le premier investissement
//   const commissionNiveau1 = Math.round(teamStats.level1Investment * 0.03); // 3%
//   const commissionNiveau2 = Math.round(teamStats.level2Investment * 0.02); // 2%
//   const commissionNiveau3 = Math.round(teamStats.level3Investment * 0.01); // 1%
  
//   return commissionNiveau1 + commissionNiveau2 + commissionNiveau3;
// }

// prepareCommissionLevels(level1, level2, level3, level1Investment, level2Investment, level3Investment, commissionsReels = null) {
//   const commissionRates = [3, 2, 1];
//   const levelNames = ["Menbre A", "Menbre B", "Menbre C"];
//   const colors = [
//     { gradient: "from-orange-500 to-amber-400", iconColor: "text-orange-500" },
//     { gradient: "from-blue-500 to-cyan-400", iconColor: "text-blue-500" },
//     { gradient: "from-green-500 to-emerald-400", iconColor: "text-green-500" }
//   ];

//   return [0, 1, 2].map((index) => {
//     const validUsers = index === 0 ? level1 : index === 1 ? level2 : index === 2 ? level3 : 0;
//     const totalInvestment = index === 0 ? level1Investment : 
//                            index === 1 ? level2Investment : 
//                            index === 2 ? level3Investment : 0;
    
//     // UTILISER LES COMMISSIONS RÉELLES SI DISPONIBLES
//     const revenue = commissionsReels 
//       ? (index === 0 ? commissionsReels.niveau1 : 
//          index === 1 ? commissionsReels.niveau2 : 
//          commissionsReels.niveau3)
//       : Math.round(totalInvestment * (commissionRates[index] / 100));
    
//     return {
//       level: levelNames[index],
//       commissionRate: commissionRates[index],
//       validUsers,
//       revenue, // MONTANT RÉEL
//       totalInvestment,
//       color: colors[index].gradient,
//       iconColor: colors[index].iconColor,
//       levelNumber: index + 1
//     };
//   });
// }


// }

// export default new TeamService();


// services/teamService.js
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  limit,
  orderBy,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

class TeamService {
  constructor() {
    this.batchSize = 30;
  }

  // ========== SERVICE POUR TEAM SECTION ==========

  async getTeamStats(userId) {
    try {
      console.log('🔍 Début getTeamStats pour:', userId);
      
      // 1. Récupérer les stats de base en parallèle
      const [userDoc, walletDoc] = await Promise.all([
        getDoc(doc(db, 'users', userId)),
        getDoc(doc(db, 'wallets', userId))
      ]);
      
      const userData = userDoc.exists() ? userDoc.data() : {};
      const invitationCode = userData.invitationCode || userId.substring(0, 8).toUpperCase();
      
      // 2. Calculer les membres avec approche optimisée
      const teamStats = await this.calculateTeamMembersOptimized(userId);
      
      // 3. RÉCUPÉRER LES TRANSACTIONS RÉELLES
      const commissionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        where('type', '==', 'referral_commission')
      );
      
      const commissionsSnapshot = await getDocs(commissionsQuery);
      let commissionReelle = 0;
      let commissionsParNiveau = { niveau1: 0, niveau2: 0, niveau3: 0 };
      
      commissionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const montant = data.amount || 0;
        commissionReelle += montant;
        
        const niveau = data.metadata?.commissionLevel || 1;
        if (niveau === 1) commissionsParNiveau.niveau1 += montant;
        else if (niveau === 2) commissionsParNiveau.niveau2 += montant;
        else if (niveau === 3) commissionsParNiveau.niveau3 += montant;
      });
      
      // 4. Calcul théorique
      const commissionTheorique = this.calculerCommissionTheorique(teamStats);
      
      // 5. Récupérer la valeur du wallet
      const walletData = walletDoc.exists() ? walletDoc.data() : {};
      const commissionWallet = walletData.stats?.referralEarnings || 0;
      
      // 6. CHOISIR LA MEILLEURE SOURCE
      const commissionEarned = commissionReelle > 0 ? commissionReelle : 
                              commissionWallet > 0 ? commissionWallet : 
                              commissionTheorique;
      
      const totalRevenue = commissionEarned + (walletData.stats?.totalEarned || 0);
      
      console.log('✅ getTeamStats terminé pour:', userId);
      
      const result = {
        invitationCode,
        invitationLink: `https://shopmark.fr/invite/${invitationCode}`,
        teamMembers: {
          level1: teamStats.level1,
          level2: teamStats.level2,
          level3: teamStats.level3,
          total: teamStats.level1 + teamStats.level2 + teamStats.level3
        },
        totalRevenue,
        commissionEarned,
        levels: this.prepareCommissionLevels(
          teamStats.level1,
          teamStats.level2,
          teamStats.level3,
          teamStats.level1Investment,
          teamStats.level2Investment,
          teamStats.level3Investment,
          commissionsParNiveau
        ),
        timestamp: Date.now()
      };
      
      return result;
      
    } catch (error) {
      console.error('❌ Erreur getTeamStats:', error);
      throw error;
    }
  }

  // Nouvelle méthode optimisée
  async calculateTeamMembersOptimized(userId) {
    try {
      // Niveau 1 - Direct
      const level1Query = query(
        collection(db, 'users'),
        where('referrerId', '==', userId),
        limit(100)
      );
      
      const level1Snap = await getDocs(level1Query);
      const level1Count = level1Snap.docs.length;
      const level1Users = level1Snap.docs.map(doc => doc.id);
      
      // Récupérer les investissements niveau 1
      let level1Investment = 0;
      if (level1Users.length > 0) {
        level1Investment = await this.getTotalInvestmentsForUsers(level1Users, 1);
      }
      
      // Niveau 2
      let level2Count = 0;
      let level2Investment = 0;
      
      if (level1Users.length > 0) {
        const level1Chunks = this.chunkArray(level1Users, this.batchSize);
        let level2Users = [];
        
        const level2Promises = level1Chunks.map(chunk =>
          getDocs(query(
            collection(db, 'users'),
            where('referrerId', 'in', chunk)
          ))
        );
        
        const level2Results = await Promise.all(level2Promises);
        
        level2Results.forEach(result => {
          level2Count += result.docs.length;
          level2Users.push(...result.docs.map(doc => doc.id));
        });
        
        // Récupérer les investissements niveau 2
        if (level2Users.length > 0) {
          level2Investment = await this.getTotalInvestmentsForUsers(level2Users, 2);
          
          // Niveau 3
          let level3Count = 0;
          let level3Users = []; 
          let level3Investment = 0;
          
          if (level2Users.length > 0) {
            const level2Chunks = this.chunkArray(level2Users, this.batchSize);
            
            const level3Promises = level2Chunks.map(chunk =>
              getDocs(query(
                collection(db, 'users'),
                where('referrerId', 'in', chunk)
              ))
            );
            
            const level3Results = await Promise.all(level3Promises);
            
            level3Results.forEach(result => {
              level3Count += result.docs.length;
              level3Users.push(...result.docs.map(doc => doc.id));
            });
            
            level3Investment = await this.getTotalInvestmentsForUsers(level3Users, 3);
          }
          
          return {
            level1: level1Count,
            level2: level2Count,
            level3: level3Count,
            level1Investment,
            level2Investment,
            level3Investment
          };
        }
      }
      
      return {
        level1: level1Count,
        level2: 0,
        level3: 0,
        level1Investment,
        level2Investment: 0,
        level3Investment: 0
      };
      
    } catch (error) {
      console.error('Erreur calculateTeamMembersOptimized:', error);
      return {
        level1: 0, level2: 0, level3: 0,
        level1Investment: 0, level2Investment: 0, level3Investment: 0
      };
    }
  }

  async getFirstInvestmentsOnly(userIds) {
    if (userIds.length === 0) return 0;
    
    try {
      const batchSize = 5;
      let total = 0;
      
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        
        const queryRef = query(
          collection(db, 'user_levels'),
          where('userId', 'in', batch),
          where('isFirstInvestment', '==', true)
        );
        
        const snapshot = await getDocs(queryRef);
        
        snapshot.docs.forEach(doc => {
          total += doc.data().investedAmount || 0;
        });
      }
      
      return total;
    } catch (error) {
      console.error('Erreur getFirstInvestmentsOnly:', error);
      return 0;
    }
  }

  async getTotalInvestmentsForUsers(userIds, niveau = null) {
    if (userIds.length === 0) return 0;
    
    try {
      let total = 0;
      const batchSize = 10;

      if (niveau == 3) {
        return await this.getFirstInvestmentsOnly(userIds);
      }
      
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const promises = batch.map(async (userId) => {
          const userLevelsQuery = query(
            collection(db, 'user_levels'),
            where('userId', '==', userId),
            where('isFirstInvestment', '==', true),
            limit(1)
          );
          
          const snapshot = await getDocs(userLevelsQuery);
          if (!snapshot.empty) {
            return snapshot.docs[0].data().investedAmount || 0;
          }
          return 0;
        });
        
        const results = await Promise.all(promises);
        total += results.reduce((sum, amount) => sum + amount, 0);
      }
      
      return total;
    } catch (error) {
      console.error('Erreur getTotalInvestmentsForUsers:', error);
      return 0;
    }
  }

  // ========== SERVICE POUR MES FILLEULS ==========

  async getFilleulsData(userId) {
    try {
      console.time('getFilleulsData');
      
      const filleuls = await this.getFilleulsNonRecursive(userId, 3);
      
      const filleulsAvecVosCommissions = await Promise.all(
        filleuls.map(async (filleul) => {
          const commissionsSnapshot = await getDocs(query(
            collection(db, 'transactions'),
            where('userId', '==', userId),
            where('type', '==', 'referral_commission'),
            where('metadata.referredUserId', '==', filleul.id),
            limit(10)
          ));
          
          const bonusData = this.processCommissions(commissionsSnapshot);
          
          return {
            ...filleul,
            bonusGagne: bonusData.total,
            bonusDetails: bonusData.details
          };
        })
      );
      
      const stats = this.calculateFilleulsStats(filleulsAvecVosCommissions);
      
      const result = {
        filleuls: filleulsAvecVosCommissions,
        stats,
        timestamp: Date.now()
      };
      
      console.timeEnd('getFilleulsData');
      return result;
      
    } catch (error) {
      console.error('Erreur getFilleulsData:', error);
      throw error;
    }
  }

  async getFilleulsNonRecursive(userId, maxDepth = 3) {
    const allFilleuls = [];
    
    try {
      // Niveau 1
      const level1 = await this.getFilleulsForLevel(userId, 1);
      allFilleuls.push(...level1);
      
      if (maxDepth >= 2 && level1.length > 0) {
        const level1Ids = level1.map(f => f.id);
        
        const level2Chunks = this.chunkArray(level1Ids, this.batchSize);
        const level2Promises = level2Chunks.map(chunk =>
          this.getFilleulsForLevel(chunk, 2, true)
        );
        
        const level2Arrays = await Promise.all(level2Promises);
        const level2 = level2Arrays.flat();
        allFilleuls.push(...level2);
        
        if (maxDepth >= 3 && level2.length > 0) {
          const level2Ids = level2.map(f => f.id);
          const level3Chunks = this.chunkArray(level2Ids, this.batchSize);
          const level3Promises = level3Chunks.map(chunk =>
            this.getFilleulsForLevel(chunk, 3, true)
          );
          
          const level3Arrays = await Promise.all(level3Promises);
          const level3 = level3Arrays.flat();
          allFilleuls.push(...level3);
        }
      }
      
      return allFilleuls;
      
    } catch (error) {
      console.error('Erreur getFilleulsNonRecursive:', error);
      return allFilleuls;
    }
  }

  async getFilleulsForLevel(referrerIds, niveau, isArray = false) {
    try {
      let queryRef;
      
      if (isArray) {
        const chunks = this.chunkArray(referrerIds, this.batchSize);
        const promises = chunks.map(chunk =>
          getDocs(query(
            collection(db, 'users'),
            where('referrerId', 'in', chunk)
          ))
        );
        
        const results = await Promise.all(promises);
        const docs = results.flatMap(result => result.docs);
        
        return await this.processFilleulsBatch(docs, niveau);
      } else {
        queryRef = query(
          collection(db, 'users'),
          where('referrerId', '==', referrerIds)
        );
        
        const snapshot = await getDocs(queryRef);
        return await this.processFilleulsBatch(snapshot.docs, niveau);
      }
    } catch (error) {
      console.error(`Erreur getFilleulsForLevel niveau ${niveau}:`, error);
      return [];
    }
  }

  async processFilleulsBatch(docs, niveau) {
    const filleuls = [];
    const batchSize = 5;
    
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const batchPromises = batch.map(doc => this.processFilleulDoc(doc, niveau));
      const batchResults = await Promise.all(batchPromises);
      filleuls.push(...batchResults.filter(Boolean));
    }
    
    return filleuls;
  }

  async processFilleulDoc(filleulDoc, niveau) {
    try {
      const filleulData = filleulDoc.data();
      const filleulId = filleulDoc.id;
      
      const userLevelsSnapshot = await getDocs(query(
        collection(db, 'user_levels'),
        where('userId', '==', filleulId),
        where('isFirstInvestment', '==', true),
        limit(1)
      ));
      
      const investissementData = this.processInvestissement(userLevelsSnapshot);
      
      return {
        id: filleulId,
        name: filleulData.displayName || filleulData.fullName || filleulData.phone || "Utilisateur",
        phone: filleulData.phone || "Non renseigné",
        email: filleulData.email || "Sans email",
        inscriptionDate: filleulData.createdAt?.toDate?.() || new Date(),
        montantInvesti: investissementData.montantInvesti,
        niveauInvestissement: investissementData.niveauInvestissement,
        commissionRate: niveau === 1 ? 3 : niveau === 2 ? 2 : 1,
        bonusGagne: 0,
        bonusDetails: [],
        status: investissementData.status,
        niveauParrainage: niveau,
        lastLogin: filleulData.lastLogin?.toDate?.() || null,
        totalInvestissements: userLevelsSnapshot.size,
        premierInvestissementDate: investissementData.premierInvestissementDate
      };
      
    } catch (error) {
      console.error('Erreur processFilleulDoc:', error);
      return null;
    }
  }

  processInvestissement(snapshot) {
    if (snapshot.empty) {
      return {
        montantInvesti: 0,
        niveauInvestissement: "Non investi",
        status: "inactif"
      };
    }
    
    let premierInvestissement = null;
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.isFirstInvestment === true) {
        premierInvestissement = data;
      }
    });
    
    if (premierInvestissement) {
      return {
        montantInvesti: premierInvestissement.investedAmount || 0,
        niveauInvestissement: premierInvestissement.levelName || "Niveau inconnu",
        status: premierInvestissement.status === 'active' ? 'actif' : 'inactif',
        premierInvestissementDate: premierInvestissement.startDate
      };
    }
    
    const latestDoc = snapshot.docs[0];
    const data = latestDoc.data();
    
    return {
      montantInvesti: data.investedAmount || 0,
      niveauInvestissement: data.levelName || "Niveau inconnu",
      status: data.status === 'active' ? 'actif' : 'inactif'
    };
  }

  processCommissions(snapshot) {
    let total = 0;
    const details = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const montant = data.amount || 0;
      total += montant;
      details.push({
        montant,
        date: data.createdAt?.toDate?.() || new Date(),
        niveau: data.metadata?.commissionLevel || 1
      });
    });
    
    return { total, details };
  }

  calculateFilleulsStats(filleuls) {
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const debutSemaine = new Date(maintenant);
    debutSemaine.setDate(maintenant.getDate() - 7);
    
    let totalInvesti = 0;
    let actifsCount = 0;
    let totalBonus = 0;
    let bonusMois = 0;
    let bonusSemaine = 0;
    
    filleuls.forEach(filleul => {
      totalInvesti += filleul.montantInvesti;
      
      if (filleul.status === 'actif') {
        actifsCount++;
      }
      
      totalBonus += filleul.bonusGagne;
      
      filleul.bonusDetails?.forEach(detail => {
        const dateBonus = detail.date;
        if (dateBonus >= debutMois) {
          bonusMois += detail.montant;
        }
        if (dateBonus >= debutSemaine) {
          bonusSemaine += detail.montant;
        }
      });
    });
    
    return {
      total: filleuls.length,
      actifs: actifsCount,
      inactifs: filleuls.length - actifsCount,
      totalInvesti,
      bonusMois,
      bonusSemaine,
      totalBonus
    };
  }

  // ========== UTILS ==========

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  calculerCommissionTheorique(teamStats) {
    const commissionNiveau1 = Math.round(teamStats.level1Investment * 0.03);
    const commissionNiveau2 = Math.round(teamStats.level2Investment * 0.02);
    const commissionNiveau3 = Math.round(teamStats.level3Investment * 0.01);
    
    return commissionNiveau1 + commissionNiveau2 + commissionNiveau3;
  }

  prepareCommissionLevels(level1, level2, level3, level1Investment, level2Investment, level3Investment, commissionsReels = null) {
    const commissionRates = [3, 2, 1];
    const levelNames = ["Menbre A", "Menbre B", "Menbre C"];
    const colors = [
      { gradient: "from-orange-500 to-amber-400", iconColor: "text-orange-500" },
      { gradient: "from-blue-500 to-cyan-400", iconColor: "text-blue-500" },
      { gradient: "from-green-500 to-emerald-400", iconColor: "text-green-500" }
    ];

    return [0, 1, 2].map((index) => {
      const validUsers = index === 0 ? level1 : index === 1 ? level2 : index === 2 ? level3 : 0;
      const totalInvestment = index === 0 ? level1Investment : 
                             index === 1 ? level2Investment : 
                             index === 2 ? level3Investment : 0;
      
      const revenue = commissionsReels 
        ? (index === 0 ? commissionsReels.niveau1 : 
           index === 1 ? commissionsReels.niveau2 : 
           commissionsReels.niveau3)
        : Math.round(totalInvestment * (commissionRates[index] / 100));
      
      return {
        level: levelNames[index],
        commissionRate: commissionRates[index],
        validUsers,
        revenue,
        totalInvestment,
        color: colors[index].gradient,
        iconColor: colors[index].iconColor,
        levelNumber: index + 1
      };
    });
  }
}

export default new TeamService();