# 🧪 Guide de Test - Sélection Manuelle des Gains Journaliers

## 📋 Objectif

Ce guide vous aide à **tester complètement** la fonctionnalité de sélection manuelle des gains journaliers.

---

## 🚀 Prérequis

Avant de commencer les tests:

1. ✅ Les stores Zustand sont créés:
   - `lib/store/usersStore.js`
   - `lib/store/dailyGainsStore.js`

2. ✅ La page optimisée est créée:
   - `app/dashboard/utilisateurs/page-optimized.jsx`

3. ✅ La page optimisée est activée:
   ```bash
   mv app/dashboard/utilisateurs/page.jsx app/dashboard/utilisateurs/page-old.jsx
   mv app/dashboard/utilisateurs/page-optimized.jsx app/dashboard/utilisateurs/page.jsx
   ```

4. ✅ Vous avez des données de test dans Firebase:
   - Collection `users` avec des utilisateurs
   - Collection `user_levels` avec des investissements actifs
   - Collection `wallets` avec des portefeuilles

---

## 📝 Plan de Test

### Test 1: Accès à la Fonctionnalité

**Objectif:** Vérifier que le bouton "Gains Journaliers" est accessible

**Étapes:**
1. Connectez-vous au dashboard
2. Allez dans **Dashboard → Utilisateurs**
3. Cherchez le bouton "Gains Journaliers" en haut à droite

**Résultat attendu:**
- ✅ Le bouton est visible
- ✅ Le bouton a une icône 💰 (DollarSign)
- ✅ Le bouton est de couleur verte
- ✅ Le bouton affiche "Gains Journaliers"

**Capture d'écran:**
```
┌─────────────────────────────────────────────┐
│ Utilisateurs                                │
│ Gestion des utilisateurs                    │
│                                             │
│ [Actualiser] [💰 Gains Journaliers]        │
└─────────────────────────────────────────────┘
```

---

### Test 2: Chargement des Investissements Éligibles

**Objectif:** Vérifier que les investissements éligibles sont chargés

**Étapes:**
1. Cliquez sur "Gains Journaliers"
2. Confirmez l'action dans la popup
3. Attendez le chargement

**Résultat attendu:**
- ✅ Une popup de confirmation s'affiche
- ✅ Le message explique l'action
- ✅ Un drawer s'ouvre après confirmation
- ✅ Les investissements éligibles sont affichés
- ✅ Le compteur affiche le nombre total

**Console (F12):**
```javascript
// Vérifier dans la console
import { useDailyGainsStore } from '@/lib/store';
const store = useDailyGainsStore.getState();
console.log('Eligible investments:', store.dailyGainsData.eligibleInvestments);
console.log('Count:', store.dailyGainsData.eligibleInvestments.length);
```

---

### Test 3: Sélection Individuelle

**Objectif:** Vérifier que la sélection individuelle fonctionne

**Étapes:**
1. Dans le drawer, cochez un investissement
2. Vérifiez que le compteur se met à jour
3. Décochez l'investissement
4. Vérifiez que le compteur se met à jour

**Résultat attendu:**
- ✅ La checkbox se coche/décoche
- ✅ Le compteur "Sélectionnés" se met à jour
- ✅ Le montant total estimé se met à jour
- ✅ La ligne change de couleur (bg-blue-50)

**Console:**
```javascript
const store = useDailyGainsStore.getState();
console.log('Selected:', store.dailyGainsData.selectedInvestments);
console.log('Count:', store.dailyGainsData.selectedInvestments.length);
```

---

### Test 4: Tout Sélectionner/Désélectionner

**Objectif:** Vérifier que la sélection globale fonctionne

**Étapes:**
1. Cliquez sur "Tout désélectionner"
2. Vérifiez que toutes les checkboxes sont décochées
3. Cliquez sur "Tout sélectionner"
4. Vérifiez que toutes les checkboxes sont cochées

**Résultat attendu:**
- ✅ Toutes les checkboxes se décochent
- ✅ Le compteur affiche 0
- ✅ Le montant total est 0
- ✅ Toutes les checkboxes se cochent
- ✅ Le compteur affiche le total
- ✅ Le montant total est correct

---

### Test 5: Aperçu du Montant Total

**Objectif:** Vérifier que le montant total est correct

**Étapes:**
1. Sélectionnez 3 investissements
2. Notez les gains individuels
3. Vérifiez le montant total estimé

**Résultat attendu:**
- ✅ Le montant total = somme des gains individuels
- ✅ Le montant est formaté correctement (ex: 150,000 CDF)

**Exemple:**
```
Investment 1: 5,000 CDF
Investment 2: 2,500 CDF
Investment 3: 7,500 CDF
Total: 15,000 CDF ✅
```

---

### Test 6: Confirmation et Exécution

**Objectif:** Vérifier que le calcul s'exécute correctement

**Étapes:**
1. Sélectionnez 2-3 investissements
2. Cliquez sur "Confirmer et exécuter"
3. Confirmez dans la popup
4. Attendez la fin du calcul

**Résultat attendu:**
- ✅ Une popup de confirmation s'affiche
- ✅ Le message affiche le nombre et le montant
- ✅ Le calcul démarre
- ✅ La progression s'affiche
- ✅ Le calcul se termine
- ✅ Les résultats s'affichent

**Console:**
```javascript
const store = useDailyGainsStore.getState();
console.log('Calculating:', store.uiStates.calculatingDailyGains);
console.log('Progress:', store.calculationProgress);
```

---

### Test 7: Progression en Temps Réel

**Objectif:** Vérifier que la progression s'affiche correctement

**Étapes:**
1. Lancez un calcul avec 5+ investissements
2. Observez la progression

**Résultat attendu:**
- ✅ La barre de progression s'affiche
- ✅ Le pourcentage se met à jour
- ✅ "Progression: X/Y" se met à jour
- ✅ "Traités: X" se met à jour
- ✅ "Erreurs: X" se met à jour
- ✅ "Montant total: X CDF" se met à jour

**Capture d'écran:**
```
⏳ Calcul en cours...

Progression: 3/5
[████████░░] 60%

Traités: 3
Erreurs: 0
Montant total: 15,000 CDF
```

---

### Test 8: Résultats Détaillés

**Objectif:** Vérifier que les résultats sont affichés correctement

**Étapes:**
1. Attendez la fin du calcul
2. Vérifiez le drawer de résultats

**Résultat attendu:**
- ✅ Le drawer de résultats s'ouvre automatiquement
- ✅ Le nombre de succès est affiché
- ✅ Le nombre d'échecs est affiché
- ✅ Le montant total distribué est affiché
- ✅ La liste des succès est affichée
- ✅ La liste des échecs est affichée (si applicable)

**Console:**
```javascript
const store = useDailyGainsStore.getState();
console.log('Results:', store.dailyGainsData.calculationResults);
console.log('Success:', store.dailyGainsData.calculationResults.success);
console.log('Failed:', store.dailyGainsData.calculationResults.failed);
```

---

### Test 9: Vérification dans Firebase

**Objectif:** Vérifier que les données sont bien enregistrées dans Firebase

**Étapes:**
1. Après un calcul réussi
2. Allez dans Firebase Console
3. Vérifiez les collections

**Résultat attendu:**

**Collection `wallets`:**
- ✅ `balances.wallet.amount` a augmenté
- ✅ `stats.totalEarned` a augmenté
- ✅ `stats.totalDailyGains` a augmenté
- ✅ `stats.lastDailyGainAt` est mis à jour

**Collection `transactions`:**
- ✅ Une nouvelle transaction de type `daily_gain` est créée
- ✅ Le montant est correct
- ✅ Le statut est `completed`
- ✅ Les métadonnées sont complètes

**Collection `admin_logs`:**
- ✅ Document `dailyGainsCalculation` est créé/mis à jour
- ✅ Les statistiques sont correctes
- ✅ L'admin est enregistré
- ✅ La date est correcte

---

### Test 10: Gestion des Erreurs

**Objectif:** Vérifier que les erreurs sont gérées correctement

**Étapes:**
1. Créez un investissement avec un wallet manquant
2. Lancez le calcul en incluant cet investissement
3. Vérifiez les résultats

**Résultat attendu:**
- ✅ Le calcul continue malgré l'erreur
- ✅ L'erreur est comptée dans "Erreurs"
- ✅ L'investissement apparaît dans la liste des échecs
- ✅ La raison de l'échec est affichée
- ✅ Les autres investissements sont traités normalement

---

### Test 11: Cache des Investissements Éligibles

**Objectif:** Vérifier que le cache fonctionne

**Étapes:**
1. Lancez la sélection manuelle (1ère fois)
2. Fermez le drawer
3. Relancez la sélection manuelle (2ème fois)
4. Vérifiez dans Network tab (F12)

**Résultat attendu:**
- ✅ 1ère fois: requêtes Firebase visibles
- ✅ 2ème fois (< 10 min): 0 requête Firebase
- ✅ Les données sont chargées depuis le cache
- ✅ Le chargement est instantané

**Console:**
```javascript
const store = useDailyGainsStore.getState();
console.log('Cache metadata:', store.cacheMetadata.eligibleInvestments);
console.log('Last updated:', new Date(store.cacheMetadata.eligibleInvestments.lastUpdated));
console.log('Is fresh:', store.cacheMetadata.eligibleInvestments.isFresh);
```

---

### Test 12: Réinitialisation de la Sélection

**Objectif:** Vérifier que la sélection est réinitialisée après le calcul

**Étapes:**
1. Sélectionnez des investissements
2. Exécutez le calcul
3. Relancez la sélection manuelle

**Résultat attendu:**
- ✅ La sélection précédente est effacée
- ✅ Tous les investissements sont sélectionnés par défaut
- ✅ Le compteur est réinitialisé

---

## 🐛 Tests de Cas Limites

### Cas 1: Aucun Investissement Éligible

**Scénario:** Tous les utilisateurs ont déjà reçu leurs gains aujourd'hui

**Résultat attendu:**
- ✅ Le drawer s'ouvre
- ✅ Le message "0 investissements éligibles" s'affiche
- ✅ Le bouton "Confirmer et exécuter" est désactivé

### Cas 2: Aucun Investissement Sélectionné

**Scénario:** L'admin désélectionne tous les investissements

**Résultat attendu:**
- ✅ Le compteur affiche 0
- ✅ Le montant total est 0
- ✅ Le bouton "Confirmer et exécuter" est désactivé

### Cas 3: Tous les Investissements Échouent

**Scénario:** Tous les wallets sont manquants

**Résultat attendu:**
- ✅ Le calcul se termine
- ✅ Succès: 0
- ✅ Échecs: X (tous)
- ✅ Montant total: 0
- ✅ La liste des échecs est affichée

### Cas 4: Calcul Interrompu

**Scénario:** L'utilisateur ferme le drawer pendant le calcul

**Résultat attendu:**
- ✅ Le calcul continue en arrière-plan
- ✅ Les résultats sont enregistrés
- ✅ Le drawer peut être rouvert

---

## 📊 Checklist Complète

### Avant le Test

- [ ] Stores Zustand créés
- [ ] Page optimisée créée
- [ ] Page optimisée activée
- [ ] Données de test dans Firebase
- [ ] Console du navigateur ouverte (F12)

### Tests Fonctionnels

- [ ] Test 1: Accès à la fonctionnalité
- [ ] Test 2: Chargement des investissements
- [ ] Test 3: Sélection individuelle
- [ ] Test 4: Tout sélectionner/désélectionner
- [ ] Test 5: Aperçu du montant total
- [ ] Test 6: Confirmation et exécution
- [ ] Test 7: Progression en temps réel
- [ ] Test 8: Résultats détaillés
- [ ] Test 9: Vérification dans Firebase
- [ ] Test 10: Gestion des erreurs
- [ ] Test 11: Cache des investissements
- [ ] Test 12: Réinitialisation de la sélection

### Tests de Cas Limites

- [ ] Cas 1: Aucun investissement éligible
- [ ] Cas 2: Aucun investissement sélectionné
- [ ] Cas 3: Tous les investissements échouent
- [ ] Cas 4: Calcul interrompu

### Vérifications Finales

- [ ] Aucune erreur dans la console
- [ ] Aucune erreur dans Firebase
- [ ] Les données sont correctes
- [ ] L'interface est responsive
- [ ] Les performances sont bonnes

---

## 🎯 Critères de Succès

Le test est réussi si:

1. ✅ Tous les tests fonctionnels passent
2. ✅ Tous les tests de cas limites passent
3. ✅ Aucune erreur dans la console
4. ✅ Les données Firebase sont correctes
5. ✅ L'interface est fluide et responsive
6. ✅ Le cache fonctionne correctement
7. ✅ La progression s'affiche en temps réel
8. ✅ Les résultats sont détaillés et corrects

---

## 🐛 Que Faire en Cas d'Échec ?

### Erreur: "Eligible investments not loading"

**Solution:**
1. Vérifier que `fetchEligibleInvestments` est appelé
2. Vérifier la console pour les erreurs Firebase
3. Vérifier que la collection `user_levels` existe
4. Vérifier que les investissements ont `status: 'active'`

### Erreur: "Selection not working"

**Solution:**
1. Vérifier que `toggleInvestmentSelection` est appelé
2. Vérifier que `selectedInvestments` est mis à jour
3. Vérifier dans la console: `dailyGainsData.selectedInvestments`

### Erreur: "Progress not showing"

**Solution:**
1. Vérifier que `setCalculationProgress` est appelé
2. Vérifier que `calculatingDailyGains` est `true`
3. Vérifier que le drawer est ouvert

### Erreur: "Results not showing"

**Solution:**
1. Vérifier que `setCalculationResults` est appelé
2. Vérifier que `calculationDrawerOpen` est `true`
3. Vérifier dans la console: `dailyGainsData.calculationResults`

---

## 📞 Support

Si vous rencontrez des problèmes:

1. Consultez la console du navigateur (F12)
2. Vérifiez les logs Firebase
3. Consultez `DEMO_SELECTION_MANUELLE.md`
4. Consultez `OPTIMISATION_UTILISATEURS.md`

---

**Auteur:** Kiro AI  
**Date:** 2025  
**Version:** 1.0
