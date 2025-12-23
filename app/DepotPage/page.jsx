"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Smartphone,
  Banknote,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  QrCode,
  ChevronRight,
  Zap,
  TrendingUp,
  Gift,
} from "lucide-react";
import { useRouter } from "next/navigation";



export default function DepotPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [depositInfo, setDepositInfo] = useState({
    airtelNumber: "+243 99 876 5432",
    accountName: "SHOPMARK INVESTMENTS SARL",
    accountNumber: "CD64 3000 4000 0100 8765 4321 098",
    cryptoAddress: "0x742d35Cc6634C0532925a3b844Bc9e8eE3a7b1c2",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [reference, setReference] = useState("");

  const paymentMethods= [
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Dépôt mobile instantané",
      processingTime: "Instantané",
      fees: "1%",
      minAmount: 1000,
      maxAmount: 5000000,
      color: "from-red-500 to-red-600",
    },
    {
      id: "bank",
      name: "Virement bancaire",
      icon: <Banknote className="w-6 h-6" />,
      description: "Transfert bancaire sécurisé",
      processingTime: "24h",
      fees: "0%",
      minAmount: 5000,
      maxAmount: 10000000,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "crypto",
      name: "Crypto-monnaie",
      icon: <Zap className="w-6 h-6" />,
      description: "Dépôt en USDT/BTC",
      processingTime: "15-30min",
      fees: "0.2%",
      minAmount: 10000,
      maxAmount: 50000000,
      color: "from-amber-500 to-amber-600",
    },
  ];

  const quickAmounts = [30000, 90000, 170000, 245000, 500000];
  const investmentLevels = [
    { amount: 30000, level: "N1", dailyGain: 1050 },
    { amount: 90000, level: "N2", dailyGain: 3250 },
    { amount: 170000, level: "N3", dailyGain: 6100 },
  ];

  const calculateFees = () => {
    if (!amount || !selectedMethod) return 0;
    const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
    const method = paymentMethods.find(m => m.id === selectedMethod);
    
    if (!method) return 0;
    
    switch (method.id) {
      case "airtel":
        return Math.round(numericAmount * 0.01);
      case "bank":
        return 0;
      case "crypto":
        return Math.round(numericAmount * 0.002);
      default:
        return 0;
    }
  };

  const generateReference = () => {
    return "DEP" + Date.now().toString().slice(-8);
  };

  const fees = calculateFees();
  const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  const totalToSend = numericAmount + fees;
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  const formatAmount = (value) => {
    return value.toLocaleString("fr-FR");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateDeposit = () => {
    if (!numericAmount) {
      alert("Veuillez saisir un montant à déposer.");
      return false;
    }

    if (selectedMethodData && numericAmount < selectedMethodData.minAmount) {
      alert(`Le montant minimum est de ${formatAmount(selectedMethodData.minAmount)} CDF.`);
      return false;
    }

    if (selectedMethodData && numericAmount > selectedMethodData.maxAmount) {
      alert(`Le montant maximum est de ${formatAmount(selectedMethodData.maxAmount)} CDF.`);
      return false;
    }

    if (!selectedMethod) {
      alert("Veuillez sélectionner un moyen de dépôt.");
      return false;
    }

    return true;
  };

  const handleDeposit = async () => {
    if (!validateDeposit()) return;

    const newReference = generateReference();
    setReference(newReference);

    if (selectedMethod === "crypto") {
      // Pour les crypto, on affiche les instructions
      alert(
        `📋 Instructions pour le dépôt crypto\n\n` +
        `1. Envoyez exactement ${formatAmount(totalToSend)} CDF en USDT\n` +
        `2. Adresse : ${depositInfo.cryptoAddress}\n` +
        `3. Référence : ${newReference}\n\n` +
        `Une fois la transaction confirmée, les fonds seront crédités sur votre compte.`
      );
    } else {
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        
        alert(
          `✅ Dépôt initié !\n\n` +
          `Montant : ${formatAmount(numericAmount)} CDF\n` +
          `À envoyer : ${formatAmount(totalToSend)} CDF\n` +
          `Référence : ${newReference}\n` +
          `Moyen : ${selectedMethodData?.name}\n\n` +
          `Suivez les instructions ci-dessous pour compléter le paiement.`
        );
      }, 1500);
    }
  };

  const getRecommendedLevel = () => {
    return investmentLevels
      .filter(level => numericAmount >= level.amount)
      .pop();
  };

  const recommendedLevel = getRecommendedLevel();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Dépôt de fonds</h1>
              <p className="text-gray-600 text-sm mt-1">Alimentez votre compte d'investissement</p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bannière promotion */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Augmentez vos gains</h2>
                  </div>
                  <p className="text-lg mb-4 max-w-md">
                    Déposez des fonds pour accéder à des niveaux supérieurs et maximisez vos rendements
                  </p>
                </div>
                
                <div className="hidden md:block">
                  <Gift className="w-12 h-12 opacity-80" />
                </div>
              </div>
              
              {recommendedLevel && (
                <div className="mt-4 p-4 bg-white/20 rounded-xl">
                  <p className="text-sm">
                    Avec {formatAmount(numericAmount)} CDF, vous pouvez accéder au <strong>{recommendedLevel.level}</strong>
                    <br />
                    et générer <strong>{formatAmount(recommendedLevel.dailyGain)} CDF/jour</strong>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Section Montant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                Montant à déposer
              </h2>
              
              {/* Champ de saisie */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Saisissez le montant
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl font-bold text-gray-900">CDF</span>
                  </div>
                  <input
                    type="text"
                    value={amount ? formatAmount(numericAmount) : ""}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full pl-24 pr-4 py-6 text-3xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all text-right"
                  />
                </div>
              </div>

              {/* Montants rapides */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Montants recommandés
                </h3>
                <div className="flex flex-wrap gap-3">
                  {quickAmounts.map((quickAmount) => {
                    const level = investmentLevels.find(l => l.amount === quickAmount);
                    return (
                      <button
                        key={quickAmount}
                        onClick={() => handleQuickAmount(quickAmount)}
                        className={`px-4 py-2 rounded-lg border transition-all text-left ${
                          numericAmount === quickAmount
                            ? "bg-green-50 border-green-500 text-green-600 font-semibold"
                            : "bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-600"
                        }`}
                      >
                        <div className="font-semibold">{formatAmount(quickAmount)} CDF</div>
                        {level && (
                          <div className="text-xs text-gray-500">Niveau {level.level}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Objectif recommandé */}
              {selectedMethodData && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">🎯</span>
                    <span className="text-sm font-medium text-blue-700">Objectif recommandé</span>
                  </div>
                  <p className="text-blue-900">
                    Déposez au moins {formatAmount(selectedMethodData.minAmount)} CDF pour démarrer votre investissement
                  </p>
                </div>
              )}
            </motion.div>

            {/* Section Moyen de dépôt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Moyen de dépôt
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-5 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? `border-green-500 bg-gradient-to-br ${method.color} text-white shadow-lg`
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full mb-3 ${
                        selectedMethod === method.id
                          ? "bg-white/20"
                          : "bg-gray-100"
                      }`}>
                        {method.icon}
                      </div>
                      
                      <h3 className="font-bold text-lg mb-1">{method.name}</h3>
                      <p className={`text-sm mb-3 ${
                        selectedMethod === method.id ? "text-white/90" : "text-gray-600"
                      }`}>
                        {method.description}
                      </p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Délai :</span>
                          <span className="font-semibold">{method.processingTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Frais :</span>
                          <span className={`font-semibold ${
                            method.fees === "0%" ? "text-green-500" : ""
                          }`}>
                            {method.fees}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedMethod === method.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Instructions selon le moyen sélectionné */}
            <AnimatePresence>
              {selectedMethod && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📋</span>
                    Instructions pour {selectedMethodData?.name}
                  </h3>
                  
                  {selectedMethod === "airtel" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Numéro à créditer
                          </span>
                          <button
                            onClick={() => copyToClipboard(depositInfo.airtelNumber, "airtel")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "airtel" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {depositInfo.airtelNumber}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Étapes :</h4>
                        <ol className="space-y-2 text-sm text-blue-800">
                          <li className="flex items-start gap-2">
                            <span className="font-bold">1.</span>
                            <span>Ouvrez l'application Airtel Money</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold">2.</span>
                            <span>Allez dans "Envoyer de l'argent"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold">3.</span>
                            <span>Entrez le numéro ci-dessus</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold">4.</span>
                            <span>Saisissez le montant exact : <strong>{formatAmount(totalToSend)} CDF</strong></span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {selectedMethod === "bank" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Bénéficiaire
                          </span>
                          <button
                            onClick={() => copyToClipboard(depositInfo.accountName, "beneficiary")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "beneficiary" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {depositInfo.accountName}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Numéro de compte
                          </span>
                          <button
                            onClick={() => copyToClipboard(depositInfo.accountNumber, "account")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "account" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 font-mono">
                          {depositInfo.accountNumber}
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-semibold text-yellow-900">Important</h4>
                        </div>
                        <p className="text-sm text-yellow-800">
                          Mentionnez la référence <strong>{reference || generateReference()}</strong> dans le libellé du virement
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMethod === "crypto" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Adresse de réception (USDT ERC20)
                          </span>
                          <button
                            onClick={() => copyToClipboard(depositInfo.cryptoAddress, "crypto")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "crypto" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-sm font-mono text-gray-900 break-all bg-gray-100 p-3 rounded">
                          {depositInfo.cryptoAddress}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 mx-auto mb-3 text-gray-600" />
                          <p className="text-sm text-gray-600 mb-2">
                            Scannez le QR Code pour envoyer les fonds
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <h4 className="font-semibold text-red-900">Attention</h4>
                        </div>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>• Envoyez seulement USDT (ERC20)</li>
                          <li>• Vérifiez l'adresse avant d'envoyer</li>
                          <li>• Les fonds apparaîtront après 12 confirmations</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Colonne latérale - Récapitulatif */}
          <div className="space-y-8">
            {/* Récapitulatif */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Récapitulatif
              </h2>
              
              <div className="space-y-4">
                {/* Montant déposé */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Montant à déposer</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(numericAmount)} CDF
                  </span>
                </div>
                
                {/* Frais */}
                {fees > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Frais de transaction</span>
                    <span className="text-lg font-semibold text-red-600">
                      +{formatAmount(fees)} CDF
                    </span>
                  </div>
                )}
                
                {/* Total à envoyer */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Total à envoyer</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatAmount(totalToSend)} CDF
                  </span>
                </div>
                
                {/* Moyen */}
                {selectedMethodData && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Moyen de dépôt</span>
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                      {selectedMethodData.icon}
                      {selectedMethodData.name}
                    </span>
                  </div>
                )}
                
                {/* Délai */}
                <div className="pt-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Délai : {selectedMethodData?.processingTime || "24h"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Les fonds seront crédités dès réception
                  </p>
                </div>
              </div>
              
              {/* Bouton de confirmation */}
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !numericAmount || !selectedMethod}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing || !numericAmount || !selectedMethod
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  "Procéder au dépôt"
                )}
              </button>
              
              {(!numericAmount || !selectedMethod) && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  {!numericAmount && "Saisissez un montant pour continuer"}
                  {numericAmount && !selectedMethod && "Sélectionnez un moyen de dépôt"}
                </p>
              )}
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Support & Sécurité
              </h3>
              
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Support disponible 24h/24 via WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Transactions cryptées SSL 256-bit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Vérification en 2 étapes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Historique détaillé disponible</span>
                </li>
              </ul>
              
              <button
                onClick={() => window.open('https://wa.me/243000000000', '_blank')}
                className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>💬</span>
                Contacter le support
              </button>
            </motion.div>
            
            {/* Avantages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-purple-900">Avantages du dépôt</h3>
              </div>
              
              <div className="space-y-2 text-purple-800 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Accès aux niveaux supérieurs</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Rendements quotidiens garantis</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Retraits rapides et sécurisés</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Support dédié 24h/24</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}