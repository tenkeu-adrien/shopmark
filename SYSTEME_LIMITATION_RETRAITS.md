# Système de Limitation des Retraits par Niveau

## 📋 Vue d'Ensemble

Un système de limitation des retraits a été implémenté pour encourager le parrainage. Les utilisateurs peuvent retirer un pourcentage de leur solde basé sur:
1. **Leur niveau d'investissement** (LV1 à LV10)
2. **Leur nombre de parrainages directs de niveaux différents**

## 🎯 Règles de Limitation

### Tableau des Limites par Niveau

| Niveau | Sans Parrainage | Avec 3 Parrainages Différents |
|--------|----------------|-------------------------------|
| LV1 | 50% max | 100% |
| LV2 | 50% max | 100% |
| LV3 | 50% max | 100% |
| LV4 | 50% max | 100% |
| LV5 | 50% max | 100% |
| LV6 | 40% max | 100% |
| LV7 | 30% max | 100% |
| LV8 | 30% max | 100% |
| LV9 | 50% max | 100% |
| LV10 | 50% max | 100% |

### Condition de Déblocage 100%

Pour retirer **100% du solde**, l'utilisateur doit avoir:
- ✅ **3 parrainages directs** (filleuls de niveau 1)
- ✅ De **niveaux d'investissement différents** (ex: 1 LV2, 1 LV3, 1 LV5)

## 💡 Exemples Concrets

### Exemple 1: Utilisateur LV3 sans parrainage
```
Solde: 10,000 CDF
Niveau: LV3
Parrainages: 0
Limite: 50%
Peut retirer: 5,000 CDF maximum
```

### Exemple 2: Utilisateur LV3 avec 2 parrainages
```
Solde: 10,000 CDF
Niveau: LV3
Parrainages: 2 (LV1, LV2)
Limite: 50% (besoin de 3 parrainages)
Peut retirer: 5,000 CDF maximum
```

### Exemple 3: Utilisateur LV3 avec 3 parrainages différents
```
Solde: 10,000 CDF
Niveau: LV3
Parrainages: 3 (LV1, LV2, LV4)
Limite: 100% ✅
Peut retirer: 10,000 CDF (tout)
```

### Exemple 4: Utilisateur LV7 sans parrainage
```
Solde: 20,000 CDF
Niveau: LV7
Parrainages: 0
Limite: 30%
Peut retirer: 6,000 CDF maximum
```

### Exemple 5: Utilisateur LV7 avec 3 parrainages différents
```
Solde: 20,000 CDF
Niveau: LV7
Parrainages: 3 (LV2, LV5, LV8)
Limite: 100% ✅
Peut retirer: 20,000 CDF (tout)
```

## 🔧 Implémentation Technique

### Fichier Modifié
`app/RetraitPage/page.jsx`

### Nouveaux États Ajoutés

```javascript
const [userLevel, setUserLevel] = useState(null); // LV1, LV2, etc.
const [directReferrals, setDirectReferrals] = useState([]); // Liste des filleuls directs
const [withdrawalLimit, setWithdrawalLimit] = useState(1.0); // Pourcentage autorisé
const [withdrawalLimitLoading, setWithdrawalLimitLoading] = useState(true);
```

### Fonctions Principales

#### 1. `hasThreeDifferentLevelReferrals(referrals)`
Vérifie si l'utilisateur a 3 parrainages de niveaux différents.

```javascript
const hasThreeDifferentLevelReferrals = (referrals) => {
  if (!referrals || referrals.length < 3) return false;
  const uniqueLevels = new Set(referrals.map(ref => ref.level).filter(Boolean));
  return uniqueLevels.size >= 3;
};
```

#### 2. `calculateWithdrawalLimit(level, referrals)`
Calcule la limite de retrait selon le niveau et les parrainages.

```javascript
const calculateWithdrawalLimit = (level, referrals) => {
  if (hasThreeDifferentLevelReferrals(referrals)) {
    return 1.0; // 100%
  }
  
  const limits = {
    'LV1': 0.50, 'LV2': 0.50, 'LV3': 0.50,
    'LV4': 0.50, 'LV5': 0.50, 'LV6': 0.40,
    'LV7': 0.30, 'LV8': 0.30, 'LV9': 0.50, 'LV10': 0.50
  };
  
  return limits[level] || 0.50;
};
```

#### 3. `useEffect` - Chargement des Données
Charge le niveau de l'utilisateur et ses parrainages depuis Firebase.

```javascript
useEffect(() => {
  const loadUserLevelAndReferrals = async () => {
    // 1. Récupérer le niveau d'investissement actif
    const userLevelsQuery = query(
      collection(db, 'user_levels'),
      where('userId', '==', userInfo.uid),
      where('status', '==', 'active')
    );
    
    // 2. Récupérer les parrainages directs
    const usersQuery = query(
      collection(db, 'users'),
      where('referredBy', '==', userInfo.uid)
    );
    
    // 3. Pour chaque filleul, récupérer son niveau
    // 4. Calculer la limite
    // 5. Mettre à jour les états
  };
  
  loadUserLevelAndReferrals();
}, [userInfo.uid]);
```

#### 4. Validation dans `validateWithdrawal()`
Vérifie que le montant ne dépasse pas la limite.

```javascript
const maxAllowedAmount = Math.floor(accountBalance * withdrawalLimit);
if (numericAmount > maxAllowedAmount) {
  alert(`Limite dépassée! Maximum: ${formatAmount(maxAllowedAmount)} CDF`);
  return false;
}
```

#### 5. Modification de `handleMaxAmount()`
Le bouton "Retirer tout" respecte maintenant la limite.

```javascript
const handleMaxAmount = () => {
  const maxByLimit = Math.floor(accountBalance * withdrawalLimit);
  const maxAllowed = Math.min(
    maxByLimit,
    selectedMethodData?.maxAmount || maxByLimit
  );
  setAmount(maxAllowed.toString());
};
```

### Interface Utilisateur

#### Bandeau Informatif
Un bandeau coloré affiche la limite actuelle:

**Avec 100% (vert)**:
```
✅ Retrait illimité activé
Vous avez 3 parrainage(s) direct(s) de niveaux différents.
Vous pouvez retirer 100% de votre solde.
```

**Avec limite (orange)**:
```
⚠️ Limite de retrait: 50%
Niveau: LV3 • Maximum: 5,000 CDF

💡 Pour débloquer 100% de votre solde:
• Invitez 3 personnes de niveaux d'investissement différents
• Actuellement: 2 parrainage(s) direct(s)
• Niveaux différents: 2
```

#### Message d'Erreur
Si l'utilisateur essaie de retirer plus que sa limite:

```
⚠️ Limite de retrait dépassée!

Votre niveau: LV3
Limite actuelle: 50% de votre solde
Montant maximum: 5,000 CDF
Montant demandé: 8,000 CDF

📢 Pour débloquer 100% de votre solde:
• Invitez 3 personnes de niveaux différents
• Actuellement: 2 parrainage(s) direct(s)
• Niveaux différents: 2

Ajustez le montant ou invitez plus de personnes.
```

## 📊 Structure des Données Firebase

### Collection `user_levels`
```javascript
{
  userId: "user123",
  levelId: "LV3",
  levelName: "LV3",
  status: "active",
  investedAmount: 50000,
  // ...
}
```

### Collection `users`
```javascript
{
  uid: "user456",
  email: "user@example.com",
  referredBy: "user123", // ID du parrain
  // ...
}
```

## 🔍 Logs de Debugging

Le système affiche des logs dans la console:

```javascript
console.log('📊 Limite de retrait calculée:', {
  userLevel: 'LV3',
  referralsCount: 2,
  referralsWithDifferentLevels: 2,
  withdrawalLimit: '50%'
});
```

## ✅ Avantages du Système

1. **Encourage le parrainage**: Les utilisateurs sont motivés à inviter des personnes
2. **Niveaux différents**: Encourage la diversité des investissements
3. **Transparent**: L'utilisateur voit clairement sa limite et comment la débloquer
4. **Flexible**: Facile de modifier les pourcentages par niveau
5. **Sécurisé**: Validation côté client ET côté serveur (via financeService)

## 🔄 Modifications Futures Possibles

### Changer les Pourcentages
Modifier dans `calculateWithdrawalLimit()`:

```javascript
const limits = {
  'LV1': 0.60,  // 60% au lieu de 50%
  'LV2': 0.60,
  // ...
};
```

### Changer le Nombre de Parrainages Requis
Modifier dans `hasThreeDifferentLevelReferrals()`:

```javascript
// Pour 5 parrainages au lieu de 3
return uniqueLevels.size >= 5;
```

### Ajouter des Conditions Supplémentaires
```javascript
const calculateWithdrawalLimit = (level, referrals, totalInvested) => {
  // Condition 1: 3 parrainages différents
  if (hasThreeDifferentLevelReferrals(referrals)) {
    return 1.0;
  }
  
  // Condition 2: Investissement total > 100,000 CDF
  if (totalInvested > 100000) {
    return 0.75; // 75%
  }
  
  // Sinon, limite par défaut
  return limits[level] || 0.50;
};
```

## 🧪 Tests Recommandés

### Test 1: Utilisateur sans investissement
- Niveau: null
- Parrainages: 0
- Résultat attendu: 50% par défaut

### Test 2: Utilisateur LV3 sans parrainage
- Niveau: LV3
- Parrainages: 0
- Résultat attendu: 50%

### Test 3: Utilisateur LV3 avec 3 parrainages différents
- Niveau: LV3
- Parrainages: 3 (LV1, LV2, LV4)
- Résultat attendu: 100%

### Test 4: Utilisateur LV7 sans parrainage
- Niveau: LV7
- Parrainages: 0
- Résultat attendu: 30%

### Test 5: Utilisateur LV7 avec 3 parrainages différents
- Niveau: LV7
- Parrainages: 3 (LV2, LV5, LV8)
- Résultat attendu: 100%

### Test 6: Tentative de retrait dépassant la limite
- Solde: 10,000 CDF
- Limite: 50%
- Montant demandé: 8,000 CDF
- Résultat attendu: Erreur avec message explicatif

## 📝 Notes Importantes

1. **Performance**: Le chargement des parrainages peut prendre quelques secondes
2. **Cache**: Les données sont rechargées à chaque visite de la page
3. **Sécurité**: La validation finale se fait aussi côté serveur dans `financeService`
4. **UX**: Le bandeau est visible dès le chargement de la page
5. **Accessibilité**: Les messages sont clairs et explicatifs

## 🎉 Résultat

Le système est maintenant opérationnel et encourage activement le parrainage tout en maintenant un contrôle sur les retraits selon le niveau d'investissement de chaque utilisateur.
