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
  Smartphone as AirtelIcon,
  Smartphone as OrangeIcon,
  Smartphone as MPesaIcon,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from '@/lib/firebase';
import { financeService } from '@/lib/financeService';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';


export default function DepotPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [depositInfo, setDepositInfo] = useState({
    transactionId: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [exchangeRate] = useState(2350);
 const whatsappNumber = "+1 (450) 914-1073";
  
    // Nettoyer le numéro pour l'URL WhatsApp
    const cleanedNumber = whatsappNumber.replace(/\s|\(|\)|-/g, '')
  // NOUVEAU: États pour les portefeuilles dynamiques
  const [dynamicWallets, setDynamicWallets] = useState({
    airtel: { number: "", name: "" },
    orange: { number: "", name: "" },
    mpesa: { number: "", name: "" },
    crypto: { number: "", name: "" }
  });
  const [walletsLoading, setWalletsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserInfo({
          uid: currentUser.uid,
          email: currentUser.email,
          phone: currentUser.phoneNumber || '',
          name: currentUser.displayName || ''
        });
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // NOUVEAU: Charger les portefeuilles depuis Firestore
  useEffect(() => {
    const loadWallets = async () => {
      try {
        setWalletsLoading(true);
        const walletsQuery = query(
          collection(db, 'portefeuilles'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(walletsQuery);
        
        const wallets = {
          airtel: { number: "", name: "" },
          orange: { number: "", name: "" },
          mpesa: { number: "", name: "" },
          crypto: { number: "", name: "" }
        };

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log('Portefeuille chargé:', data);
          switch(data.provider) {
            case 'airtel':
              wallets.airtel = { number: data.number || "", name: data.name || "" };
              break;
            case 'orange':
              wallets.orange = { number: data.number || "", name: data.name || "" };
              break;
            case 'mpesa':
              wallets.mpesa = { number: data.number || "", name: data.name || "" };
              break;
            case 'crypto':
              wallets.crypto = { number: data.number || "", name: data.name || "" };
              break;
          }
        });

        setDynamicWallets(wallets);
        
        console.log("wallets  " , wallets)
        // Mettre à jour depositInfo avec les numéros dynamiques
        setDepositInfo(prev => ({
          ...prev,
          airtelNumber: wallets.airtel.number || "0991381689",
          orangeNumber: wallets.orange.number || "0856932804",
          mpesaNumber: wallets.mpesa.number || "0861435993"
        }));
      } catch (error) {
        console.error('Erreur chargement portefeuilles:', error);
      } finally {
        setWalletsLoading(false);
      }
    };

    loadWallets();
  }, []);

  const paymentMethods = [
    {
      id: "orange",
      name: "Orange Money",
      icon: <OrangeIcon className="w-6 h-6" />,
      description: "Paiement mobile Orange",
      processingTime: "Instantané",
      fees: "0%",
      minAmount: 6000,
      maxAmount: 5000000,
      color: "from-orange-500 to-orange-600",
      ussdCode: "*144#",
      agentNumber: dynamicWallets.orange.number || "0856932804",
      instructions: [
        "1. cadran: *144#",
        "2. Sélectionnez 2:CDF",
        "3. Sélectionnez 3:Je retire l'argent",
        "4. Sélectionnez 1:Retrait Agent(Numéro ou code agent)",
        "5. Entrer Numéro: " + (dynamicWallets.orange.number || "0856932804"),
        "6. Montant CDF: [montant]",
        "7. Entrer le Code Pin pour confirmer"
      ]
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <AirtelIcon className="w-6 h-6" />,
      description: "Paiement mobile Airtel",
      processingTime: "Instantané",
      fees: "0%",
      minAmount: 6000,
      maxAmount: 5000000,
      color: "from-red-500 to-red-600",
      ussdCode: "*501#",
      agentNumber: dynamicWallets.airtel.number || "0991381689",
      instructions: [
        "1. cadran: *501#",
        "2. Sélectionnez 2.CDF",
        "3. Sélectionnez 2.Retrait d'argent",
        "4. Sélectionnez 1.Aupres d'un Agent",
        "5. Entrer Code d'agent/numero: " + (dynamicWallets.airtel.number || "0991381689"),
        "6. Entrer montant: [montant]",
        "7. Sélectionnez 1.Oui",
        "8. Entrez votre PIN"
      ]
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: <MPesaIcon className="w-6 h-6" />,
      description: "Paiement mobile M-Pesa",
      processingTime: "Instantané",
      fees: "0%",
      minAmount: 6000,
      maxAmount: 5000000,
      color: "from-green-500 to-green-600",
      ussdCode: "*150*60#",
      agentNumber: dynamicWallets.mpesa.number || "0861435993", 
      instructions: [
        "1. Composez le code : Tapez *1122# sur votre téléphone et appuyez sur le bouton d'appel.",
        "2. Choisissez votre compte : Sélectionnez votre compte en Francs Congolais (FC).",
        "3. Accédez aux paiements : Choisissez l'option « Mes Paiements » (souvent le numéro 5).",
        "4. Sélectionnez l'option marchand : Cherchez et choisissez « Payer un Marchand » ou une option similaire, puis (motif), sur motif vous pouvez mettre 'achat produit'. Si on demande le nom du produit, mettez 'PackShop' ou '1' seulement.",
        "5. Entrez les détails : Saisissez le montant à payer, puis copiez le numéro indiqué en haut.",
        "6. Confirmez la transaction : Vérifiez les détails et entrez votre code PIN M-Pesa pour valider le paiement.",
        "7. M-Pesa vous enverra une notification de paiement contenant aussi l'ID de recherche que vous devrez insérer en haut ou à l'endroit recommandé."
      ]
    },
     {
      id: "crypto",
      name: "Crypto-monnaie",
      icon: <Zap className="w-6 h-6" />,
      description: "Dépôt en USDT BEP20",
      processingTime: "15-30min",
      fees: "0%",
      minAmount: 1,
      maxAmount: 17857,
      color: "from-amber-500 to-amber-600",
      walletAddress: "BEP20",
      network: "BEP20",
      coin: "USDT",
      agentNumber: dynamicWallets.crypto.number || "BEP20",
      instructions: [
        "1. Ouvrez votre portefeuille crypto (Trust Wallet, Binance, MetaMask, etc.)",
        "2. Sélectionnez USDT (Tether) pour l'envoi",
        "3. Vérifiez que le réseau est bien BEP20 (Binance Smart Chain)",
        "4. Copiez l'adresse de dépôt ci-dessous",
        "5. Collez l'adresse dans le champ 'destinataire'",
        "6. Entrez le montant exact en USDT",
        "7. Vérifiez que le montant correspond au montant en CDF affiché",
        "8. Confirmez la transaction et payez les frais réseau (BSC)",
        "9. Après l'envoi, notez l'ID de transaction (TXID/Hash)",
        "10. Saisissez cet ID dans le champ 'ID de transaction' ci-dessous"
      ]
    },
  ];

  const quickAmounts = [30000, 90000, 170000, 245000, 500000];
  const investmentLevels = [
    { amount: 30000, level: "N1", dailyGain: 600, dailyReturnRate: 0.02 }, // 2% de 30,000 = 600
    { amount: 90000, level: "N2", dailyGain: 1800, dailyReturnRate: 0.02 }, // 2% de 90,000 = 1,800
    { amount: 170000, level: "N3", dailyGain: 3400, dailyReturnRate: 0.02 }, // 2% de 170,000 = 3,400
    { amount: 245000, level: "N4", dailyGain: 6125, dailyReturnRate: 0.025 }, // 2.5% de 245,000 = 6,125
    { amount: 500000, level: "N5", dailyGain: 12500, dailyReturnRate: 0.025 }, // 2.5% de 500,000 = 12,500
  ];

  const calculateFees = () => {
    if (!amount || !selectedMethod) return 0;
    const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
    const method = paymentMethods.find(m => m.id === selectedMethod);
    
    if (!method) return 0;
    return 0;
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TRX${timestamp.slice(-8)}${random}`;
  };

  const fees = calculateFees();
  const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  const totalToSend = numericAmount + fees;
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  const formatAmount = (value) => {
    return value.toLocaleString("fr-FR");
  };

  const convertUsdtToCdf = (usdt) => {
    return Math.floor(usdt * exchangeRate);
  };

  const convertCdfToUsdt = (cdf) => {
    return (cdf / exchangeRate).toFixed(2);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
    if (selectedMethod === "crypto" && value) {
      const usdtValue = convertCdfToUsdt(parseInt(value));
      setUsdtAmount(usdtValue);
    }
  };

  const handleUsdtAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setUsdtAmount(value);
    if (value && !isNaN(value)) {
      const cdfValue = convertUsdtToCdf(parseFloat(value));
      setAmount(cdfValue.toString());
    } else {
      setAmount("");
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    if (selectedMethod === "crypto") {
      const usdtValue = convertCdfToUsdt(quickAmount);
      setUsdtAmount(usdtValue);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateDeposit = () => {
    if (selectedMethod !== "crypto") {
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
    }

    if (selectedMethod === "crypto") {
      if (!usdtAmount || parseFloat(usdtAmount) < selectedMethodData?.minAmount) {
        alert(`Le montant minimum est de ${selectedMethodData?.minAmount} USDT (environ ${formatAmount(selectedMethodData?.minAmount * exchangeRate)} CDF).`);
        return false;
      }

      if (parseFloat(usdtAmount) > selectedMethodData?.maxAmount) {
        alert(`Le montant maximum est de ${selectedMethodData?.maxAmount} USDT (environ ${formatAmount(selectedMethodData?.maxAmount * exchangeRate)} CDF).`);
        return false;
      }
    }

    if (!selectedMethod) {
      alert("Veuillez sélectionner un moyen de dépôt.");
      return false;
    }

    if (!transactionId.trim()) {
      alert("Veuillez saisir l'ID de transaction.");
      return false;
    }

    return true;
  };

 const handleDeposit = async () => {
    if (!validateDeposit()) return;
    
    if (!user) {
      alert('Veuillez vous connecter pour effectuer un dépôt.');
      router.push('/auth/login');
      return;
    }

    setIsProcessing(true);

    try {
      let finalAmount = numericAmount;
      let finalUsdtAmount = null;
      
      if (selectedMethod === "crypto") {
        finalAmount = convertUsdtToCdf(parseFloat(usdtAmount));
        finalUsdtAmount = parseFloat(usdtAmount);
      }

      const depositData = {
        amount: finalAmount,
        usdtAmount: finalUsdtAmount,
        paymentMethod: selectedMethodData?.name || '',
        agentNumber: getPhoneNumber(),
        agentName: getAgentName(),
        transactionId: transactionId,
        fees: fees,
        totalAmount: selectedMethod === "crypto" ? finalAmount : totalToSend,
        userPhone: userInfo.phone,
        userEmail: userInfo.email,
        userName: userInfo.name,
        exchangeRate: selectedMethod === "crypto" ? exchangeRate : null
      };

      const result = await financeService.createDeposit(userInfo.uid, depositData);

      setIsProcessing(false);

      if (result.success) {
        let successMessage = `✅ Dépôt soumis avec succès !\n\n` +
          `ID Transaction: ${result.depositId}\n`;
        
        if (selectedMethod === "crypto") {
          successMessage += `Montant: ${usdtAmount} USDT (≈ ${formatAmount(finalAmount)} CDF)\n`;
        } else {
          successMessage += `Montant: ${formatAmount(finalAmount)} CDF\n`;
        }
        
        successMessage += `Moyen: ${selectedMethodData?.name}\n`;
        successMessage += `Nom Agent: ${getAgentName()}\n`;
        
        if (selectedMethod === "crypto") {
          successMessage += `Adresse: ${getPhoneNumber()}\n`;
        } else {
          successMessage += `Numéro Agent: ${getPhoneNumber()}\n`;
        }
        
        successMessage += `\nVotre dépôt est en attente de validation.\n` +
          `Vous serez notifié lorsque les fonds seront crédités.`;
        
        alert(successMessage);
        
        setAmount("");
        setUsdtAmount("");
        setSelectedMethod(null);
        setTransactionId("");
        router.push('/');
      } else {
        alert(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      setIsProcessing(false);
      alert(`❌ Erreur lors de la soumission: ${error.message}`);
    }
  };

  const getRecommendedLevel = () => {
   return  investmentLevels.find(level => level.amount === numericAmount)
  };

  const getPhoneNumber = () => {
    if (!selectedMethod) return "";
    switch(selectedMethod) {
      case "orange": return dynamicWallets.orange.number || "0856932804";
      case "airtel": return dynamicWallets.airtel.number || "0991381689";
      case "mpesa": return dynamicWallets.mpesa.number || "0861435993";
      case "crypto": return dynamicWallets.crypto.number || "BEP20";
      default: return "";
    }
  };

  // NOUVEAU: Récupérer le nom associé au portefeuille
  const getAgentName = () => {
    if (!selectedMethod) return "";
    switch(selectedMethod) {
      case "orange": return dynamicWallets.orange.name || "Agent Orange";
      case "airtel": return dynamicWallets.airtel.name || "Agent Airtel";
      case "mpesa": return dynamicWallets.mpesa.name || "Agent M-Pesa";
      case "crypto": return dynamicWallets.crypto.name || "Portefeuille Crypto";
      default: return "";
    }
  };

  const getInstructions = () => {
    if (!selectedMethodData) return [];
    return selectedMethodData.instructions.map(instruction => 
      instruction.replace("[montant]", selectedMethod === "crypto" ? usdtAmount : formatAmount(totalToSend))
    );
  };

  const recommendedLevel = getRecommendedLevel();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
          <div className="lg:col-span-2 space-y-8">
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
      <strong>Niveau {recommendedLevel.level}</strong> • {(recommendedLevel.dailyReturnRate * 100).toFixed(1)}% journalier
      <br />
      Gain quotidien : <strong>{formatAmount(recommendedLevel.dailyGain)} CDF</strong>
      <br />
      Gain mensuel : <strong>{formatAmount(recommendedLevel.dailyGain * 30)} CDF</strong>
    </p>
  </div>
)}
            </motion.div>

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
              
              {selectedMethod !== "crypto" && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Saisissez le montant (minimum 6,000 CDF)
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
              )}
              
              {selectedMethod === "crypto" && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Saisissez le montant en USDT (minimum 1 USDT)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-2xl font-bold text-gray-900">USDT</span>
                    </div>
                    <input
                      type="text"
                      value={usdtAmount}
                      onChange={handleUsdtAmountChange}
                      placeholder="0.00"
                      className="w-full pl-24 pr-4 py-6 text-3xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-right"
                    />
                  </div>
                  
                  {usdtAmount && !isNaN(usdtAmount) && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-800 font-medium">Équivalent en CDF :</span>
                        <span className="text-2xl font-bold text-amber-700">
                          {formatAmount(convertUsdtToCdf(parseFloat(usdtAmount)))} CDF
                        </span>
                      </div>
                      <p className="text-sm text-amber-600 mt-2">
                        Taux de change : 1 USDT ≈ {exchangeRate.toLocaleString("fr-FR")} CDF
                      </p>
                    </div>
                  )}
                </div>
              )}

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
        <div className="text-xs text-gray-500">
          Niveau {level.level} • {(level.dailyReturnRate * 100).toFixed(1)}%
        </div>
      )}
      {level && (
        <div className="text-xs text-green-600">
          Gain: {formatAmount(level.dailyGain)} CDF/jour
        </div>
      )}
      {selectedMethod === "crypto" && (
        <div className="text-xs text-amber-600">
          ≈ {convertCdfToUsdt(quickAmount)} USDT
        </div>
      )}
    </button>
  );
})}
                </div>
              </div>

              {selectedMethodData && (
                <div className={`mt-6 p-4 rounded-xl border ${
                  selectedMethod === "crypto" 
                    ? "bg-amber-50 border-amber-200" 
                    : "bg-blue-50 border-blue-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={selectedMethod === "crypto" ? "text-amber-600" : "text-blue-600"}>🎯</span>
                    <span className={`text-sm font-medium ${
                      selectedMethod === "crypto" ? "text-amber-700" : "text-blue-700"
                    }`}>
                      Objectif recommandé
                    </span>
                  </div>
                  <p className={selectedMethod === "crypto" ? "text-amber-900" : "text-blue-900"}>
                    {selectedMethod === "crypto" 
                      ? `Déposez au moins ${selectedMethodData.minAmount} USDT (≈ ${formatAmount(selectedMethodData.minAmount * exchangeRate)} CDF) pour démarrer`
                      : `Déposez au moins ${formatAmount(selectedMethodData.minAmount)} CDF pour démarrer votre investissement`
                    }
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Canal de paiement
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      if (method.id === "crypto" && amount) {
                        const usdtValue = convertCdfToUsdt(numericAmount);
                        setUsdtAmount(usdtValue);
                      } else if (method.id !== "crypto") {
                        setUsdtAmount("");
                      }
                    }}
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
                        <div className="flex items-center justify-between">
                          <span>Min :</span>
                          <span className="font-semibold">
                            {method.id === "crypto" 
                              ? `${method.minAmount} USDT` 
                              : `${formatAmount(method.minAmount)} FC`
                            }
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

            <AnimatePresence>
              {selectedMethod && selectedMethodData && (
                (selectedMethod === "crypto" 
                  ? parseFloat(usdtAmount) >= selectedMethodData.minAmount
                  : numericAmount >= selectedMethodData.minAmount
                ) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6 text-center border-b pb-4">
                    {selectedMethod === "crypto" 
                      ? `Instructions de dépôt - ${usdtAmount} USDT`
                      : `Instructions de recharge - ${formatAmount(totalToSend)} CDF`
                    }
                  </h3>
                  
                  <div className="space-y-6">
                    {selectedMethod === "crypto" ? (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Étape 1</h4>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Copier l'adresse de dépôt :</p>
                          <div className="flex items-center justify-between">
                            <div>
                              {/* NOUVEAU: Afficher le nom dynamique */}
                              <p className="text-lg font-bold text-gray-900">{getAgentName()}</p>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Portefeuille recharge en USDT BEP20 :</p>
                                <p className="text-lg font-mono text-gray-900 bg-gray-100 p-2 rounded break-all">
                                  0xBFd95ed5A4a1E789fC36CB00E8A3Ea0314E246A8
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Réseau : <span className="font-semibold">BEP20</span></p>
                                <p className="text-sm text-gray-500">Crypto : <span className="font-semibold">USDT</span></p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Montant à envoyer : <span className="font-bold text-amber-600">{usdtAmount} USDT</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  (≈ {formatAmount(convertUsdtToCdf(parseFloat(usdtAmount)))} CDF)
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard("0xBFd95ed5A4a1E789fC36CB00E8A3Ea0314E246A8", "cryptoAddress")}
                              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              {copiedField === "cryptoAddress" ? "Copié !" : "Copier"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Étape 1</h4>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Copier le compte du portefeuille:</p>
                          <div className="flex items-center justify-between">
                            <div>
                              {/* NOUVEAU: Afficher le nom dynamique */}
                              <p className="text-lg font-bold text-gray-900">{getAgentName()}</p>
                              <p className="text-xl font-bold text-gray-900 mt-1">{getPhoneNumber()}</p>
                              <p className="text-sm text-gray-500 mt-1">(Numéro Agent)</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(getPhoneNumber(), "phone")}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              {copiedField === "phone" ? "Copié !" : "Copier"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Étape 2</h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {selectedMethod === "crypto" 
                            ? "Entrez l'ID de transaction (TXID/Hash)"
                            : "Entrez l'ID de transaction"
                          }
                        </p>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder={selectedMethod === "crypto" 
                            ? "Saisissez le TXID/Hash de votre transaction"
                            : "Saisissez l'ID de votre transaction"
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {selectedMethod === "crypto"
                            ? "Cet ID se trouve dans l'historique de votre portefeuille crypto"
                            : "Cet ID se trouve dans le SMS de confirmation de votre opération"
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {selectedMethod === "crypto" ? "Étapes de transfert :" : "Étapes de paiement :"}
                      </h4>
                      <div className={`rounded-xl p-4 border ${
                        selectedMethod === "crypto" 
                          ? "bg-amber-50 border-amber-200" 
                          : "bg-blue-50 border-blue-200"
                      }`}>
                        <p className={`text-sm font-medium mb-3 ${
                          selectedMethod === "crypto" ? "text-amber-900" : "text-blue-900"
                        }`}>
                          {selectedMethod === "crypto"
                            ? "Transfert USDT BEP20 vers notre portefeuille"
                            : `De ${selectedMethodData.name} à ${selectedMethodData.name}`
                          }
                        </p>
                        <div className="space-y-2">
                          {getInstructions().map((instruction, index) => (
                            <p key={index} className={`text-sm ${
                              selectedMethod === "crypto" ? "text-amber-800" : "text-blue-800"
                            }`}>
                              {instruction}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-xl p-4 border ${
                      selectedMethod === "crypto" 
                        ? "bg-amber-50 border-amber-200" 
                        : "bg-yellow-50 border-yellow-200"
                    }`}>
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${
                          selectedMethod === "crypto" ? "text-amber-600" : "text-yellow-600"
                        }`} />
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            selectedMethod === "crypto" ? "text-amber-900" : "text-yellow-900"
                          }`}>
                            {selectedMethod === "crypto" 
                              ? "⚠️ Instructions importantes pour les dépôts crypto"
                              : "Instructions importantes"
                            }
                          </h4>
                          <ul className={`text-sm space-y-1 ${
                            selectedMethod === "crypto" ? "text-amber-800" : "text-yellow-800"
                          }`}>
                            {selectedMethod === "crypto" ? (
                              <>
                                <li>• Envoyez uniquement des USDT sur le réseau BEP20 (Binance Smart Chain)</li>
                                <li>• N'envoyez pas d'autres cryptomonnaies à cette adresse</li>
                                <li>• Vérifiez 3 fois l'adresse (BEP20) avant d'envoyer</li>
                                <li>• Les transactions peuvent prendre 15-30 minutes</li>
                                <li>• Gardez votre TXID/Hash comme preuve de transaction</li>
                                <li>• Les frais réseau (BSC) sont à votre charge</li>
                                <li>• Contactez le support en cas de problème ou de retard</li>
                                <li>• Le montant minimum est de 1 USDT</li>
                              </>
                            ) : (
                              <>
                                <li>• Le dépôt minimum est de 6 000 CDF</li>
                                <li>• Vérifiez attentivement le numéro agent avant de confirmer</li>
                                <li>• Après un virement réussi, saisissez le code de vérification (ID de transaction)</li>
                                <li>• Si problème, contactez le support avec votre ID de transaction</li>
                                <li>• Ne transférez jamais d'argent à des particuliers</li>
                                <li>• Utilisez seulement les numéros agents officiels</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Dépôt
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    {selectedMethod === "crypto" ? "Montant en USDT" : "Montant à déposer"}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {selectedMethod === "crypto" 
                        ? `${usdtAmount} USDT`
                        : `${formatAmount(numericAmount)} CDF`
                      }
                    </span>
                    {selectedMethod === "crypto" && usdtAmount && (
                      <p className="text-sm text-gray-500 mt-1">
                        ≈ {formatAmount(convertUsdtToCdf(parseFloat(usdtAmount)))} CDF
                      </p>
                    )}
                  </div>
                </div>
                
                {fees > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Frais de transaction</span>
                    <span className="text-lg font-semibold text-red-600">
                      +{formatAmount(fees)} CDF
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Total à envoyer</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${
                      selectedMethod === "crypto" ? "text-amber-600" : "text-green-600"
                    }`}>
                      {selectedMethod === "crypto" 
                        ? `${usdtAmount} USDT`
                        : `${formatAmount(totalToSend)} CDF`
                      }
                    </span>
                    {selectedMethod === "crypto" && usdtAmount && (
                      <p className="text-sm text-gray-500 mt-1">
                        ≈ {formatAmount(convertUsdtToCdf(parseFloat(usdtAmount)))} CDF
                      </p>
                    )}
                  </div>
                </div>
                
                {selectedMethodData && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Moyen de dépôt</span>
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                      {selectedMethodData.icon}
                      {selectedMethodData.name}
                    </span>
                  </div>
                )}
                
                {selectedMethod && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">
                        {selectedMethod === "crypto" ? "Adresse de dépôt" : "Numéro Agent"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(getPhoneNumber(), "summary")}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copier
                      </button>
                    </div>
                    {selectedMethod === "crypto" ? (
                      <>
                        <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-2 rounded mt-1">
                          {getPhoneNumber()}
                        </p>
                        <div className="mt-2 text-xs text-gray-600">
                          <p>Réseau: <span className="font-semibold">BEP20</span></p>
                          <p>Crypto: <span className="font-semibold">USDT</span></p>
                          {/* NOUVEAU: Afficher le nom */}
                          <p>Nom: <span className="font-semibold">{getAgentName()}</span></p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getPhoneNumber()}
                        </p>
                        {/* NOUVEAU: Afficher le nom */}
                        <p className="text-xs text-gray-500 mt-1">
                          Nom: {getAgentName()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {transactionId && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">
                        {selectedMethod === "crypto" ? "TXID/Hash" : "ID Transaction"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transactionId, "transaction")}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copier
                      </button>
                    </div>
                    <p className="text-sm font-mono text-gray-900 truncate">
                      {transactionId}
                    </p>
                  </div>
                )}
                
                {selectedMethodData && selectedMethod !== "crypto" && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Code USSD</span>
                      <button
                        onClick={() => copyToClipboard(selectedMethodData.ussdCode, "ussd")}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copier
                      </button>
                    </div>
                    <p className="text-sm font-mono text-gray-900 truncate">
                      {selectedMethodData.ussdCode}
                    </p>
                  </div>
                )}
                
                {selectedMethod === "crypto" && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taux de change</span>
                      <span className="text-sm font-semibold text-gray-900">
                        1 USDT = {exchangeRate.toLocaleString("fr-FR")} CDF
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="pt-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Délai : {selectedMethodData?.processingTime || "Instantané"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Les fonds seront crédités dès réception et vérification
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleDeposit}
                disabled={isProcessing || 
                  (selectedMethod === "crypto" 
                    ? !usdtAmount || parseFloat(usdtAmount) < (selectedMethodData?.minAmount || 0)
                    : !numericAmount || numericAmount < (selectedMethodData?.minAmount || 0)
                  ) || 
                  !selectedMethod || 
                  !transactionId
                }
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing || 
                  (selectedMethod === "crypto" 
                    ? !usdtAmount || parseFloat(usdtAmount) < (selectedMethodData?.minAmount || 0)
                    : !numericAmount || numericAmount < (selectedMethodData?.minAmount || 0)
                  ) || 
                  !selectedMethod || 
                  !transactionId
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : selectedMethod === "crypto"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  "Soumettre"
                )}
              </button>
              
              {(selectedMethod === "crypto" 
                ? (!usdtAmount || !selectedMethod || !transactionId)
                : (!numericAmount || !selectedMethod || !transactionId)
              ) && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  {selectedMethod === "crypto"
                    ? !usdtAmount && "Saisissez un montant en USDT pour continuer"
                    : !numericAmount && "Saisissez un montant pour continuer"
                  }
                  {((selectedMethod === "crypto" && usdtAmount) || (selectedMethod !== "crypto" && numericAmount)) && !selectedMethod && "Sélectionnez un moyen de dépôt"}
                  {((selectedMethod === "crypto" && usdtAmount) || (selectedMethod !== "crypto" && numericAmount)) && selectedMethod && !transactionId && "Saisissez l'ID de transaction"}
                </p>
              )}
            </motion.div>

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
                {selectedMethod === "crypto" && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Support spécialisé crypto disponible</span>
                  </li>
                )}
              </ul>
        
              <button
                onClick={() => window.open(`https://wa.me/${cleanedNumber}`, '_blank')}
                className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>💬</span>
                Contacter le support
              </button>
            </motion.div>
            
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
                {selectedMethod === "crypto" && (
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Dépôt en crypto sans intermédiaire</span>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}