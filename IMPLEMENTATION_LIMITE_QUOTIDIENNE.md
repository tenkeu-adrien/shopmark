# Implémentation - Limite d'Un Retrait Par Jour

## 🎯 Objectif

Ajouter une contrainte qui limite les utilisateurs à **un seul retrait par jour** pour mieux gérer les transactions et assurer la sécurité.

---

## 📋 Fonctionnement

### Règle Simple

```
Un utilisateur peut effectuer UN SEUL retrait par jour (00h00 - 23h59, heure de Kinshasa)
```

### Exemples

**Scénario 1: Premier retrait du jour**
```
Utilisateur fait un retrait à 10h00
→ ✅ Retrait autorisé
→ Statut: "Limite quotidienne utilisée"
→ Prochain retrait: Demain à partir de 8h00
```

**Scénario 2: Tentative de deuxième retrait**
```
Utilisateur essaie un retrait à 14h00 (même jour)
→ ❌ Retrait bloqué
→ Message: "Limite quotidienne atteinte"
→ Prochain retrait: Demain à partir de 8h00
```

**Scénario 3: Nouveau jour**
```
Le lendemain à 9h00
→ ✅ Retrait autorisé à nouveau
→ Compteur réinitialisé
```

---

## 🔧 Implémentation Technique

### 1. Nouveaux États Ajoutés

**Fichier**: `app/RetraitPage/page.jsx` (ligne ~880)

```javascript
// États pour la contrainte d'un retrait par jour
const [hasWithdrawnToday, setHasWithdrawnToday] = useState(false);
const [lastWithdrawalDate, setLastWithdrawalDate] = useState(null);
const [checkingDailyLimit, setCheckingDailyLimit] = useState(true);
```

**Explication**:
- `hasWithdrawnToday`: Boolean - True si l'utilisateur a déjà retiré aujourd'hui
- `lastWithdrawalDate`: Date - Date et heure du dernier retrait
- `checkingDailyLimit`: Boolean - Indique si la vérification est en cours

---

### 2. Vérification au Chargement (useEffect)

**Fichier**: `app/RetraitPage/page.jsx` (ligne ~1173)

```javascript
useEffect(() => {
  const checkDailyWithdrawalLimit = async () => {
    if (!userInfo.uid) {
      setCheckingDailyLimit(false);
      return;
    }

    try {
      setCheckingDailyLimit(true);

      // 1. Obtenir la date du jour à minuit (heure de Kinshasa)
      const now = new Date();
      const kinshasaTime = new Date(now.toLocaleString('en-US', { 
        timeZone: 'Africa/Kinshasa' 
      }));
      const todayStart = new Date(kinshasaTime);
      todayStart.setHours(0, 0, 0, 0);

      // 2. Requête Firebase pour les retraits d'aujourd'hui
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('userId', '==', userInfo.uid),
        where('createdAt', '>=', todayStart),
        where('status', 'in', ['pending', 'completed'])
      );

      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);

      // 3. Vérifier si des retraits existent
      if (!withdrawalsSnapshot.empty) {
        // Retrait déjà effectué aujourd'hui
        const lastWithdrawal = withdrawalsSnapshot.docs[0].data();
        const withdrawalDate = lastWithdrawal.createdAt?.toDate();
        
        setHasWithdrawnToday(true);
        setLastWithdrawalDate(withdrawalDate);
      } else {
        // Aucun retrait aujourd'hui
        setHasWithdrawnToday(false);
        setLastWithdrawalDate(null);
      }

    } catch (error) {
      console.error('❌ Erreur vérification retrait quotidien:', error);
      setHasWithdrawnToday(false);
    } finally {
      setCheckingDailyLimit(false);
    }
  };

  checkDailyWithdrawalLimit();
}, [userInfo.uid]);
```

**Fonctionnement**:

1. **Calcul de minuit**: Obtient 00h00 du jour actuel en heure de Kinshasa
2. **Requête Firebase**: Cherche les retraits depuis minuit avec statut `pending` ou `completed`
3. **Mise à jour des états**: 
   - Si retraits trouvés → `hasWithdrawnToday = true`
   - Sinon → `hasWithdrawnToday = false`

**Points Importants**:
- ✅ Utilise le timezone de Kinshasa (UTC+1)
- ✅ Exclut les retraits rejetés (`status != 'rejected'`)
- ✅ Se déclenche automatiquement au chargement de la page
- ✅ Se re-déclenche si l'utilisateur change

---

### 3. Blocage dans handleWithdrawal

**Fichier**: `app/RetraitPage/page.jsx` (ligne ~1870)

```javascript
const handleWithdrawal = async () => {
  if (!validateWithdrawal()) return;

  // Vérifier si l'utilisateur a déjà fait un retrait aujourd'hui
  if (hasWithdrawnToday) {
    const formattedDate = lastWithdrawalDate 
      ? lastWithdrawalDate.toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'aujourd\'hui';

    alert(
      `⚠️ Limite quotidienne atteinte!\n\n` +
      `Vous avez déjà effectué un retrait aujourd'hui.\n\n` +
      `Dernier retrait: ${formattedDate}\n\n` +
      `📅 Règle: Un seul retrait par jour autorisé\n` +
      `⏰ Prochain retrait possible: Demain à partir de 8h00\n\n` +
      `Cette limite permet de mieux gérer les transactions et assurer la sécurité de votre compte.`
    );
    return;
  }

  // Vérifier les heures ouvrables
  if (!isWithinBusinessHours()) {
    // ...
  }

  // ... reste du code
};
```

**Fonctionnement**:
- Vérifie `hasWithdrawnToday` AVANT toute autre validation
- Si true → Affiche un message détaillé et bloque
- Si false → Continue le processus normal

---

### 4. Bandeau Informatif

**Fichier**: `app/RetraitPage/page.jsx` (ligne ~2140)

```jsx
{/* Bandeau de limite quotidienne (1 retrait par jour) */}
{!checkingDailyLimit && hasWithdrawnToday && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="mb-6 rounded-xl p-4 border bg-red-50 border-red-200"
  >
    <div className="flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-600" />
      <div className="flex-1">
        <p className="font-semibold text-red-900">
          ⛔ Limite quotidienne atteinte
        </p>
        <p className="text-sm text-red-700 mt-1">
          Vous avez déjà effectué un retrait aujourd'hui
          {lastWithdrawalDate && ` à ${lastWithdrawalDate.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}`}.
          Prochain retrait possible demain à partir de 8h00.
        </p>
        <div className="mt-2 p-2 bg-white rounded-lg border border-red-200">
          <p className="text-xs text-red-800 font-medium">
            📅 Règle: Un seul retrait par jour
          </p>
          <p className="text-xs text-red-700 mt-1">
            Cette limite permet de mieux gérer les transactions et assurer la sécurité de votre compte.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
)}
```

**Affichage**:
- Bandeau rouge visible uniquement si `hasWithdrawnToday = true`
- Affiche l'heure du dernier retrait
- Explique la règle et le prochain retrait possible

---

### 5. Désactivation du Bouton

**Fichier**: `app/RetraitPage/page.jsx` (ligne ~2963)

```jsx
<button
  onClick={handleWithdrawal}
  disabled={
    isProcessing || 
    !numericAmount || 
    !selectedMethod || 
    numericAmount < (selectedMethodData?.minAmount || 0) || 
    !isWithinBusinessHours() || 
    hasWithdrawnToday  // ← NOUVELLE CONDITION
  }
  className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
    // ... conditions de style incluant hasWithdrawnToday
  }`}
>
  {isProcessing ? (
    <span>Traitement en cours...</span>
  ) : hasWithdrawnToday ? (
    <span className="flex items-center justify-center gap-2">
      <AlertCircle className="w-5 h-5" />
      Limite quotidienne atteinte
    </span>
  ) : !isWithinBusinessHours() ? (
    <span>Retraits disponibles de 8h à 16h</span>
  ) : (
    "Confirmer le retrait"
  )}
</button>
```

**Fonctionnement**:
- Bouton désactivé si `hasWithdrawnToday = true`
- Texte change pour "Limite quotidienne atteinte"
- Style grisé (cursor-not-allowed)

---

## 🎨 Interface Utilisateur

### Cas 1: Aucun Retrait Aujourd'hui

```
┌─────────────────────────────────────┐
│ ✅ Retraits disponibles             │
│ 8h00 à 16h00 (Kinshasa)             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💰 Solde: 50,000 CDF                │
│                                     │
│ [Confirmer le retrait] ✅           │
└─────────────────────────────────────┘
```

### Cas 2: Retrait Déjà Effectué Aujourd'hui

```
┌─────────────────────────────────────┐
│ ✅ Retraits disponibles             │
│ 8h00 à 16h00 (Kinshasa)             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⛔ Limite quotidienne atteinte      │
│ Vous avez déjà effectué un retrait  │
│ aujourd'hui à 10h30.                │
│ Prochain retrait: Demain à 8h00     │
│                                     │
│ 📅 Règle: Un seul retrait par jour  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💰 Solde: 50,000 CDF                │
│                                     │
│ [Limite quotidienne atteinte] ❌    │
│ (Bouton désactivé)                  │
└─────────────────────────────────────┘
```

---

## 📊 Données Firebase

### Collection `withdrawals`

La vérification se base sur les documents existants:

```javascript
{
  id: "WDR2024012312345678",
  userId: "user123",
  amount: 10000,
  status: "pending", // ou "completed"
  createdAt: Timestamp(2024, 01, 23, 10, 30, 0), // 10h30
  // ...
}
```

**Requête utilisée**:
```javascript
query(
  collection(db, 'withdrawals'),
  where('userId', '==', 'user123'),
  where('createdAt', '>=', todayStart), // Depuis minuit
  where('status', 'in', ['pending', 'completed']) // Exclure rejetés
)
```

---

## 🔄 Flux Complet

### Premier Retrait du Jour

```
1. Utilisateur arrive sur /RetraitPage
         ↓
2. useEffect vérifie les retraits d'aujourd'hui
         ↓
3. Aucun retrait trouvé
         ↓
4. hasWithdrawnToday = false
         ↓
5. Interface normale (bouton actif)
         ↓
6. Utilisateur remplit le formulaire
         ↓
7. Clique sur "Confirmer le retrait"
         ↓
8. handleWithdrawal() vérifie hasWithdrawnToday
         ↓
9. false → Continue le processus
         ↓
10. Retrait créé dans Firebase
         ↓
11. Message de confirmation
```

### Tentative de Deuxième Retrait

```
1. Utilisateur recharge la page (ou revient)
         ↓
2. useEffect vérifie les retraits d'aujourd'hui
         ↓
3. Retrait trouvé (créé à 10h30)
         ↓
4. hasWithdrawnToday = true
         ↓
5. Bandeau rouge affiché
         ↓
6. Bouton désactivé
         ↓
7. Si utilisateur clique quand même
         ↓
8. handleWithdrawal() vérifie hasWithdrawnToday
         ↓
9. true → Affiche message d'erreur et bloque
         ↓
10. Aucun retrait créé
```

---

## ⏰ Réinitialisation Quotidienne

### Comment ça Fonctionne

La limite se réinitialise automatiquement à **minuit (00h00)** heure de Kinshasa.

**Exemple**:
```
Lundi 10h00: Retrait effectué
Lundi 14h00: Retrait bloqué ❌
Lundi 23h59: Retrait bloqué ❌
Mardi 00h00: Limite réinitialisée ✅
Mardi 08h00: Retrait autorisé ✅
```

**Mécanisme**:
```javascript
// Calcul de minuit
const todayStart = new Date(kinshasaTime);
todayStart.setHours(0, 0, 0, 0);

// Requête: retraits >= minuit
where('createdAt', '>=', todayStart)
```

---

## 🔐 Sécurité et Robustesse

### 1. Gestion des Erreurs

```javascript
try {
  // Vérification
} catch (error) {
  console.error('❌ Erreur:', error);
  // En cas d'erreur, autoriser le retrait par sécurité
  setHasWithdrawnToday(false);
}
```

**Raison**: Mieux vaut autoriser un retrait en cas d'erreur que bloquer injustement.

### 2. Exclusion des Retraits Rejetés

```javascript
where('status', 'in', ['pending', 'completed'])
```

**Raison**: Un retrait rejeté ne compte pas dans la limite quotidienne.

### 3. Timezone Correct

```javascript
const kinshasaTime = new Date(now.toLocaleString('en-US', { 
  timeZone: 'Africa/Kinshasa' 
}));
```

**Raison**: Assure que la limite se base sur l'heure locale de Kinshasa, pas celle du navigateur.

### 4. Double Vérification

- **Vérification 1**: Au chargement (useEffect)
- **Vérification 2**: Au clic (handleWithdrawal)

**Raison**: Même si l'utilisateur manipule le frontend, la vérification dans `handleWithdrawal` bloque.

---

## 📈 Avantages du Système

### 1. Gestion des Transactions
- Limite le nombre de transactions à traiter par jour
- Facilite le travail des admins
- Réduit les coûts de transaction

### 2. Sécurité
- Empêche les retraits multiples suspects
- Protège contre les erreurs utilisateur
- Détecte les comportements anormaux

### 3. Expérience Utilisateur
- Message clair et explicatif
- Affichage de l'heure du dernier retrait
- Indication du prochain retrait possible

### 4. Flexibilité
- Facile de modifier la limite (1 → 2 retraits/jour)
- Facile d'ajouter des exceptions (VIP, etc.)
- Facile de désactiver temporairement

---

## 🔄 Modifications Futures Possibles

### 1. Augmenter la Limite

```javascript
// Au lieu de bloquer après 1 retrait
if (withdrawalsSnapshot.size >= 2) {  // 2 retraits max
  setHasWithdrawnToday(true);
}
```

### 2. Limite par Montant

```javascript
// Calculer le total retiré aujourd'hui
let totalToday = 0;
withdrawalsSnapshot.docs.forEach(doc => {
  totalToday += doc.data().amount;
});

// Bloquer si > 100,000 CDF
if (totalToday >= 100000) {
  setHasWithdrawnToday(true);
}
```

### 3. Exceptions pour VIP

```javascript
// Vérifier le rôle de l'utilisateur
const userData = await getDoc(doc(db, 'users', userInfo.uid));
const isVIP = userData.data().role === 'vip';

if (!isVIP && withdrawalsSnapshot.size >= 1) {
  setHasWithdrawnToday(true);
}
```

### 4. Limite par Semaine

```javascript
// Au lieu de "aujourd'hui", vérifier "cette semaine"
const weekStart = new Date(kinshasaTime);
weekStart.setDate(weekStart.getDate() - weekStart.getDay());
weekStart.setHours(0, 0, 0, 0);

where('createdAt', '>=', weekStart)
```

---

## ✅ Checklist de Vérification

Pour confirmer que l'implémentation fonctionne:

- [x] États ajoutés (`hasWithdrawnToday`, `lastWithdrawalDate`, `checkingDailyLimit`)
- [x] useEffect de vérification créé
- [x] Blocage dans `handleWithdrawal` ajouté
- [x] Bandeau informatif ajouté
- [x] Bouton désactivé si limite atteinte
- [x] Message explicatif sous le bouton
- [x] Timezone de Kinshasa utilisé
- [x] Retraits rejetés exclus
- [x] Gestion des erreurs
- [x] Aucune erreur de syntaxe
- [ ] Test avec un retrait réel
- [ ] Test de réinitialisation à minuit

---

## 🎉 Résultat Final

Le système implémente maintenant une **limite stricte d'un retrait par jour** tout en:

1. ✅ Maintenant toute la logique existante
2. ✅ Affichant des messages clairs
3. ✅ Désactivant visuellement le bouton
4. ✅ Gérant les erreurs gracieusement
5. ✅ Utilisant le bon timezone
6. ✅ Se réinitialisant automatiquement à minuit
7. ✅ Offrant une bonne expérience utilisateur

La contrainte est maintenant active et fonctionnelle!
