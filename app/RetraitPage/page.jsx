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
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";



export default function RetraitPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountBalance, setAccountBalance] = useState(1250000);
  const [withdrawalInfo, setWithdrawalInfo] = useState({
    phoneNumber: "+243 81 234 5678",
    accountName: "Pierre Martin",
    accountNumber: "CD64 3000 4000 0100 1234 5678 901",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const paymentMethods = [
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Transfert mobile instantané",
      processingTime: "Instantané",
      fees: "1.5%",
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
      fees: "0.5%",
      minAmount: 5000,
      maxAmount: 10000000,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "crypto",
      name: "Crypto-monnaie",
      icon: <Zap className="w-6 h-6" />,
      description: "Retrait en USDT/BTC",
      processingTime: "15-30min",
      fees: "0.3%",
      minAmount: 10000,
      maxAmount: 50000000,
      color: "from-amber-500 to-amber-600",
    },
  ];

  const quickAmounts = [10000, 50000, 100000, 250000, 500000];

  const calculateFees = ()=> {
    if (!amount || !selectedMethod) return 0;
    const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
    const method = paymentMethods.find(m => m.id === selectedMethod);
    
    if (!method) return 0;
    
    switch (method.id) {
      case "airtel":
        return Math.round(numericAmount * 0.015);
      case "bank":
        return Math.round(numericAmount * 0.005);
      case "crypto":
        return Math.round(numericAmount * 0.003);
      default:
        return 0;
    }
  };

  const fees = calculateFees();
  const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  const totalReceived = numericAmount - fees;
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

  const handleMaxAmount = () => {
    const maxAllowed = Math.min(
      accountBalance,
      selectedMethodData?.maxAmount || accountBalance
    );
    setAmount(maxAllowed.toString());
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateWithdrawal = () => {
    if (!numericAmount) {
      alert("Veuillez saisir un montant à retirer.");
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

    if (numericAmount > accountBalance) {
      alert(`Votre solde actuel est de ${formatAmount(accountBalance)} CDF.`);
      return false;
    }

    if (!selectedMethod) {
      alert("Veuillez sélectionner un moyen de retrait.");
      return false;
    }

    return true;
  };

  const handleWithdrawal = async () => {
    if (!validateWithdrawal()) return;

    setIsProcessing(true);

    // Simulation de traitement
    setTimeout(() => {
      setIsProcessing(false);
      
      alert(
        `✅ Retrait confirmé !\n\n` +
        `Montant : ${formatAmount(numericAmount)} CDF\n` +
        `Frais : ${formatAmount(fees)} CDF\n` +
        `Reçu : ${formatAmount(totalReceived)} CDF\n` +
        `Moyen : ${selectedMethodData?.name}\n\n` +
        `Le virement sera effectué sous ${selectedMethodData?.processingTime}.`
      );
      
      // Mettre à jour le solde
      setAccountBalance(prev => prev - numericAmount);
      
      // Redirection vers l'historique
      router.push("/transactions");
    }, 2000);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Retrait de fonds</h1>
              <p className="text-gray-600 text-sm mt-1">Retirez vos gains sur votre compte</p>
            </div>
            
            <div className="w-20"></div> {/* Spacer pour l'alignement */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bannière solde */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Solde disponible</h2>
                  </div>
                  <p className="text-3xl font-bold mb-4">
                    {formatAmount(accountBalance)} CDF
                  </p>
                </div>
                
                <button
                  onClick={handleMaxAmount}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Retirer tout
                </button>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-blue-100">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Transfert 100% sécurisé</span>
              </div>
            </motion.div>

            {/* Section Montant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Montant à retirer
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
                    className="w-full pl-24 pr-4 py-6 text-3xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-right"
                  />
                </div>
              </div>

              {/* Montants rapides */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Montants rapides
                </h3>
                <div className="flex flex-wrap gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => handleQuickAmount(quickAmount)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        numericAmount === quickAmount
                          ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                          : "bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {formatAmount(quickAmount)} CDF
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Section Moyen de retrait */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Moyen de retrait
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
                        ? `border-blue-500 bg-gradient-to-br ${method.color} text-white shadow-lg`
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
                          <span className="font-semibold">{method.fees}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Min :</span>
                          <span className="font-semibold">{formatAmount(method.minAmount)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedMethod === method.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Informations selon le moyen sélectionné */}
            <AnimatePresence>
              {selectedMethod && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Informations de retrait
                  </h3>
                  
                  {selectedMethod === "airtel" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Numéro Airtel Money
                          </span>
                          <button
                            onClick={() => copyToClipboard(withdrawalInfo.phoneNumber, "phone")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "phone" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {withdrawalInfo.phoneNumber}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Ce numéro est associé à votre compte
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMethod === "bank" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Titulaire du compte
                          </span>
                          <button
                            onClick={() => copyToClipboard(withdrawalInfo.accountName, "name")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "name" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {withdrawalInfo.accountName}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Numéro de compte
                          </span>
                          <button
                            onClick={() => copyToClipboard(withdrawalInfo.accountNumber, "account")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "account" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 font-mono">
                          {withdrawalInfo.accountNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMethod === "crypto" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Adresse de réception
                          </span>
                          <button
                            onClick={() => copyToClipboard("0x742d35Cc6634C0532925a3b844Bc9e8eE3a7b1c2", "crypto")}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedField === "crypto" ? "Copié !" : "Copier"}
                          </button>
                        </div>
                        <p className="text-sm font-mono text-gray-900 break-all">
                          0x742d35Cc6634C0532925a3b844Bc9e8eE3a7b1c2
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-center">
                          <QrCode className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                          <p className="text-sm text-gray-600">
                            Scannez le QR Code pour recevoir les fonds
                          </p>
                        </div>
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
                {/* Montant */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Montant à retirer</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(numericAmount)} CDF
                  </span>
                </div>
                
                {/* Frais */}
                {fees > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Frais de transaction</span>
                    <span className="text-lg font-semibold text-red-600">
                      -{formatAmount(fees)} CDF
                    </span>
                  </div>
                )}
                
                {/* Moyen */}
                {selectedMethodData && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Moyen de retrait</span>
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                      {selectedMethodData.icon}
                      {selectedMethodData.name}
                    </span>
                  </div>
                )}
                
                {/* Total */}
                <div className="pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total reçu</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatAmount(totalReceived)} CDF
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Le virement sera effectué sous {selectedMethodData?.processingTime || "24h"}
                  </p>
                </div>
              </div>
              
              {/* Bouton de confirmation */}
              <button
                onClick={handleWithdrawal}
                disabled={isProcessing || !numericAmount || !selectedMethod}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing || !numericAmount || !selectedMethod
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  "Confirmer le retrait"
                )}
              </button>
              
              {(!numericAmount || !selectedMethod) && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  {!numericAmount && "Saisissez un montant pour continuer"}
                  {numericAmount && !selectedMethod && "Sélectionnez un moyen de retrait"}
                </p>
              )}
            </motion.div>

            {/* Informations importantes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Informations importantes
              </h3>
              
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">Premier retrait gratuit par mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">Vérifiez vos informations de paiement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">Les retraits sont traités du lundi au vendredi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">Contactez le support en cas de problème</span>
                </li>
              </ul>
              
              <button
                onClick={() => router.push("/support")}
                className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Contacter le support
              </button>
            </motion.div>
            
            {/* Sécurité */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-blue-900">Sécurité garantie</h3>
              </div>
              
              <div className="space-y-2 text-blue-800 text-sm">
                <p>• Transactions cryptées SSL 256-bit</p>
                <p>• Vérification en 2 étapes</p>
                <p>• Surveillance 24h/24</p>
                <p>• Historique détaillé disponible</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}