# 📚 Explication - Système de Gains Journaliers

## 🔍 Comment ça fonctionne actuellement

### Vue d'ensemble

Le système de calcul des gains journaliers a **2 niveaux de vérification** pour empêcher les paiements multiples le même jour :

1. **Vérification avant le calcul** (ligne 4291-4304)
2. **Vérification dans la transaction** (ligne 4407-4416)

---

## 🔒 Niveau 1 : Vérification AVANT le calcul

**Localisation:** Ligne 4291-4304 dans `calculateDailyGains`

```javascript
// Pour chaque investissement actif
for (const investment of activeInvestments) {
  // Récupérer le wallet
  const walletRef = doc(db, 'wallets', investment.userId);
  const walletSnap = await getDoc(walletRef);
  const walletData = walletSnap.data();
  
  // 🔒 VERROU 1 : Récupérer la date du dernier gain
  const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
  
  // 🔒 VERROU 1 : Vérifier si déjà payé aujourd'hui
  const alreadyProcessedToday = lastGainDate && 
    lastGainDate.getDate() === today.getDate() &&
    lastGainDate.getMonth() === today.getMonth() &&
    lastGainDate.getFullYear() === today.getFullYear();
  
  // 🔒 VERROU 1 : Si déjà payé, ignorer cet investissement
  if (alreadyProcessedToday) {
    skippedUsers.push({
      userId: investment.userId,
      reason: 'Déjà payé aujourd\'hui',
      lastGainDate,
      investment
    });
    continue; // Passer au suivant
  }
  
  // Si pas encore payé, ajouter à la liste des éligibles
  eligibleInvestments.push(investment);
}
```

**Rôle:** Filtrer les investissements pour ne garder que ceux qui n'ont PAS été payés aujourd'hui.

---

## 🔒 Niveau 2 : Vérification DANS la transaction

**Localisation:** Ligne 4407-4416 dans `runTransaction`

```javascript
// Pour chaque investissement éligible
await runTransaction(db, async (transaction) => {
  // Récupérer le wallet dans la transaction
  const walletRef = doc(db, 'wallets', investment.userId);
  const walletSnap = await transaction.get(walletRef);
  const walletData = walletSnap.data();
  
  // 🔒 VERROU 2 : Vérifier À NOUVEAU la date (sécurité)
  const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
  const alreadyProcessed = lastGainDate && 
    lastGainDate.getDate() === today.getDate() &&
    lastGainDate.getMonth() === today.getMonth() &&
    lastGainDate.getFullYear() === today.getFullYear();
  
  // 🔒 VERROU 2 : Si déjà payé, annuler cette transaction
  if (alreadyProcessed) {
    throw new Error('Déjà payé aujourd\'hui');
  }
  
  // Mettre à jour le wallet
  transaction.update(walletRef, {
    'balances.wallet.amount': increment(dailyGain),
    'stats.totalEarned': increment(dailyGain),
    'stats.totalDailyGains': increment(dailyGain),
    'stats.lastDailyGainAt': serverTimestamp(), // 🔒 Enregistrer la date
    updatedAt: serverTimestamp()
  });
});
```

**Rôle:** Double vérification pour éviter les paiements multiples en cas de calculs simultanés.

---

## 🗄️ Stockage dans Firebase

### Collection `wallets/{userId}`

```javascript
{
  balances: {
    wallet: {
      amount: 150000,
      lastUpdated: Timestamp
    }
  },
  stats: {
    totalEarned: 500000,
    totalDailyGains: 300000,
    lastDailyGainAt: Timestamp("2025-02-12 10:30:00") // 🔒 DATE DU DERNIER GAIN
  }
}
```

**Champ clé:** `stats.lastDailyGainAt` - C'est ce champ qui sert de verrou.

---

## 🔓 Comment enlever le verrou "une fois par jour"

### Option 1 : Enlever complètement les vérifications (Simple)

**Avantage:** Permet de calculer autant de fois qu'on veut  
**Inconvénient:** Risque de payer plusieurs fois par erreur

#### Étape 1 : Commenter le Verrou 1 (ligne 4291-4304)

```javascript
// Pour chaque investissement actif
for (const investment of activeInvestments) {
  const walletRef = doc(db, 'wallets', investment.userId);
  const walletSnap = await getDoc(walletRef);
  
  if (!walletSnap.exists()) {
    skippedUsers.push({
      userId: investment.userId,
      reason: 'Portefeuille non trouvé',
      investment
    });
    continue;
  }
  
  // ❌ COMMENTÉ : Vérification "déjà payé aujourd'hui"
  /*
  const walletData = walletSnap.data();
  const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
  
  const alreadyProcessedToday = lastGainDate && 
    lastGainDate.getDate() === today.getDate() &&
    lastGainDate.getMonth() === today.getMonth() &&
    lastGainDate.getFullYear() === today.getFullYear();
  
  if (alreadyProcessedToday) {
    skippedUsers.push({
      userId: investment.userId,
      reason: 'Déjà payé aujourd\'hui',
      lastGainDate,
      investment
    });
    continue;
  }
  */
  
  // Vérifier si l'investissement est toujours valide
  const endDate = investment.scheduledEndDate?.toDate?.();
  if (endDate && endDate < today) {
    skippedUsers.push({
      userId: investment.userId,
      reason: 'Investissement terminé',
      endDate,
      investment
    });
    continue;
  }
  
  // ✅ Tous les investissements actifs sont éligibles
  eligibleInvestments.push(investment);
}
```

#### Étape 2 : Commenter le Verrou 2 (ligne 4407-4416)

```javascript
await runTransaction(db, async (transaction) => {
  const walletRef = doc(db, 'wallets', investment.userId);
  const walletSnap = await transaction.get(walletRef);
  
  if (!walletSnap.exists()) {
    throw new Error('Portefeuille non trouvé');
  }

  const walletData = walletSnap.data();
  
  // ❌ COMMENTÉ : Double vérification
  /*
  const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
  const alreadyProcessed = lastGainDate && 
    lastGainDate.getDate() === today.getDate() &&
    lastGainDate.getMonth() === today.getMonth() &&
    lastGainDate.getFullYear() === today.getFullYear();
  
  if (alreadyProcessed) {
    throw new Error('Déjà payé aujourd\'hui');
  }
  */

  // ✅ Mettre à jour le wallet (toujours enregistrer la date)
  transaction.update(walletRef, {
    'balances.wallet.amount': increment(dailyGain),
    'balances.wallet.lastUpdated': serverTimestamp(),
    'stats.totalEarned': increment(dailyGain),
    'stats.totalDailyGains': increment(dailyGain),
    'stats.lastDailyGainAt': serverTimestamp(), // Garder pour l'historique
    updatedAt: serverTimestamp(),
    version: increment(1)
  });
});
```

---

### Option 2 : Ajouter un compteur de calculs par jour (Recommandé)

**Avantage:** Permet plusieurs calculs mais garde une trace  
**Inconvénient:** Plus complexe

#### Modifier le stockage Firebase

```javascript
{
  stats: {
    lastDailyGainAt: Timestamp,
    dailyGainCount: 3, // 🆕 Nombre de calculs aujourd'hui
    dailyGainHistory: [ // 🆕 Historique des calculs
      {
        timestamp: Timestamp,
        amount: 5000,
        adminId: "admin123"
      }
    ]
  }
}
```

#### Modifier le code

```javascript
// Verrou 1 : Enlever complètement
// (Tous les investissements actifs sont éligibles)

// Verrou 2 : Remplacer par un compteur
await runTransaction(db, async (transaction) => {
  const walletRef = doc(db, 'wallets', investment.userId);
  const walletSnap = await transaction.get(walletRef);
  const walletData = walletSnap.data();
  
  // ✅ Incrémenter le compteur au lieu de bloquer
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
  const isSameDay = lastGainDate && 
    lastGainDate.getDate() === today.getDate() &&
    lastGainDate.getMonth() === today.getMonth() &&
    lastGainDate.getFullYear() === today.getFullYear();
  
  const currentCount = isSameDay ? (walletData.stats?.dailyGainCount || 0) : 0;
  
  transaction.update(walletRef, {
    'balances.wallet.amount': increment(dailyGain),
    'stats.totalEarned': increment(dailyGain),
    'stats.totalDailyGains': increment(dailyGain),
    'stats.lastDailyGainAt': serverTimestamp(),
    'stats.dailyGainCount': currentCount + 1, // 🆕 Incrémenter
    'stats.dailyGainHistory': arrayUnion({ // 🆕 Ajouter à l'historique
      timestamp: serverTimestamp(),
      amount: dailyGain,
      adminId: currentAdmin.uid,
      adminName: currentAdmin.displayName || currentAdmin.email
    }),
    updatedAt: serverTimestamp()
  });
});
```

---

### Option 3 : Ajouter une limite de calculs par jour (Sécurisé)

**Avantage:** Permet plusieurs calculs mais avec une limite (ex: 3 fois max)  
**Inconvénient:** Nécessite plus de code

```javascript
// Verrou 1 : Vérifier le compteur au lieu de la date
const walletData = walletSnap.data();
const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
const today = new Date();
today.setHours(0, 0, 0, 0);

const isSameDay = lastGainDate && 
  lastGainDate.getDate() === today.getDate() &&
  lastGainDate.getMonth() === today.getMonth() &&
  lastGainDate.getFullYear() === today.getFullYear();

const currentCount = isSameDay ? (walletData.stats?.dailyGainCount || 0) : 0;
const MAX_CALCULATIONS_PER_DAY = 3; // 🆕 Limite

if (currentCount >= MAX_CALCULATIONS_PER_DAY) {
  skippedUsers.push({
    userId: investment.userId,
    reason: `Limite atteinte (${currentCount}/${MAX_CALCULATIONS_PER_DAY} calculs aujourd'hui)`,
    investment
  });
  continue;
}

eligibleInvestments.push(investment);
```

---

## 📊 Comparaison des Options

| Option | Calculs illimités | Sécurité | Historique | Complexité |
|--------|-------------------|----------|------------|------------|
| **Option 1** (Enlever verrous) | ✅ Oui | ❌ Faible | ❌ Non | ⭐ Simple |
| **Option 2** (Compteur) | ✅ Oui | ⚠️ Moyenne | ✅ Oui | ⭐⭐ Moyenne |
| **Option 3** (Limite) | ⚠️ Limité | ✅ Élevée | ✅ Oui | ⭐⭐⭐ Complexe |

---

## 🎯 Recommandation

**Pour ton cas (calculer plusieurs fois par jour):**

Je recommande **Option 1** (Simple) si :
- Tu es le seul admin
- Tu fais attention à ne pas cliquer plusieurs fois par erreur
- Tu veux la solution la plus simple

Je recommande **Option 2** (Compteur) si :
- Tu veux garder un historique
- Plusieurs admins peuvent calculer
- Tu veux savoir combien de fois les gains ont été calculés

---

## 🔧 Code à modifier

### Pour Option 1 (Simple - Recommandé pour toi)

**Fichier:** `app/dashboard/utilisateurs/page.jsx`

**Modification 1:** Ligne 4291-4304
```javascript
// AVANT
const alreadyProcessedToday = lastGainDate && ...
if (alreadyProcessedToday) {
  skippedUsers.push(...);
  continue;
}

// APRÈS
// Commenté - Permet de calculer plusieurs fois par jour
/*
const alreadyProcessedToday = lastGainDate && ...
if (alreadyProcessedToday) {
  skippedUsers.push(...);
  continue;
}
*/
```

**Modification 2:** Ligne 4407-4416
```javascript
// AVANT
const alreadyProcessed = lastGainDate && ...
if (alreadyProcessed) {
  throw new Error('Déjà payé aujourd\'hui');
}

// APRÈS
// Commenté - Permet de calculer plusieurs fois par jour
/*
const alreadyProcessed = lastGainDate && ...
if (alreadyProcessed) {
  throw new Error('Déjà payé aujourd\'hui');
}
*/
```

---

## ⚠️ Avertissements

### Risques de l'Option 1

1. **Paiement multiple par erreur** - Si tu cliques 2 fois, les gains seront payés 2 fois
2. **Pas d'historique** - Tu ne sauras pas combien de fois les gains ont été calculés
3. **Confusion** - Les utilisateurs peuvent recevoir plusieurs gains le même jour

### Solutions

1. **Ajouter une confirmation renforcée**
```javascript
if (!confirm(`⚠️ ATTENTION !\n\nVous avez déjà calculé les gains aujourd'hui.\nVoulez-vous vraiment recalculer ?\n\nCela va AJOUTER les gains une 2ème fois !`)) {
  return;
}
```

2. **Afficher un avertissement**
```javascript
alert(`ℹ️ Les gains ont déjà été calculés ${currentCount} fois aujourd'hui.\nVous pouvez continuer mais soyez prudent.`);
```

---

**Veux-tu que j'applique l'Option 1 (Simple) pour enlever le verrou ?**

---

**Auteur:** Kiro AI  
**Date:** 2025  
**Version:** 1.0
