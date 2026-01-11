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
  ChevronRight,
  Zap,
  Smartphone as AirtelIcon,
  Smartphone as OrangeIcon,
  Smartphone as MPesaIcon,
  Edit2,
  Save,
  X,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from '@/lib/firebase';
import { financeService } from '@/lib/financeService';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function RetraitPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempWalletInfo, setTempWalletInfo] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [userInfo, setUserInfo] = useState({
    uid: "",
    email: "",
    phone: "",
    name: ""
  });
  const [recipientName, setRecipientName] = useState("");
  
  // NOUVEAU: États pour les agents dynamiques
  const [dynamicAgents, setDynamicAgents] = useState({
    airtelAgent: { number: "", name: "" },
    orangeAgent: { number: "", name: "" },
    mpesaAgent: { number: "", name: "" }
  });
  const [agentsLoading, setAgentsLoading] = useState(true);
  
  const [agentsInfo, setAgentsInfo] = useState({
    airtelAgent: "0986343739",
    orangeAgent: "0841366703",
    mpesaAgent: "0971234567",
  });
  
  const [linkedWallet, setLinkedWallet] = useState({
    provider: "airtel",
    number: "+243 81 234 5678",
  });

  const [cryptoAddress, setCryptoAddress] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserInfo({
          uid: currentUser.uid,
          email: currentUser.email,
          phone: currentUser.phoneNumber || '',
          name: currentUser.displayName || ''
        });

        try {
          const walletRef = doc(db, 'wallets', currentUser.uid);
          const walletSnap = await getDoc(walletRef);
          
          if (walletSnap.exists()) {
            const walletData = walletSnap.data();
            const availableBalance = walletData.balances?.wallet?.amount || 0;
            setAccountBalance(availableBalance);
          } else {
            setAccountBalance(0);
          }
        } catch (error) {
          console.error('Erreur chargement solde:', error);
          setAccountBalance(0);
        }
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // NOUVEAU: Charger les agents depuis Firestore
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setAgentsLoading(true);
        const agentsQuery = query(
          collection(db, 'portefeuilles'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(agentsQuery);
        
        const agents = {
          airtelAgent: { number: "", name: "" },
          orangeAgent: { number: "", name: "" },
          mpesaAgent: { number: "", name: "" }
        };

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          switch(data.provider) {
            case 'airtel':
              agents.airtelAgent = { number: data.number || "", name: data.name || "" };
              break;
            case 'orange':
              agents.orangeAgent = { number: data.number || "", name: data.name || "" };
              break;
            case 'mpesa':
              agents.mpesaAgent = { number: data.number || "", name: data.name || "" };
              break;
          }
        });

        setDynamicAgents(agents);
        
        // Mettre à jour agentsInfo avec les numéros dynamiques
        setAgentsInfo({
          airtelAgent: agents.airtelAgent.number || "0986343739",
          orangeAgent: agents.orangeAgent.number || "0841366703",
          mpesaAgent: agents.mpesaAgent.number || "0971234567",
        });
      } catch (error) {
        console.error('Erreur chargement agents:', error);
      } finally {
        setAgentsLoading(false);
      }
    };

    loadAgents();
  }, []);

  const paymentMethods = [
    {
      id: "orange",
      name: "Orange Money",
      icon: <OrangeIcon className="w-6 h-6" />,
      description: "Transfert mobile Orange",
      processingTime: "Moins de 30min",
      fees: "10%",
      minAmount: 3000,
      maxAmount: 5000000,
      color: "from-orange-500 to-orange-600",
      ussdCode: "*144#",
      agentNumber: dynamicAgents.orangeAgent.number || "0841366703",
      instructions: [
        "1. cadran: *144#",
        "2. Sélectionnez 2:CDF",
        "3. Sélectionnez 3:Je retire l'argent",
        "4. Sélectionnez 1:Retrait Agent(Numéro ou code agent)",
        "5. Entrer Numéro: " + (dynamicAgents.orangeAgent.number || "0841366703"),
        "6. Montant CDF: [montant]",
        "7. Entrer le Code Pin pour confirmer"
      ]
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <AirtelIcon className="w-6 h-6" />,
      description: "Transfert mobile Airtel",
      processingTime: "Moins de 30min",
      fees: "10%",
      minAmount: 3000,
      maxAmount: 5000000,
      color: "from-red-500 to-red-600",
      ussdCode: "*501#",
      agentNumber: dynamicAgents.airtelAgent.number || "0986343739",
      instructions: [
        "1. cadran: *501#",
        "2. Sélectionnez 2.CDF",
        "3. Sélectionnez 2.Retrait d'argent",
        "4. Sélectionnez 1.Aupres d'un Agent",
        "5. Entrer Code d'agent/numero: " + (dynamicAgents.airtelAgent.number || "0986343739"),
        "6. Entrer montant: [montant]",
        "7. Sélectionnez 1.Oui",
        "8. Entrez votre PIN"
      ]
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: <MPesaIcon className="w-6 h-6" />,
      description: "Transfert mobile M-Pesa",
      processingTime: "Moins de 30min",
      fees: "10%",
      minAmount: 3000,
      maxAmount: 5000000,
      color: "from-green-500 to-green-600",
      ussdCode: "*150*60#",
      agentNumber: dynamicAgents.mpesaAgent.number || "0971234567",
      instructions: [
        "1. Ouvrez l'application M-Pesa",
        "2. Sélectionnez 'Envoyer de l'argent'",
        "3. Entrez le numéro: " + (dynamicAgents.mpesaAgent.number || "0971234567"),
        "4. Saisissez le montant: [montant] CDF",
        "5. Confirmez la transaction",
        "6. Entrez votre PIN pour valider"
      ]
    },
    {
      id: "crypto",
      name: "Crypto (BEP20)",
      fees: "10%",
      icon: <Zap className="w-6 h-6" />,
      description: "Transfert en crypto BEP20",
      processingTime: "15-30min",
      fees: "10%",
      minAmount: 30000,
      maxAmount: 50000000,
      color: "from-amber-500 to-amber-600",
      ussdCode: "BEP20",
      agentNumber: "Crypto",
      instructions: [
        "1. Préparez votre adresse BEP20 valide",
        "2. Saisissez l'adresse BEP20 ci-dessous",
        "3. Vérifiez l'adresse avant confirmation",
        "4. Confirmez le retrait pour générer la demande",
        "5. Nous vous enverrons les fonds à cette adresse"
      ]
    },
  ];

  const quickAmounts = [10000, 50000, 100000, 250000, 500000];

  const calculateFees = () => {
    if (!amount || !selectedMethod) return 0;
    const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
    
    if (selectedMethod === "crypto") {
      return Math.round(numericAmount * 0.05);
    }
    return Math.round(numericAmount * 0.10);
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `WDR${timestamp.slice(-8)}${random}`;
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
    
    if (value && parseInt(value) >= 3000) {
      if (!transactionId) {
        setTransactionId(generateTransactionId());
      }
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    setTransactionId(generateTransactionId());
  };

  const handleMaxAmount = () => {
    const maxAllowed = Math.min(
      accountBalance,
      selectedMethodData?.maxAmount || accountBalance
    );
    setAmount(maxAllowed.toString());
    setTransactionId(generateTransactionId());
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // NOUVEAU: Récupérer le nom de l'agent
  const getAgentName = () => {
    if (!selectedMethod) return "";
    switch(selectedMethod) {
      case "orange": return dynamicAgents.orangeAgent.name || "Agent Orange";
      case "airtel": return dynamicAgents.airtelAgent.name || "Agent Airtel";
      case "mpesa": return dynamicAgents.mpesaAgent.name || "Agent M-Pesa";
      default: return "";
    }
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

    if (selectedMethod === "crypto") {
      if (!cryptoAddress.trim()) {
        alert("Veuillez saisir votre adresse BEP20.");
        return false;
      }
      
      if (!cryptoAddress.startsWith("0x") || cryptoAddress.length !== 42) {
        alert("Veuillez saisir une adresse BEP20 valide (commence par 0x et fait 42 caractères).");
        return false;
      }
    } else {
      if (!recipientName.trim()) {
        alert("Veuillez saisir le nom du bénéficiaire.");
        return false;
      }
    }

    return true;
  };

  const handleWithdrawal = async () => {
    if (!validateWithdrawal()) return;

    if (!userInfo.uid) {
      alert('Veuillez vous connecter pour effectuer un retrait.');
      router.push('/auth/login');
      return;
    }

    setIsProcessing(true);

    try {
      const withdrawalData = {
        amount: numericAmount,
        fees: fees,
        netAmount: totalReceived,
        paymentMethod: selectedMethodData?.name || '',
        recipientPhone: selectedMethod === "crypto" ? "" : linkedWallet.number,
        recipientName: selectedMethod === "crypto" ? "" : recipientName,
        cryptoAddress: selectedMethod === "crypto" ? cryptoAddress : "",
        agentNumber: getAgentNumber(),
        agentName: getAgentName(),
        userPhone: userInfo.phone,
        userEmail: userInfo.email,
        userName: userInfo.name,
        transactionId: selectedMethod !== "crypto" ? transactionId : null
      };

      const result = await financeService.createWithdrawal(userInfo.uid, withdrawalData);

      setIsProcessing(false);

      if (result.success) {
        let message = `✅ Demande de retrait soumise !\n\n` +
          `ID: ${result.withdrawalId}\n` +
          `Montant: ${formatAmount(numericAmount)} CDF\n` +
          `Frais: ${formatAmount(fees)} CDF\n` +
          `À recevoir: ${formatAmount(totalReceived)} CDF\n` +
          `Moyen: ${selectedMethodData?.name}\n` +
          `Agent: ${getAgentName()}\n`;
        
        if (selectedMethod === "crypto") {
          message += `Adresse: ${cryptoAddress}\n\n`;
        } else {
          message += `Numéro: ${linkedWallet.number}\n` +
                     `Nom: ${recipientName}\n\n`;
        }
        
        message += `Votre demande est en attente de validation.\n` +
          `Le virement sera effectué après approbation admin.`;
        
        alert(message);
        
        setAmount("");
        setSelectedMethod(null);
        setCryptoAddress("");
        setRecipientName(userInfo.name || '');
      } else {
        alert(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      setIsProcessing(false);
      alert(`❌ Erreur lors de la soumission: ${error.message}`);
    }
  };

  const handleEditWallet = () => {
    setTempWalletInfo(linkedWallet.number);
    setIsEditing(true);
  };

  const handleSaveWallet = () => {
    if (tempWalletInfo.trim() === "") {
      alert("Veuillez saisir un numéro valide.");
      return;
    }

    setLinkedWallet({
      ...linkedWallet,
      number: tempWalletInfo
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const changeLinkedWallet = (provider) => {
    if (provider === "crypto") {
      setLinkedWallet({
        provider: "crypto",
        number: "Adresse BEP20 à saisir"
      });
    } else {
      setLinkedWallet({
        provider: provider,
        number: provider === "orange" ? "+243 89 876 5432" : 
                provider === "airtel" ? "+243 81 234 5678" : 
                "+243 97 123 4567"
      });
    }
    setSelectedMethod(provider);
    
    if (provider !== "crypto") {
      setCryptoAddress("");
    }
  };

  const getInstructions = () => {
    if (!selectedMethodData) return [];
    return selectedMethodData.instructions.map(instruction => 
      instruction.replace("[montant]", formatAmount(totalReceived))
    );
  };

  const getAgentNumber = () => {
    if (!selectedMethodData) return "";
    return selectedMethodData.agentNumber;
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Retrait de fonds</h1>
              <p className="text-gray-600 text-sm mt-1">Retirez vos gains sur votre compte</p>
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
                  <p className="text-blue-100 text-sm">
                    Solde actuel pour retraits et investissements
                  </p>
                </div>
                
                <button
                  onClick={handleMaxAmount}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                  disabled={accountBalance <= 0}
                >
                  Retirer tout
                </button>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-blue-100">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Transfert 100% sécurisé</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
                {selectedMethod === "crypto" ? "Adresse de réception Crypto" : "Portefeuille de réception"}
              </h2>
              
              <p className="text-gray-600 mb-6 text-sm">
                {selectedMethod === "crypto" 
                  ? "Saisissez votre adresse BEP20 pour recevoir vos cryptomonnaies."
                  : "Ce portefeuille sera utilisé pour recevoir vos retraits. Vous pouvez le modifier à tout moment."
                }
              </p>
              
              {selectedMethod === "crypto" ? (
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre adresse BEP20
                    </label>
                    <input
                      type="text"
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Saisissez une adresse BEP20 valide (commence par 0x et fait 42 caractères)
                    </p>
                  </div>
                  
                  {cryptoAddress && (
                    <div className="flex items-center justify-between mt-4 p-3 bg-amber-100 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-amber-900">Adresse saisie :</p>
                        <p className="text-xs font-mono text-amber-800 truncate">{cryptoAddress}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cryptoAddress, "cryptoAddress")}
                        className="flex items-center gap-1 text-amber-700 hover:text-amber-800 text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedField === "cryptoAddress" ? "Copié !" : "Copier"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {linkedWallet.provider === "orange" ? <OrangeIcon className="w-5 h-5 text-orange-600" /> :
                         linkedWallet.provider === "airtel" ? <AirtelIcon className="w-5 h-5 text-red-600" /> :
                         <MPesaIcon className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {linkedWallet.provider === "orange" ? "Orange Money" :
                           linkedWallet.provider === "airtel" ? "Airtel Money" : "M-Pesa"}
                        </span>
                        <p className="text-sm text-gray-500">Portefeuille actuellement lié</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleEditWallet}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempWalletInfo}
                          onChange={(e) => setTempWalletInfo(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          placeholder="Saisissez le nouveau numéro"
                        />
                        <button
                          onClick={handleSaveWallet}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Vous pouvez utiliser un numéro différent de celui utilisé pour créer votre compte.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{linkedWallet.number}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Ce numéro peut être modifié à tout moment selon vos préférences
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(linkedWallet.number, "wallet")}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedField === "wallet" ? "Copié !" : "Copier"}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Sélectionner un autre moyen
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => changeLinkedWallet("orange")}
                    className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                      linkedWallet.provider === "orange" && selectedMethod !== "crypto"
                        ? "bg-orange-50 border-orange-500 text-orange-600 font-semibold"
                        : "bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
                    }`}
                  >
                    <OrangeIcon className="w-5 h-5" />
                    Orange Money
                  </button>
                  <button
                    onClick={() => changeLinkedWallet("airtel")}
                    className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                      linkedWallet.provider === "airtel" && selectedMethod !== "crypto"
                        ? "bg-red-50 border-red-500 text-red-600 font-semibold"
                        : "bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
                    }`}
                  >
                    <AirtelIcon className="w-5 h-5" />
                    Airtel Money
                  </button>
                  <button
                    onClick={() => changeLinkedWallet("mpesa")}
                    className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                      linkedWallet.provider === "mpesa" && selectedMethod !== "crypto"
                        ? "bg-green-50 border-green-500 text-green-600 font-semibold"
                        : "bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-600"
                    }`}
                  >
                    <MPesaIcon className="w-5 h-5" />
                    M-Pesa
                  </button>
                  <button
                    onClick={() => changeLinkedWallet("crypto")}
                    className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                      selectedMethod === "crypto"
                        ? "bg-amber-50 border-amber-500 text-amber-600 font-semibold"
                        : "bg-white border-gray-300 text-gray-700 hover:border-amber-400 hover:text-amber-600"
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    Crypto (BEP20)
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Montant à retirer
              </h2>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Saisissez le montant {selectedMethod === "crypto" ? "(minimum 5 ,000 CDF)" : "(minimum 1 ,500 CDF)"}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
                    onClick={() => {
                      setSelectedMethod(method.id);
                      changeLinkedWallet(method.id);
                    }}
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
                          <span className={`font-semibold ${
                            method.id === "crypto" ? "text-yellow-300" : ""
                          }`}>
                            {method.fees}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Min :</span>
                          <span className="font-semibold">{formatAmount(method.minAmount)} FC</span>
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

            <AnimatePresence>
              {selectedMethod && selectedMethodData && numericAmount >= selectedMethodData.minAmount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6 text-center border-b pb-4">
                    Instructions de retrait - {formatAmount(totalReceived)} CDF
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Étape 1 : Informations {selectedMethod === "crypto" ? "adresse crypto" : "bénéficiaire"}
                      </h4>
                      {selectedMethod === "crypto" ? (
                        <div className="bg-amber-50 rounded-xl p-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Adresse BEP20 pour recevoir les fonds
                            </label>
                            <input
                              type="text"
                              value={cryptoAddress}
                              onChange={(e) => setCryptoAddress(e.target.value)}
                              placeholder="0x..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Assurez-vous que l'adresse BEP20 est correcte. Les fonds envoyés à une mauvaise adresse sont irrécupérables.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du bénéficiaire
                              </label>
                              <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="Saisissez le nom associé au numéro"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Le nom doit correspondre au propriétaire du numéro
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Numéro de téléphone
                              </label>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-lg font-bold text-gray-900">{linkedWallet.number}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Vérifiez que ce numéro est correct
                                  </p>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(linkedWallet.number, "wallet")}
                                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copier
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Récapitulatif du retrait</h4>
                      <div className={`rounded-xl p-4 border ${
                        selectedMethod === "crypto" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
                      }`}>
                        <div className="space-y-3">
                          {selectedMethod === "crypto" ? (
                            <div className="pb-3 border-b border-gray-200">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-amber-900">Adresse BEP20</span>
                              </div>
                              <p className="text-sm font-mono text-amber-900 truncate">
                                {cryptoAddress || "Non définie"}
                              </p>
                            </div>
                          ) : (
                            <div className="pb-3 border-b border-gray-200">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-green-900">Nom bénéficiaire</span>
                              </div>
                              <p className="text-sm font-medium text-green-900">
                                {recipientName}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className={selectedMethod === "crypto" ? "text-amber-900" : "text-green-900"}>
                              Moyen de retrait :
                            </span>
                            <span className="font-semibold">{selectedMethodData.name}</span>
                          </div>

                          {selectedMethod !== "crypto" && (
                            <div className="flex justify-between">
                              <span className="text-green-900">Votre numéro :</span>
                              <span className="font-semibold">{linkedWallet.number}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between">
                            <span className={selectedMethod === "crypto" ? "text-amber-900" : "text-green-900"}>
                              Montant à recevoir :
                            </span>
                            <span className={`font-bold ${selectedMethod === "crypto" ? "text-amber-700" : "text-green-700"}`}>
                              {formatAmount(totalReceived)} CDF
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className={selectedMethod === "crypto" ? "text-amber-900" : "text-green-900"}>
                              Frais ({selectedMethod === "crypto" ? "10%" : "10%"}) :
                            </span>
                            <span className="font-semibold text-red-600">-{formatAmount(fees)} CDF</span>
                          </div>

                          {/* NOUVEAU: Afficher le nom de l'agent */}
                          {selectedMethod !== "crypto" && (
                            <div className="flex justify-between">
                              <span className="text-green-900">Agent :</span>
                              <span className="font-semibold">{getAgentName()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-xl p-4 border ${
                      selectedMethod === "crypto" ? "bg-amber-50 border-amber-200" : "bg-yellow-50 border-yellow-200"
                    }`}>
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${
                          selectedMethod === "crypto" ? "text-amber-600" : "text-yellow-600"
                        }`} />
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            selectedMethod === "crypto" ? "text-amber-900" : "text-yellow-900"
                          }`}>
                            Informations importantes
                          </h4>
                          <ul className={`text-sm space-y-1 ${
                            selectedMethod === "crypto" ? "text-amber-800" : "text-yellow-800"
                          }`}>
                            {selectedMethod === "crypto" ? (
                              <>
                                <li>• Délai de traitement : 15-30 minutes</li>
                                <li>• Frais de retrait : 10% du montant retiré</li>
                                <li>• Minimum : 30,000 CDF pour les retraits crypto</li>
                                <li>• Utilisez toujours une adresse BEP20 valide</li>
                                <li>• Vérifiez votre adresse avant de confirmer</li>
                                <li>• Les transactions crypto sont irréversibles</li>
                                <li>• Contactez le support en cas de problème</li>
                              </>
                            ) : (
                              <>
                                <li>• Délai de traitement : Moins de 30min (max 24h)</li>
                                <li>• Horaires : Lundi au samedi, 8h00 à 16h00</li>
                                <li>• Frais de retrait : 10% du montant retiré</li>
                                <li>• Utilisez toujours le numéro agent officiel : {getAgentNumber()}</li>
                                <li>• Agent : {getAgentName()}</li>
                                <li>• Vérifiez votre numéro avant de confirmer</li>
                                <li>• Contactez le support en cas de problème avec votre ID de transaction</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Retrait
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Montant à retirer</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(numericAmount)} CDF
                  </span>
                </div>
                
                {fees > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <span className="text-gray-600">Frais de retrait</span>
                      <p className="text-xs text-gray-500">({selectedMethod === "crypto" ? "10%" : "10%"} du montant)</p>
                    </div>
                    <span className="text-lg font-semibold text-red-600">
                      -{formatAmount(fees)} CDF
                    </span>
                  </div>
                )}
                
                {selectedMethodData && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Moyen de retrait</span>
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
                        {selectedMethod === "crypto" ? "Adresse BEP20" : "Votre numéro"}
                      </span>
                      {selectedMethod === "crypto" && cryptoAddress ? (
                        <button
                          onClick={() => copyToClipboard(cryptoAddress, "crypto-summary")}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Copier
                        </button>
                      ) : selectedMethod !== "crypto" ? (
                        <button
                          onClick={() => copyToClipboard(linkedWallet.number, "receipt")}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Copier
                        </button>
                      ) : null}
                    </div>
                    {selectedMethod === "crypto" ? (
                      cryptoAddress ? (
                        <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-2 rounded mt-1">
                          {cryptoAddress}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">À saisir</p>
                      )
                    ) : (
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {linkedWallet.number}
                      </p>
                    )}
                  </div>
                )}
                
                {/* NOUVEAU: Afficher le nom de l'agent */}
                {selectedMethod && selectedMethod !== "crypto" && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Agent de retrait</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {getAgentName()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Numéro: {getAgentNumber()}
                    </p>
                  </div>
                )}
                
                {transactionId && selectedMethod !== "crypto" && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">ID Transaction</span>
                      <button
                        onClick={() => copyToClipboard(transactionId, "summary-transaction")}
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
                        onClick={() => copyToClipboard(selectedMethodData.ussdCode, "ussd-summary")}
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
                
                <div className="pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">À recevoir</span>
                    <span className={`text-2xl font-bold ${
                      selectedMethod === "crypto" ? "text-amber-600" : "text-green-600"
                    }`}>
                      {formatAmount(totalReceived)} CDF
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Le virement sera effectué sous {selectedMethodData?.processingTime || "moins de 30min"}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleWithdrawal}
                disabled={isProcessing || !numericAmount || !selectedMethod || numericAmount < (selectedMethodData?.minAmount || 0)}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing || !numericAmount || !selectedMethod || numericAmount < (selectedMethodData?.minAmount || 0)
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : selectedMethod === "crypto"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl"
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
                  {numericAmount && selectedMethod && numericAmount < (selectedMethodData?.minAmount || 0) && `Minimum ${formatAmount(selectedMethodData.minAmount)} CDF`}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Informations importantes
              </h3>
              
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    <strong>Délai de traitement :</strong> Moins de 30min (max 24h)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    <strong>Horaires :</strong> Lundi au samedi, 8h00 à 16h00
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    <strong>Frais de retrait :</strong> 10% (mobiles) 
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    Minimum : 3,000 CDF (mobiles) / 30,000 CDF (crypto)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    Agent : {selectedMethod ? getAgentName() : "À sélectionner"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    Conservez votre ID de transaction pour suivi
                  </span>
                </li>
              </ul>
              
              <button
                onClick={() => window.open('https://wa.me/447412830186', '_blank')}
                className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                📞 Contacter le support
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
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
                <p>• Numéros agents vérifiés et sécurisés</p>
                {selectedMethod === "crypto" && (
                  <p>• Adresses BEP20 vérifiées</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}