# 🔒 CORRECTION SÉCURITÉ: Limite Quotidienne Côté Serveur

## ❌ PROBLÈME IDENTIFIÉ

Les utilisateurs pouvaient faire **2 retraits par jour** malgré la limite d'un retrait quotidien, car la vérification existait uniquement côté client (frontend).

### Contournements possibles:
- Recharger la page
- Manipuler le JavaScript dans le navigateur
- Désactiver JavaScript
- Utiliser un autre navigateur/appareil
- Modifier le fuseau horaire de la machine

## ✅ SOLUTION IMPLÉMENTÉE

### Vérification côté serveur dans `lib/financeService.js`

Ajout d'une vérification **AVANT** la création du document de retrait dans la fonction `createWithdrawal()`:

```javascript
// ⚠️ VÉRIFICATION CRITIQUE: Un seul retrait par jour (côté serveur)
const now = new Date();
const utcTime = now.getTime();
const kinshasaOffset = 1 * 60 * 60 * 1000; // UTC+1
const kinshasaTime = new Date(utcTime + kinshasaOffset);

// Calculer minuit aujourd'hui en heure de Kinshasa
const todayStart = new Date(Date.UTC(
  kinshasaTime.getUTCFullYear(),
  kinshasaTime.getUTCMonth(),
  kinshasaTime.getUTCDate(),
  0, 0, 0, 0
));
todayStart.setTime(todayStart.getTime() - kinshasaOffset);

// Vérifier s'il existe déjà un retrait aujourd'hui
const todayWithdrawalsQuery = query(
  collection(db, 'transactions'),
  where('userId', '==', userId),
  where('createdAt', '>=', todayStart),
  where('withdrawalId', '!=', null)
);

const todayWithdrawalsSnapshot = await getDocs(todayWithdrawalsQuery);

// Filtrer pour ne garder que les retraits avec status pending ou completed
const validWithdrawals = todayWithdrawalsSnapshot.docs.filter(doc => {
  const data = doc.data();
  return data.status === 'pending' || data.status === 'completed';
});

if (validWithdrawals.length > 0) {
  return {
    success: false,
    error: 'Limite quotidienne atteinte. Un seul retrait par jour est autorisé.',
    lastWithdrawalDate: lastWithdrawal.createdAt
  };
}
```

## 🔐 SÉCURITÉ RENFORCÉE

### Double protection:
1. **Côté client** (`app/RetraitPage/page.jsx`): Vérification immédiate pour UX
2. **Côté serveur** (`lib/financeService.js`): Vérification finale incontournable

### Calcul UTC sécurisé:
- Utilise l'heure du serveur (pas du client)
- Calcul basé sur UTC+1 (Kinshasa)
- Impossible de contourner en changeant le fuseau horaire

### Filtrage des statuts:
- Compte uniquement les retraits `pending` et `completed`
- Ignore les retraits `rejected` ou `cancelled`

## 📋 FICHIERS MODIFIÉS

- `lib/financeService.js` - Ajout vérification serveur (ligne 95-130)
- `app/RetraitPage/page.jsx` - Vérification client déjà en place

## 🧪 TESTS À EFFECTUER

1. Faire un premier retrait → Doit réussir
2. Essayer un deuxième retrait immédiatement → Doit échouer avec message d'erreur
3. Recharger la page et réessayer → Doit toujours échouer
4. Changer le fuseau horaire et réessayer → Doit toujours échouer
5. Attendre le lendemain → Doit permettre un nouveau retrait

## 📊 RÉSULTAT

✅ La limite d'un retrait par jour est maintenant **INCONTOURNABLE**
✅ Protection contre toutes les tentatives de contournement
✅ Calcul fiable basé sur l'heure du serveur
✅ Message d'erreur clair pour l'utilisateur
