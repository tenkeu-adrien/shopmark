# Résumé Simple - Page de Retrait Shopmark

## 🎯 En Bref

La page de retrait permet aux utilisateurs de **convertir leur solde virtuel en argent réel** via Mobile Money ou Crypto.

---

## 📱 Moyens de Paiement

### 1. Orange Money (Mobile)
- Frais: 20%
- Minimum: 1,500 CDF
- Agent: 0841366703

### 2. Airtel Money (Mobile)
- Frais: 20%
- Minimum: 1,500 CDF
- Agent: 0986343739

### 3. M-Pesa (Mobile)
- Frais: 20%
- Minimum: 1,500 CDF
- Agent: 0971234567

### 4. Crypto BEP20
- Frais: 20%
- Minimum: 5,000 CDF
- Adresse: Format 0x... (42 caractères)

---

## 💰 Exemple de Calcul

```
Montant demandé:  10,000 CDF
Frais (20%):      -2,000 CDF
─────────────────────────────
Vous recevez:      8,000 CDF
```

---

## 🔒 Limites de Retrait

### Sans Parrainage
- LV1-LV5: 50% du solde
- LV6: 40% du solde
- LV7-LV8: 30% du solde
- LV9-LV10: 50% du solde

### Avec 3 Parrainages Différents
- Tous niveaux: 100% du solde ✅

### Exemple
```
Utilisateur LV3 avec 10,000 CDF:
- Sans parrainage: 5,000 CDF max
- Avec 3 parrainages: 10,000 CDF max
```

---

## ⏰ Heures Ouvrables

**Retraits autorisés uniquement:**
- 🕐 8h00 à 16h00 (heure de Kinshasa)

**Hors de ces heures:**
- ❌ Bouton désactivé
- 📢 Message explicatif

---

## 🔄 Processus Complet

### Étape 1: Saisie
```
Utilisateur saisit le montant
↓
Sélectionne la méthode (Orange, Airtel, M-Pesa, Crypto)
↓
Saisit les informations (numéro ou adresse crypto)
```

### Étape 2: Validation
```
Vérification:
✓ Montant valide
✓ Solde suffisant
✓ Limite respectée
✓ Heures ouvrables (8h-16h)
✓ Informations complètes
```

### Étape 3: Création
```
Création de la demande de retrait
↓
Statut: "En attente"
↓
Déduction du solde
↓
Sauvegarde du profil (optionnel)
```

### Étape 4: Traitement Admin
```
Admin reçoit la notification
↓
Admin vérifie la demande
↓
Admin effectue le transfert
↓
Admin valide ou rejette
```

### Étape 5: Finalisation
```
Utilisateur reçoit une notification
↓
Statut: "Validé" ou "Rejeté"
↓
Si rejeté: Remboursement automatique
```

---

## 📊 Données Stockées

### Dans Firebase

**Collection `withdrawals`:**
```javascript
{
  userId: "user123",
  amount: 10000,
  fees: 2000,
  netAmount: 8000,
  paymentMethod: "Orange Money",
  recipientPhone: "0898765432",
  recipientName: "John Doe",
  status: "pending",
  transactionId: "WDR2024..."
}
```

**Collection `wallets`:**
```javascript
{
  userId: "user123",
  balances: {
    wallet: {
      amount: 40000 // Après déduction
    }
  }
}
```

---

## 🎨 Interface Simplifiée

```
┌─────────────────────────────────┐
│ [← Retour]  Retrait de fonds   │
├─────────────────────────────────┤
│                                 │
│ ⏰ Retraits disponibles         │
│ 8h00 à 16h00 (Kinshasa)         │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 💰 Solde: 50,000 CDF            │
│                                 │
├─────────────────────────────────┤
│                                 │
│ ⚠️ Limite: 50% (25,000 CDF)     │
│ Pour débloquer 100%:            │
│ Invitez 3 personnes             │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📱 Orange Money                 │
│ 0898765432                      │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 💵 Montant: [10,000] CDF        │
│                                 │
├─────────────────────────────────┤
│                                 │
│ Méthodes:                       │
│ [🟠 Orange] [🔴 Airtel]         │
│ [🟢 M-Pesa] [⚡ Crypto]          │
│                                 │
├─────────────────────────────────┤
│                                 │
│ Récapitulatif:                  │
│ Demandé:    10,000 CDF          │
│ Frais:      -2,000 CDF          │
│ Reçu:        8,000 CDF          │
│                                 │
├─────────────────────────────────┤
│                                 │
│   [Confirmer le retrait]        │
│                                 │
└─────────────────────────────────┘
```

---

## 🔐 Sécurité

### Vérifications
1. ✅ Authentification Firebase obligatoire
2. ✅ Validation du montant (min/max)
3. ✅ Vérification du solde
4. ✅ Respect de la limite de retrait
5. ✅ Heures ouvrables (8h-16h)
6. ✅ Format des données (numéro, adresse crypto)
7. ✅ Transaction unique (ID généré)

### Protection
- Pas de retrait sans authentification
- Pas de retrait supérieur au solde
- Pas de retrait hors heures
- Pas de retrait dépassant la limite

---

## 💡 Fonctionnalités Clés

### 1. Profils Sauvegardés
```
Première fois:
- Saisir numéro et nom
- Option: "Sauvegarder pour plus tard"

Prochaines fois:
- Numéro et nom pré-remplis
- Gain de temps
```

### 2. Bouton "Retirer Tout"
```
Clique sur "Retirer tout"
↓
Calcul automatique du maximum autorisé
↓
Respect de la limite de retrait
↓
Montant pré-rempli
```

### 3. Instructions USSD
```
Pour chaque méthode:
- Code USSD affiché (*144#, *501#, etc.)
- Instructions étape par étape
- Numéro de l'agent inclus
```

### 4. Validation en Temps Réel
```
Saisie du montant
↓
Vérification instantanée:
- Trop petit? → Message d'erreur
- Trop grand? → Message d'erreur
- OK? → Affichage du récapitulatif
```

---

## 📈 Statistiques

### Exemple de Données

**Utilisateur Actif:**
```
Total retiré: 500,000 CDF
Nombre de retraits: 25
Frais payés: 100,000 CDF
Méthode préférée: Orange Money
Taux de validation: 96%
```

**Plateforme:**
```
Retraits du mois: 1,250
Montant total: 125,000,000 CDF
Frais collectés: 25,000,000 CDF
Temps moyen: 2h30
```

---

## ❓ Questions Fréquentes

### Q: Pourquoi 20% de frais?
**R:** Les frais couvrent les coûts de transaction et de gestion.

### Q: Combien de temps pour recevoir?
**R:** Généralement moins de 30 minutes après validation admin.

### Q: Puis-je annuler un retrait?
**R:** Oui, tant qu'il est en statut "En attente".

### Q: Pourquoi je ne peux pas retirer 100%?
**R:** Selon votre niveau, vous devez avoir 3 parrainages de niveaux différents.

### Q: Que se passe-t-il si je me trompe de numéro?
**R:** Contactez le support immédiatement. Si non traité, modification possible.

### Q: Puis-je retirer le weekend?
**R:** Non, uniquement en semaine de 8h à 16h.

---

## ✅ Points Clés à Retenir

1. **Frais fixes**: 20% sur tous les retraits
2. **Limites**: Selon le niveau et les parrainages
3. **Heures**: 8h-16h uniquement (Kinshasa)
4. **Méthodes**: Orange, Airtel, M-Pesa, Crypto
5. **Validation**: Par l'admin après demande
6. **Profils**: Sauvegarde possible pour réutilisation
7. **Sécurité**: Multiples vérifications
8. **Traçabilité**: ID unique pour chaque transaction

---

## 🎯 En Résumé

La page de retrait Shopmark est un **système complet et sécurisé** qui permet aux utilisateurs de retirer leurs gains facilement tout en:
- Encourageant le parrainage (limites de retrait)
- Respectant les heures ouvrables
- Appliquant des frais transparents
- Offrant plusieurs moyens de paiement
- Sauvegardant les préférences utilisateur
