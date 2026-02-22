# Analyse Complète - Page de Retrait Shopmark

## 📋 Vue d'Ensemble

La page de retrait (`app/RetraitPage/page.jsx`) permet aux utilisateurs de retirer leurs gains depuis leur wallet Shopmark vers différents moyens de paiement (Mobile Money ou Crypto).

## 🎯 Objectif Principal

Permettre aux utilisateurs de convertir leur solde virtuel en argent réel via:
- **Orange Money** (Mobile Money RDC)
- **Airtel Money** (Mobile Money RDC)
- **M-Pesa** (Mobile Money RDC)
- **Crypto BEP20** (Cryptomonnaie)

---

## 🔧 Architecture Technique

### Imports et Dépendances

```javascript
// Bibliothèques React
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animations

// Icônes Lucide
import { ArrowLeft, Wallet, Smartphone, Shield, Clock, CheckCircle, AlertCircle, Copy, ... } from "lucide-react";

// Next.js
import { useRouter } from "next/navigation";

// Firebase
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Services personnalisés
import { financeService } from '@/lib/financeService'; // Gestion des transactions
import { withdrawalProfileService } from '@/lib/withdrawalProfileService'; // Profils de retrait
import { useWithdrawalProfile } from '@/hooks/useWithdrawalProfile'; // Hook personnalisé
import { useAuth } from "@/contexts/AuthContext"; // Authentification
```

---

## 📊 États (States) du Composant

### 1. États de Base

```javascript
const [amount, setAmount] = useState(""); // Montant à retirer
const [selectedMethod, setSelectedMethod] = useState(null); // Méthode sélectionnée (orange, airtel, mpesa, crypto)
const [accountBalance, setAccountBalance] = useState(0); // Solde disponible
const [isProcessing, setIsProcessing] = useState(false); // Traitement en cours
const [transactionId, setTransactionId] = useState(""); // ID de transaction généré
```

### 2. États Utilisateur

```javascript
const [userInfo, setUserInfo] = useState({
  uid: "",      // ID Firebase
  email: "",    // Email
  phone: "",    // Numéro de téléphone
  name: ""      // Nom d'affichage
});

const [recipientName, setRecipientName] = useState(""); // Nom du bénéficiaire
const [selectedCountryCode, setSelectedCountryCode] = useState("+243"); // Code pays (RDC par défaut)
```

### 3. États de Portefeuille

```javascript
const [linkedWallet, setLinkedWallet] = useState({
  provider: "orange",     // Fournisseur (orange, airtel, mpesa)
  phoneNumber: ""         // Numéro sans code pays
});

const [cryptoAddress, setCryptoAddress] = useState(""); // Adresse BEP20 pour crypto
```

### 4. États des Agents (Numéros de Retrait)

```javascript
const [dynamicAgents, setDynamicAgents] = useState({
  airtelAgent: { number: "", name: "" },
  orangeAgent: { number: "", name: "" },
  mpesaAgent: { number: "", name: "" }
});

const [agentsLoading, setAgentsLoading] = useState(true);
```

### 5. États de Limitation de Retrait (NOUVEAU)

```javascript
const [userLevel, setUserLevel] = useState(null); // Niveau d'investissement (LV1-LV10)
const [directReferrals, setDirectReferrals] = useState([]); // Parrainages directs
const [withdrawalLimit, setWithdrawalLimit] = useState(1.0); // Limite de retrait (0.0-1.0)
const [withdrawalLimitLoading, setWithdrawalLimitLoading] = useState(true);
```

### 6. États d'Interface

```javascript
const [isEditing, setIsEditing] = useState(false); // Mode édition du numéro
const [copiedField, setCopiedField] = useState(null); // Champ copié dans le presse-papier
```

---

## 🔄 Flux de Fonctionnement

### Étape 1: Chargement Initial

```
Utilisateur arrive sur /RetraitPage
         ↓
Vérification authentification (useAuth)
         ↓
Chargement des données:
  - Solde du wallet (Firebase: collection 'wallets')
  - Profil de retrait (Firebase: collection 'withdrawal_profiles')
  - Agents actifs (Firebase: collection 'portefeuilles')
  - Niveau utilisateur (Firebase: collection 'user_levels')
  - Parrainages directs (Firebase: collection 'users')
         ↓
Calcul de la limite de retrait
         ↓
Affichage de l'interface
```

### Étape 2: Saisie du Montant

```
Utilisateur saisit un montant
         ↓
Validation en temps réel:
  - Montant > 0
  - Montant >= Minimum (1500 CDF pour mobile, 5000 CDF pour crypto)
  - Montant <= Maximum (illimité)
  - Montant <= Solde disponible
  - Montant <= Limite de retrait (selon niveau)
         ↓
Génération automatique d'un ID de transaction
         ↓
Calcul des frais (20%)
         ↓
Affichage du montant net à recevoir
```

### Étape 3: Sélection du Moyen de Paiement

```
Utilisateur sélectionne une méthode:
  - Orange Money
  - Airtel Money
  - M-Pesa
  - Crypto BEP20
         ↓
Affichage des informations spécifiques:
  - Pour Mobile Money: Numéro de l'agent, instructions USSD
  - Pour Crypto: Champ pour adresse BEP20
         ↓
Pré-remplissage avec le profil sauvegardé (si existe)
```

### Étape 4: Vérification des Heures Ouvrables

```
Utilisateur clique sur "Confirmer le retrait"
         ↓
Vérification de l'heure (8h-16h heure de Kinshasa)
         ↓
Si hors heures: Blocage + Message d'erreur
Si dans les heures: Continue
```

### Étape 5: Validation Complète

```
Validation de tous les champs:
  ✓ Montant valide
  ✓ Méthode sélectionnée
  ✓ Informations bénéficiaire complètes
  ✓ Limite de retrait respectée
  ✓ Heures ouvrables
         ↓
Si erreur: Affichage message explicatif
Si OK: Continue
```

### Étape 6: Création de la Demande de Retrait

```
Appel à financeService.createWithdrawal()
         ↓
Création d'un document dans Firebase:
  Collection: 'withdrawals'
  Données:
    - userId
    - amount (montant brut)
    - fees (frais 20%)
    - netAmount (montant net)
    - paymentMethod (Orange, Airtel, M-Pesa, Crypto)
    - recipientPhone (numéro)
    - recipientName (nom)
    - cryptoAddress (si crypto)
    - agentNumber (numéro de l'agent)
    - agentName (nom de l'agent)
    - status: "pending" (en attente)
    - createdAt: timestamp
    - transactionId
         ↓
Mise à jour du wallet (déduction du montant)
         ↓
Sauvegarde automatique du profil (si nouveau)
         ↓
Affichage du message de confirmation
         ↓
Réinitialisation du formulaire
```

### Étape 7: Traitement Admin (Hors de cette page)

```
Admin reçoit la notification
         ↓
Admin vérifie la demande dans le dashboard
         ↓
Admin effectue le transfert manuellement
         ↓
Admin marque la transaction comme "completed" ou "rejected"
         ↓
Utilisateur reçoit une notification
```

---

## 💰 Calcul des Frais

### Formule

```javascript
const calculateFees = () => {
  if (!amount || !selectedMethod) return 0;
  const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  
  // Tous les moyens: 20% de frais
  return Math.round(numericAmount * 0.20);
};

// Exemple:
// Montant demandé: 10,000 CDF
// Frais (20%): 2,000 CDF
// Montant net reçu: 8,000 CDF
```

### Répartition

| Montant Demandé | Frais (20%) | Montant Net Reçu |
|----------------|-------------|------------------|
| 5,000 CDF | 1,000 CDF | 4,000 CDF |
| 10,000 CDF | 2,000 CDF | 8,000 CDF |
| 50,000 CDF | 10,000 CDF | 40,000 CDF |
| 100,000 CDF | 20,000 CDF | 80,000 CDF |

---

## 🔒 Système de Limitation des Retraits

### Règles par Niveau

```javascript
const calculateWithdrawalLimit = (level, referrals) => {
  // Si 3 parrainages de niveaux différents → 100%
  if (hasThreeDifferentLevelReferrals(referrals)) {
    return 1.0;
  }
  
  // Sinon, limite selon le niveau
  const limits = {
    'LV1': 0.50,  // 50%
    'LV2': 0.50,
    'LV3': 0.50,
    'LV4': 0.50,
    'LV5': 0.50,
    'LV6': 0.40,  // 40%
    'LV7': 0.30,  // 30%
    'LV8': 0.30,
    'LV9': 0.50,
    'LV10': 0.50
  };
  
  return limits[level] || 0.50;
};
```

### Exemples Pratiques

**Utilisateur LV3 sans parrainage:**
```
Solde: 10,000 CDF
Limite: 50%
Peut retirer: 5,000 CDF maximum
```

**Utilisateur LV3 avec 3 parrainages différents:**
```
Solde: 10,000 CDF
Limite: 100%
Peut retirer: 10,000 CDF (tout)
```

**Utilisateur LV7 sans parrainage:**
```
Solde: 20,000 CDF
Limite: 30%
Peut retirer: 6,000 CDF maximum
```

---

## ⏰ Blocage Heures Ouvrables

### Règle

Les retraits sont **uniquement autorisés de 8h00 à 16h00** (heure de Kinshasa, UTC+1).

### Implémentation

```javascript
const isWithinBusinessHours = () => {
  const now = new Date();
  const kinshasaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Kinshasa' }));
  const currentHour = kinshasaTime.getHours();
  
  return currentHour >= 8 && currentHour < 16;
};
```

### Comportement

| Heure | Statut | Action |
|-------|--------|--------|
| 07h59 | ❌ Bloqué | Bouton désactivé + Message |
| 08h00 | ✅ Autorisé | Bouton actif |
| 15h59 | ✅ Autorisé | Bouton actif |
| 16h00 | ❌ Bloqué | Bouton désactivé + Message |

---

## 📱 Moyens de Paiement

### 1. Orange Money

**Configuration:**
```javascript
{
  id: "orange",
  name: "Orange Money",
  fees: "20%",
  minAmount: 1500,
  maxAmount: 1000000000000,
  ussdCode: "*144#",
  agentNumber: "0841366703" // Dynamique depuis Firebase
}
```

**Instructions pour l'utilisateur:**
```
1. Composez: *144#
2. Sélectionnez 2: CDF
3. Sélectionnez 3: Je retire l'argent
4. Sélectionnez 1: Retrait Agent
5. Entrez le numéro: 0841366703
6. Montant CDF: [montant]
7. Entrez votre Code Pin
```

### 2. Airtel Money

**Configuration:**
```javascript
{
  id: "airtel",
  name: "Airtel Money",
  fees: "20%",
  minAmount: 1500,
  maxAmount: 1000000000000,
  ussdCode: "*501#",
  agentNumber: "0986343739" // Dynamique depuis Firebase
}
```

**Instructions:**
```
1. Composez: *501#
2. Sélectionnez 2: CDF
3. Sélectionnez 2: Retrait d'argent
4. Sélectionnez 1: Auprès d'un Agent
5. Entrez le code agent: 0986343739
6. Entrez le montant: [montant]
7. Sélectionnez 1: Oui
8. Entrez votre PIN
```

### 3. M-Pesa

**Configuration:**
```javascript
{
  id: "mpesa",
  name: "M-Pesa",
  fees: "20%",
  minAmount: 1500,
  maxAmount: 1000000000000,
  ussdCode: "*150*60#",
  agentNumber: "0971234567" // Dynamique depuis Firebase
}
```

**Instructions:**
```
1. Ouvrez l'application M-Pesa
2. Sélectionnez 'Envoyer de l'argent'
3. Entrez le numéro: 0971234567
4. Saisissez le montant: [montant] CDF
5. Confirmez la transaction
6. Entrez votre PIN
```

### 4. Crypto (BEP20)

**Configuration:**
```javascript
{
  id: "crypto",
  name: "Crypto (BEP20)",
  fees: "20%",
  minAmount: 5000,
  maxAmount: 1000000000000,
  ussdCode: "BEP20"
}
```

**Validation de l'adresse:**
```javascript
// L'adresse doit:
- Commencer par "0x"
- Faire exactement 42 caractères
- Exemple: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

---

## 💾 Profils de Retrait Sauvegardés

### Fonctionnement

Le système peut sauvegarder les informations de retrait pour les réutiliser:

```javascript
// Structure du profil
{
  userId: "user123",
  phoneNumber: "0898765432",
  recipientName: "John Doe",
  provider: "orange",
  countryCode: "+243",
  cryptoAddress: "", // Vide si mobile money
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Avantages

1. **Pré-remplissage automatique** - Les champs sont remplis automatiquement
2. **Gain de temps** - Pas besoin de ressaisir à chaque retrait
3. **Moins d'erreurs** - Informations validées une fois
4. **Multi-méthodes** - Peut sauvegarder pour mobile ET crypto

### Sauvegarde Automatique

Après un retrait réussi, le système propose:
```
💾 Sauvegarder ces informations ?
Enregistrez ce numéro et ce nom pour vos prochains retraits

[Oui, sauvegarder] [Non, merci]
```

---

## 🎨 Interface Utilisateur

### 1. Header
```
[← Retour]    Retrait de fonds    [     ]
              Retirez vos gains sur votre compte
```

### 2. Bandeau Heures Ouvrables
```
✅ Retraits disponibles
Les retraits sont disponibles de 8h00 à 16h00 (heure de Kinshasa)
```
OU
```
⏰ Retraits temporairement indisponibles
Les retraits sont disponibles de 8h00 à 16h00 - Veuillez réessayer pendant les heures ouvrables
```

### 3. Carte Solde
```
┌─────────────────────────────────────┐
│ 💰 Solde disponible                 │
│                                     │
│ 50,000 CDF                          │
│                                     │
│ Solde actuel pour retraits          │
│                                     │
│ 🛡️ Transfert 100% sécurisé          │
│                          [Retirer tout] │
└─────────────────────────────────────┘
```

### 4. Bandeau Limite de Retrait
```
⚠️ Limite de retrait: 50%
Niveau: LV3 • Maximum: 25,000 CDF

💡 Pour débloquer 100% de votre solde:
• Invitez 3 personnes de niveaux différents
• Actuellement: 2 parrainage(s) direct(s)
• Niveaux différents: 2
```

### 5. Sélection du Portefeuille
```
📱 Portefeuille de réception

[📁 Profil sauvegardé]

Orange Money
0898765432                    [Copier]
Ce numéro provient de votre profil sauvegardé

[Modifier]
```

### 6. Saisie du Montant
```
💵 Montant à retirer

[        10000        ] CDF

Montants rapides:
[10,000] [50,000] [100,000] [250,000] [500,000]
```

### 7. Sélection de la Méthode
```
Choisissez votre moyen de retrait

[🟠 Orange Money]  [🔴 Airtel Money]
[🟢 M-Pesa]        [⚡ Crypto BEP20]
```

### 8. Récapitulatif
```
📊 Récapitulatif du retrait

Montant demandé:     10,000 CDF
Frais (20%):         -2,000 CDF
─────────────────────────────
Vous recevrez:        8,000 CDF

Le virement sera effectué sous moins de 30min
```

### 9. Instructions
```
📋 Instructions de retrait

1. Composez: *144#
2. Sélectionnez 2: CDF
3. Sélectionnez 3: Je retire l'argent
...
```

### 10. Bouton de Confirmation
```
[Confirmer le retrait]
```
OU (si hors heures)
```
[⏰ Retraits disponibles de 8h à 16h]
```

---

## 🔐 Sécurité

### 1. Authentification
- Vérification Firebase Auth obligatoire
- Redirection vers /auth/login si non connecté

### 2. Validation Côté Client
- Montant minimum/maximum
- Format de l'adresse crypto
- Numéro de téléphone valide
- Limite de retrait respectée
- Heures ouvrables

### 3. Validation Côté Serveur
- `financeService.createWithdrawal()` vérifie:
  - Solde suffisant
  - Utilisateur authentifié
  - Données valides
  - Pas de doublon de transaction

### 4. Protection des Données
- Numéros de téléphone sans code pays stockés
- Adresses crypto validées
- Transactions tracées avec ID unique

---

## 📊 Données Firebase

### Collections Utilisées

#### 1. `wallets`
```javascript
{
  userId: "user123",
  balances: {
    wallet: {
      amount: 50000,
      currency: "CDF"
    }
  },
  stats: {
    totalEarned: 100000,
    totalWithdrawn: 50000,
    referralEarnings: 20000
  }
}
```

#### 2. `withdrawals`
```javascript
{
  id: "WDR2024012312345678",
  userId: "user123",
  amount: 10000,
  fees: 2000,
  netAmount: 8000,
  paymentMethod: "Orange Money",
  recipientPhone: "0898765432",
  recipientName: "John Doe",
  countryCode: "+243",
  agentNumber: "0841366703",
  agentName: "Agent Orange",
  status: "pending", // pending, completed, rejected
  createdAt: timestamp,
  processedAt: null,
  transactionId: "WDR2024012312345678"
}
```

#### 3. `withdrawal_profiles`
```javascript
{
  userId: "user123",
  phoneNumber: "0898765432",
  recipientName: "John Doe",
  provider: "orange",
  countryCode: "+243",
  cryptoAddress: "",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. `portefeuilles` (Agents)
```javascript
{
  provider: "orange",
  number: "0841366703",
  name: "Agent Orange Principal",
  status: "active",
  createdAt: timestamp
}
```

#### 5. `user_levels`
```javascript
{
  userId: "user123",
  levelId: "LV3",
  levelName: "LV3",
  status: "active",
  investedAmount: 50000,
  dailyReturnRate: 0.02,
  createdAt: timestamp
}
```

#### 6. `users`
```javascript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  phoneNumber: "+243898765432",
  referredBy: "user456", // ID du parrain
  createdAt: timestamp
}
```

---

## 🔄 Flux de Données

```
┌─────────────┐
│  Utilisateur │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│  RetraitPage.jsx    │
│  (Interface)        │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  financeService.js  │
│  (Logique métier)   │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  Firebase Firestore │
│  (Base de données)  │
└─────────────────────┘
       │
       ↓
┌─────────────────────┐
│  Dashboard Admin    │
│  (Validation)       │
└─────────────────────┘
```

---

## ⚡ Optimisations

### 1. Chargement Dynamique des Agents
Les numéros d'agents sont chargés depuis Firebase au lieu d'être codés en dur.

### 2. Profils Sauvegardés
Évite de ressaisir les informations à chaque retrait.

### 3. Validation en Temps Réel
Feedback immédiat sur les erreurs de saisie.

### 4. Génération Automatique d'ID
ID de transaction unique généré automatiquement.

### 5. Cache du Service Worker
Les ressources statiques sont mises en cache pour un chargement rapide.

---

## 🎯 Cas d'Usage Typiques

### Cas 1: Premier Retrait
```
1. Utilisateur arrive sur la page
2. Voit son solde: 50,000 CDF
3. Voit sa limite: 50% (25,000 CDF max)
4. Saisit 20,000 CDF
5. Sélectionne Orange Money
6. Saisit son numéro: 0898765432
7. Saisit son nom: John Doe
8. Confirme le retrait
9. Reçoit la confirmation
10. Système propose de sauvegarder le profil
```

### Cas 2: Retrait avec Profil Sauvegardé
```
1. Utilisateur arrive sur la page
2. Voit son solde: 30,000 CDF
3. Voit sa limite: 100% (déblocage actif)
4. Clique sur "Retirer tout"
5. Montant pré-rempli: 30,000 CDF
6. Orange Money déjà sélectionné
7. Numéro et nom pré-remplis
8. Confirme directement
9. Reçoit la confirmation
```

### Cas 3: Retrait Bloqué par Limite
```
1. Utilisateur LV7 arrive sur la page
2. Voit son solde: 100,000 CDF
3. Voit sa limite: 30% (30,000 CDF max)
4. Essaie de retirer 50,000 CDF
5. Reçoit un message d'erreur:
   "Limite dépassée! Maximum: 30,000 CDF"
6. Voit les conseils pour débloquer 100%
7. Ajuste le montant à 30,000 CDF
8. Confirme le retrait
```

### Cas 4: Retrait Hors Heures
```
1. Utilisateur arrive à 17h30
2. Voit le bandeau orange:
   "⏰ Retraits temporairement indisponibles"
3. Bouton de retrait désactivé
4. Message: "Retraits disponibles de 8h à 16h"
5. Doit attendre le lendemain matin
```

---

## 📈 Métriques et Statistiques

### Données Trackées

1. **Nombre de retraits** par méthode
2. **Montant total retiré** par utilisateur
3. **Frais collectés** (20% de chaque retrait)
4. **Taux de conversion** (demandes vs validations)
5. **Temps de traitement** moyen
6. **Taux d'utilisation** des profils sauvegardés

### Exemple de Rapport

```
Période: Janvier 2024

Total retraits: 1,250
Montant total: 125,000,000 CDF
Frais collectés: 25,000,000 CDF

Par méthode:
- Orange Money: 60% (750 retraits)
- Airtel Money: 25% (312 retraits)
- M-Pesa: 10% (125 retraits)
- Crypto: 5% (63 retraits)

Statut:
- En attente: 50 (4%)
- Validés: 1,150 (92%)
- Rejetés: 50 (4%)
```

---

## 🚀 Améliorations Futures Possibles

### 1. Notifications Push
Notifier l'utilisateur quand le retrait est validé.

### 2. Historique des Retraits
Afficher l'historique directement sur la page.

### 3. Retrait Automatique
Option pour retirer automatiquement à un certain seuil.

### 4. Multi-Devises
Support de USD, EUR en plus de CDF.

### 5. Retrait Instantané
Pour les utilisateurs VIP avec validation automatique.

### 6. QR Code
Générer un QR code pour faciliter le paiement.

### 7. Estimation du Temps
Afficher une estimation précise du temps de traitement.

### 8. Chat Support
Intégrer un chat pour assistance en temps réel.

---

## ✅ Résumé

La page de retrait Shopmark est un système complet qui:

1. ✅ Charge le solde de l'utilisateur depuis Firebase
2. ✅ Calcule la limite de retrait selon le niveau et les parrainages
3. ✅ Bloque les retraits hors heures ouvrables (8h-16h)
4. ✅ Applique des frais de 20% sur tous les retraits
5. ✅ Supporte 4 moyens de paiement (Orange, Airtel, M-Pesa, Crypto)
6. ✅ Sauvegarde les profils pour réutilisation
7. ✅ Génère des IDs de transaction uniques
8. ✅ Crée des demandes de retrait en attente de validation admin
9. ✅ Fournit des instructions claires pour chaque méthode
10. ✅ Offre une interface intuitive et sécurisée

Le système est conçu pour être **sécurisé**, **flexible** et **facile à utiliser** tout en encourageant le parrainage via le système de limitation des retraits.
