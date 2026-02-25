// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { withdrawalProfileService } from '@/lib/withdrawalProfileService'; // AJOUTER CETTE LIGNE
// import { useWithdrawalProfile } from '@/hooks/useWithdrawalProfile'; // AJOUTER CETTE LIGNE

// import {
//   ArrowLeft,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   Banknote,
//   Shield,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Copy,
//   ChevronRight,
//   Zap,
//   Smartphone as AirtelIcon,
//   Smartphone as OrangeIcon,
//   Smartphone as MPesaIcon,
//   Edit2,
//   Save,
//   X,
//   Loader2
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { auth, db } from '@/lib/firebase';
// import { financeService } from '@/lib/financeService';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { useAuth } from "@/contexts/AuthContext";

// export default function RetraitPage() {
//   const router = useRouter();
//   const [amount, setAmount] = useState("");
//   const [selectedMethod, setSelectedMethod] = useState(null);
//   const [accountBalance, setAccountBalance] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [copiedField, setCopiedField] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempWalletInfo, setTempWalletInfo] = useState("");
//   const [transactionId, setTransactionId] = useState("");
//   const whatsappNumber = "+1 (450) 914-1073";
//    const { user, loading: authLoading } = useAuth();
//     // Nettoyer le numéro pour l'URL WhatsApp
//     const cleanedNumber = whatsappNumber.replace(/\s|\(|\)|-/g, '')
//   const [userInfo, setUserInfo] = useState({
//     uid: "",
//     email: "",
//     phone: "",
//     name: ""
//   });
  
  
//   // NOUVEAU: Utilisation du hook de profil
//   const { 
//     profile, 
//     loading: profileLoading, 
//     saveProfile, 
//     updateProfile,
//     source,
//     hasProfile
//   } = useWithdrawalProfile(userInfo.uid, userInfo);
  
//   // NOUVEAU: États pour les agents dynamiques
//   const [dynamicAgents, setDynamicAgents] = useState({
//     airtelAgent: { number: "", name: "" },
//     orangeAgent: { number: "", name: "" },
//     mpesaAgent: { number: "", name: "" }
//   });
//   const [agentsLoading, setAgentsLoading] = useState(true);
  
//   const [agentsInfo, setAgentsInfo] = useState({
//     airtelAgent: "0986343739",
//     orangeAgent: "0841366703",
//     mpesaAgent: "0971234567",
//   });
  
//  const [linkedWallet, setLinkedWallet] = useState({
//     provider: profile?.provider || "orange",
//     number: profile?.phoneNumber || userInfo.phone || "",
//   });

//   const [cryptoAddress, setCryptoAddress] = useState("");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUserInfo({
//           uid: currentUser.uid,
//           email: currentUser.email,
//           phone: currentUser.phoneNumber || '',
//           name: currentUser.displayName || ''
//         });

//         try {
//           const walletRef = doc(db, 'wallets', currentUser.uid);
//           const walletSnap = await getDoc(walletRef);
          
//           if (walletSnap.exists()) {
//             const walletData = walletSnap.data();
//             const availableBalance = walletData.balances?.wallet?.amount || 0;
//             setAccountBalance(availableBalance);
//           } else {
//             setAccountBalance(0);
//           }
//         } catch (error) {
//           console.error('Erreur chargement solde:', error);
//           setAccountBalance(0);
//         }
//       } else {
//         router.push('/auth/login');
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);



//     // NOUVEAU: Mettre à jour linkedWallet quand le profil change
//   useEffect(() => {
//     if (profile && !profileLoading) {
//       setLinkedWallet({
//         provider: profile.provider || "orange",
//         number: profile.phoneNumber || userInfo.phone || ""
//       });
//     }
//   }, [profile, profileLoading, userInfo]);
//   // NOUVEAU: Charger les agents depuis Firestore
//   useEffect(() => {
//     const loadAgents = async () => {
//       try {
//         setAgentsLoading(true);
//         const agentsQuery = query(
//           collection(db, 'portefeuilles'),
//           where('status', '==', 'active')
//         );
//         const snapshot = await getDocs(agentsQuery);
        
//         const agents = {
//           airtelAgent: { number: "", name: "" },
//           orangeAgent: { number: "", name: "" },
//           mpesaAgent: { number: "", name: "" }
//         };

//         snapshot.docs.forEach(doc => {
//           const data = doc.data();
//           switch(data.provider) {
//             case 'airtel':
//               agents.airtelAgent = { number: data.number || "", name: data.name || "" };
//               break;
//             case 'orange':
//               agents.orangeAgent = { number: data.number || "", name: data.name || "" };
//               break;
//             case 'mpesa':
//               agents.mpesaAgent = { number: data.number || "", name: data.name || "" };
//               break;
//           }
//         });

//         setDynamicAgents(agents);
//         // Mettre à jour agentsInfo avec les numéros dynamiques
//         setAgentsInfo({
//           airtelAgent: agents.airtelAgent.number || "0986343739",
//           orangeAgent: agents.orangeAgent.number || "0841366703",
//           mpesaAgent: agents.mpesaAgent.number || "0971234567",
//         });
//       } catch (error) {
//         console.error('Erreur chargement agents:', error);
//       } finally {
//         setAgentsLoading(false);
//       }
//     };

//     loadAgents();
//   }, []);

//   const paymentMethods = [
//     {
//       id: "orange",
//       name: "Orange Money",
//       icon: <OrangeIcon className="w-6 h-6" />,
//       description: "Transfert mobile Orange",
//       processingTime: "Moins de 30min",
//       fees: "10%",
//       minAmount: 1500,
//       maxAmount: 1000000000000,
//       color: "from-orange-500 to-orange-600",
//       ussdCode: "*144#",
//       agentNumber: dynamicAgents.orangeAgent.number || "0841366703",
//       instructions: [
//         "1. cadran: *144#",
//         "2. Sélectionnez 2:CDF",
//         "3. Sélectionnez 3:Je retire l'argent",
//         "4. Sélectionnez 1:Retrait Agent(Numéro ou code agent)",
//         "5. Entrer Numéro: " + (dynamicAgents.orangeAgent.number || "0841366703"),
//         "6. Montant CDF: [montant]",
//         "7. Entrer le Code Pin pour confirmer"
//       ]
//     },
//     {
//       id: "airtel",
//       name: "Airtel Money",
//       icon: <AirtelIcon className="w-6 h-6" />,
//       description: "Transfert mobile Airtel",
//       processingTime: "Moins de 30min",
//       fees: "10%",
//       minAmount: 1500,
//       maxAmount: 1000000000000,
//       color: "from-red-500 to-red-600",
//       ussdCode: "*501#",
//       agentNumber: dynamicAgents.airtelAgent.number || "0986343739",
//       instructions: [
//         "1. cadran: *501#",
//         "2. Sélectionnez 2.CDF",
//         "3. Sélectionnez 2.Retrait d'argent",
//         "4. Sélectionnez 1.Aupres d'un Agent",
//         "5. Entrer Code d'agent/numero: " + (dynamicAgents.airtelAgent.number || "0986343739"),
//         "6. Entrer montant: [montant]",
//         "7. Sélectionnez 1.Oui",
//         "8. Entrez votre PIN"
//       ]
//     },
//     {
//       id: "mpesa",
//       name: "M-Pesa",
//       icon: <MPesaIcon className="w-6 h-6" />,
//       description: "Transfert mobile M-Pesa",
//       processingTime: "Moins de 30min",
//       fees: "10%",
//       minAmount: 1500,
//       maxAmount: 1000000000000,
//       color: "from-green-500 to-green-600",
//       ussdCode: "*150*60#",
//       agentNumber: dynamicAgents.mpesaAgent.number || "0971234567",
//       instructions: [
//         "1. Ouvrez l'application M-Pesa",
//         "2. Sélectionnez 'Envoyer de l'argent'",
//         "3. Entrez le numéro: " + (dynamicAgents.mpesaAgent.number || "0971234567"),
//         "4. Saisissez le montant: [montant] CDF",
//         "5. Confirmez la transaction",
//         "6. Entrez votre PIN pour valider"
//       ]
//     },
//     {
//       id: "crypto",
//       name: "Crypto (BEP20)",
//       fees: "10%",
//       icon: <Zap className="w-6 h-6" />,
//       description: "Transfert en crypto BEP20",
//       processingTime: "15-30min",
//       fees: "10%",
//       minAmount: 5000,
//       maxAmount: 1000000000000,
//       color: "from-amber-500 to-amber-600",
//       ussdCode: "BEP20",
//       agentNumber: "Crypto",
//       instructions: [
//         "1. Préparez votre adresse BEP20 valide",
//         "2. Saisissez l'adresse BEP20 ci-dessous",
//         "3. Vérifiez l'adresse avant confirmation",
//         "4. Confirmez le retrait pour générer la demande",
//         "5. Nous vous enverrons les fonds à cette adresse"
//       ]
//     },
//   ];

//   const quickAmounts = [10000, 50000, 100000, 250000, 500000];

//   const calculateFees = () => {
//     if (!amount || !selectedMethod) return 0;
//     const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
    
//     if (selectedMethod === "crypto") {
//       return Math.round(numericAmount * 0.05);
//     }
//     return Math.round(numericAmount * 0.10);
//   };

//   const generateTransactionId = () => {
//     const timestamp = Date.now().toString();
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     return `WDR${timestamp.slice(-8)}${random}`;
//   };

//   const fees = calculateFees();
//   const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
//   const totalReceived = numericAmount - fees;
//   const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

//   const formatAmount = (value) => {
//     return value.toLocaleString("fr-FR");
//   };

//   const handleAmountChange = (e) => {
//     const value = e.target.value.replace(/\D/g, "");
//     setAmount(value);
    
//     if (value && parseInt(value) >= 3000) {
//       if (!transactionId) {
//         setTransactionId(generateTransactionId());
//       }
//     }
//   };

//   const handleQuickAmount = (quickAmount) => {
//     setAmount(quickAmount.toString());
//     setTransactionId(generateTransactionId());
//   };

//   const handleMaxAmount = () => {
//     const maxAllowed = Math.min(
//       accountBalance,
//       selectedMethodData?.maxAmount || accountBalance
//     );
//     setAmount(maxAllowed.toString());
//     setTransactionId(generateTransactionId());
//   };

//   const copyToClipboard = (text, field) => {
//     navigator.clipboard.writeText(text);
//     setCopiedField(field);
//     setTimeout(() => setCopiedField(null), 2000);
//   };

//   // NOUVEAU: Récupérer le nom de l'agent
//   const getAgentName = () => {
//     if (!selectedMethod) return "";
//     switch(selectedMethod) {
//       case "orange": return dynamicAgents.orangeAgent.name || "Agent Orange";
//       case "airtel": return dynamicAgents.airtelAgent.name || "Agent Airtel";
//       case "mpesa": return dynamicAgents.mpesaAgent.name || "Agent M-Pesa";
//       default: return "";
//     }
//   };

//   // NOUVEAU: Fonction pour sauvegarder le profil
//   const handleSaveProfile = async () => {
//     if (!userInfo.uid) {
//       alert("Veuillez vous connecter pour sauvegarder le profil");
//       return;
//     }

//     const profileData = {
//       phoneNumber: linkedWallet.number,
//       recipientName: profile?.recipientName || userInfo.name || "",
//       provider: linkedWallet.provider
//     };

//     const result = await saveProfile(profileData);
    
//     if (result.success) {
//       alert("✅ Profil de retrait sauvegardé !\nVos informations seront utilisées pour les prochains retraits.");
//     } else {
//       alert(`❌ Erreur: ${result.error}`);
//     }
//   };

//   const validateWithdrawal = () => {
//     if (!numericAmount) {
//       alert("Veuillez saisir un montant à retirer.");
//       return false;
//     }

//     if (selectedMethodData && numericAmount < selectedMethodData.minAmount) {
//       alert(`Le montant minimum est de ${formatAmount(selectedMethodData.minAmount)} CDF.`);
//       return false;
//     }

//     if (selectedMethodData && numericAmount > selectedMethodData.maxAmount) {
//       alert(`Le montant maximum est de ${formatAmount(selectedMethodData.maxAmount)} CDF.`);
//       return false;
//     }

//     if (numericAmount > accountBalance) {
//       alert(`Votre solde actuel est de ${formatAmount(accountBalance)} CDF.`);
//       return false;
//     }

//     if (!selectedMethod) {
//       alert("Veuillez sélectionner un moyen de retrait.");
//       return false;
//     }

//     if (selectedMethod === "crypto") {
//       if (!cryptoAddress.trim()) {
//         alert("Veuillez saisir votre adresse BEP20.");
//         return false;
//       }
      
//       if (!cryptoAddress.startsWith("0x") || cryptoAddress.length !== 42) {
//         alert("Veuillez saisir une adresse BEP20 valide (commence par 0x et fait 42 caractères).");
//         return false;
//       }
//     } else {
//       // NOUVEAU: Utiliser le nom du profil ou de l'utilisateur
//       const recipientNameToUse = profile?.recipientName || userInfo.name || "";
//       if (!recipientNameToUse.trim()) {
//         alert("Veuillez saisir le nom du bénéficiaire.");
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleWithdrawal = async () => {
//     if (!validateWithdrawal()) return;

//     if (!userInfo.uid) {
//       alert('Veuillez vous connecter pour effectuer un retrait.');
//       router.push('/auth/login');
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const withdrawalData = {
//          profileSource: source,
//         amount: numericAmount,
//         fees: fees,
//         netAmount: totalReceived,
//         paymentMethod: selectedMethodData?.name || '',
//         recipientPhone: selectedMethod === "crypto" ? "" : linkedWallet.number,
//          recipientName: selectedMethod === "crypto" ? "" : recipientNameToUse,
//         cryptoAddress: selectedMethod === "crypto" ? cryptoAddress : "",
//         agentNumber: getAgentNumber(),
//         agentName: getAgentName(),
//         userPhone: userInfo.phone,
//         userEmail: userInfo.email,
//         userName: userInfo.name,
//         transactionId: selectedMethod !== "crypto" ? transactionId : null
//       };

//       const result = await financeService.createWithdrawal(userInfo.uid, withdrawalData);

//       setIsProcessing(false);

//       if (result.success) {
//         let message = `✅ Demande de retrait soumise !\n\n` +
//           `ID: ${result.withdrawalId}\n` +
//           `Montant: ${formatAmount(numericAmount)} CDF\n` +
//           `Frais: ${formatAmount(fees)} CDF\n` +
//           `À recevoir: ${formatAmount(totalReceived)} CDF\n` +
//           `Moyen: ${selectedMethodData?.name}\n` +
//           `Agent: ${getAgentName()}\n`;
        
//         if (selectedMethod === "crypto") {
//           message += `Adresse: ${cryptoAddress}\n\n`;
//         } else {
//           message += `Numéro: ${linkedWallet.number}\n` +
//                      `Nom: ${recipientName}\n\n`;
//         }
        
//         message += `Votre demande est en attente de validation.\n` +
//           `Le virement sera effectué après approbation admin.`;
        
//         alert(message);
//                 // NOUVEAU: Si pas de profil, proposer de sauvegarder
//         if (!hasProfile && selectedMethod !== "crypto") {
//           const saveProfile = confirm("Voulez-vous sauvegarder ces informations pour vos prochains retraits ?");
//           if (saveProfile) {
//             await handleSaveProfile();
//           }
//         }
        
//         setAmount("");
//         setSelectedMethod(null);
//         setCryptoAddress("");
//         setRecipientName(userInfo.name || '');
//       } else {
//         alert(`❌ Erreur: ${result.error}`);
//       }
//     } catch (error) {
//       setIsProcessing(false);
//       alert(`❌ Erreur lors de la soumission: ${error.message}`);
//     }
//   };

//   const handleEditWallet = () => {
//     setTempWalletInfo(linkedWallet.number);
//     setIsEditing(true);
//   };

//   const handleSaveWallet = () => {
//     if (tempWalletInfo.trim() === "") {
//       alert("Veuillez saisir un numéro valide.");
//       return;
//     }
//       if (hasProfile) {
//       updateProfile({
//         phoneNumber: tempWalletInfo,
//         provider: linkedWallet.provider
//       });
    

//     setLinkedWallet({
//       ...linkedWallet,
//       number: tempWalletInfo
//     });
//     setIsEditing(false);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//   };

//   const changeLinkedWallet = (provider) => {
//     if (provider === "crypto") {
//       setLinkedWallet({
//         provider: "crypto",
//         number: "Adresse BEP20 à saisir"
//       });
//     } else {
//       // NOUVEAU: Utiliser le profil si disponible
//       const phoneNumber = profile?.phoneNumber || 
//         (provider === "orange" ? "0898765432" : 
//          provider === "airtel" ? "0992345678" : 
//          "0821234567");
      
//       setLinkedWallet({
//         provider: provider,
//         number: phoneNumber
//       });
//     }
//     setSelectedMethod(provider);
    
//     if (provider !== "crypto") {
//       setCryptoAddress("");
//     }
//   };

//   const getInstructions = () => {
//     if (!selectedMethodData) return [];
//     return selectedMethodData.instructions.map(instruction => 
//       instruction.replace("[montant]", formatAmount(totalReceived))
//     );
//   };

//   const getAgentNumber = () => {
//     if (!selectedMethodData) return "";
//     return selectedMethodData.agentNumber;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => router.back()}
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Retour</span>
//             </button>
            
//             <div className="text-center">
//               <h1 className="text-2xl font-bold text-gray-900">Retrait de fonds</h1>
//               <p className="text-gray-600 text-sm mt-1">Retirez vos gains sur votre compte</p>
//             </div>
            
//             <div className="w-20"></div> 
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <Wallet className="w-6 h-6" />
//                     <h2 className="text-xl font-semibold">Solde disponible</h2>
//                   </div>
//                   <p className="text-3xl font-bold mb-4">
//                     {formatAmount(accountBalance)} CDF
//                   </p>
//                   <p className="text-blue-100 text-sm">
//                     Solde actuel pour retraits et investissements
//                   </p>
//                 </div>
                
//                 <button
//                   onClick={handleMaxAmount}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
//                   disabled={accountBalance <= 0}
//                 >
//                   Retirer tout
//                 </button>
//               </div>
              
//               <div className="mt-4 flex items-center gap-2 text-blue-100">
//                 <Shield className="w-4 h-4" />
//                 <span className="text-sm">Transfert 100% sécurisé</span>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
//             >
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
//                 <Smartphone className="w-6 h-6 text-blue-600" />
//                 {selectedMethod === "crypto" ? "Adresse de réception Crypto" : "Portefeuille de réception"}
//               </h2>
              
//               <p className="text-gray-600 mb-6 text-sm">
//                 {selectedMethod === "crypto" 
//                   ? "Saisissez votre adresse BEP20 pour recevoir vos cryptomonnaies."
//                   : "Ce portefeuille sera utilisé pour recevoir vos retraits. Vous pouvez le modifier à tout moment."
//                 }
//               </p>
              
//               {selectedMethod === "crypto" ? (
//                 <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
//                   <div className="mb-3">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Votre adresse BEP20
//                     </label>
//                     <input
//                       type="text"
//                       value={cryptoAddress}
//                       onChange={(e) => setCryptoAddress(e.target.value)}
//                       placeholder="0x..."
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-mono"
//                     />
//                     <p className="text-xs text-gray-500 mt-2">
//                       Saisissez une adresse BEP20 valide (commence par 0x et fait 42 caractères)
//                     </p>
//                   </div>
                  
//                   {cryptoAddress && (
//                     <div className="flex items-center justify-between mt-4 p-3 bg-amber-100 rounded-lg">
//                       <div>
//                         <p className="text-sm font-medium text-amber-900">Adresse saisie :</p>
//                         <p className="text-xs font-mono text-amber-800 truncate">{cryptoAddress}</p>
//                       </div>
//                       <button
//                         onClick={() => copyToClipboard(cryptoAddress, "cryptoAddress")}
//                         className="flex items-center gap-1 text-amber-700 hover:text-amber-800 text-sm"
//                       >
//                         <Copy className="w-4 h-4" />
//                         {copiedField === "cryptoAddress" ? "Copié !" : "Copier"}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-100 rounded-lg">
//                         {linkedWallet.provider === "orange" ? <OrangeIcon className="w-5 h-5 text-orange-600" /> :
//                          linkedWallet.provider === "airtel" ? <AirtelIcon className="w-5 h-5 text-red-600" /> :
//                          <MPesaIcon className="w-5 h-5 text-green-600" />}
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-700">
//                           {linkedWallet.provider === "orange" ? "Orange Money" :
//                            linkedWallet.provider === "airtel" ? "Airtel Money" : "M-Pesa"}
//                         </span>
//                         <p className="text-sm text-gray-500">Portefeuille actuellement lié</p>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={handleEditWallet}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                       Modifier
//                     </button>
//                   </div>
                  
//                   {isEditing ? (
//                     <div className="space-y-3">
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           value={tempWalletInfo}
//                           onChange={(e) => setTempWalletInfo(e.target.value)}
//                           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
//                           placeholder="Saisissez le nouveau numéro"
//                         />
//                         <button
//                           onClick={handleSaveWallet}
//                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
//                         >
//                           <Save className="w-4 h-4" />
//                           Enregistrer
//                         </button>
//                         <button
//                           onClick={handleCancelEdit}
//                           className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex items-center gap-2"
//                         >
//                           <X className="w-4 h-4" />
//                           Annuler
//                         </button>
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         Vous pouvez utiliser un numéro différent de celui utilisé pour créer votre compte.
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-lg font-semibold text-gray-900">{linkedWallet.number}</p>
//                                               <p className="text-sm text-gray-500 mt-1">
//                           {hasProfile 
//                             ? "Ce numéro provient de votre profil sauvegardé."
//                             : "Ce numéro peut être modifié à tout moment selon vos préférences"}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => copyToClipboard(linkedWallet.number, "wallet")}
//                         className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
//                       >
//                         <Copy className="w-4 h-4" />
//                         {copiedField === "wallet" ? "Copié !" : "Copier"}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

                              
//                 {/* NOUVEAU: Bouton pour sauvegarder le profil */}
//                 {selectedMethod !== "crypto" && !hasProfile && (
//                   <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-green-800">
//                           💾 Sauvegarder ces informations ?
//                         </p>
//                         <p className="text-xs text-green-600">
//                           Enregistrez ce numéro et ce nom pour vos prochains retraits
//                         </p>
//                       </div>
//                       <button
//                         onClick={handleSaveProfile}
//                         className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
//                       >
//                         Sauvegarder le profil
//                       </button>
//                     </div>
//                   </div>
//                 )}
              
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-600 mb-3">
//                   Sélectionner un autre moyen
//                 </h3>
//                 <div className="flex flex-wrap gap-3">
//                   <button
//                     onClick={() => changeLinkedWallet("orange")}
//                     className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
//                       linkedWallet.provider === "orange" && selectedMethod !== "crypto"
//                         ? "bg-orange-50 border-orange-500 text-orange-600 font-semibold"
//                         : "bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
//                     }`}
//                   >
//                     <OrangeIcon className="w-5 h-5" />
//                     Orange Money
//                   </button>
//                   <button
//                     onClick={() => changeLinkedWallet("airtel")}
//                     className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
//                       linkedWallet.provider === "airtel" && selectedMethod !== "crypto"
//                         ? "bg-red-50 border-red-500 text-red-600 font-semibold"
//                         : "bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
//                     }`}
//                   >
//                     <AirtelIcon className="w-5 h-5" />
//                     Airtel Money
//                   </button>
//                   <button
//                     onClick={() => changeLinkedWallet("mpesa")}
//                     className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
//                       linkedWallet.provider === "mpesa" && selectedMethod !== "crypto"
//                         ? "bg-green-50 border-green-500 text-green-600 font-semibold"
//                         : "bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-600"
//                     }`}
//                   >
//                     <MPesaIcon className="w-5 h-5" />
//                     M-Pesa
//                   </button>
//                   <button
//                     onClick={() => changeLinkedWallet("crypto")}
//                     className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
//                       selectedMethod === "crypto"
//                         ? "bg-amber-50 border-amber-500 text-amber-600 font-semibold"
//                         : "bg-white border-gray-300 text-gray-700 hover:border-amber-400 hover:text-amber-600"
//                     }`}
//                   >
//                     <Zap className="w-5 h-5" />
//                     Crypto (BEP20)
//                   </button>
//                 </div>
//               </div>



            // </motion.div>

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { withdrawalProfileService } from '@/lib/withdrawalProfileService';
import { useWithdrawalProfile } from '@/hooks/useWithdrawalProfile';
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
import { useAuth } from "@/contexts/AuthContext";

// Liste des codes pays
const countryCodes = [
  { code: "+243", name: "RDC", flag: "🇨🇩" },
  { code: "+225", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "+229", name: "Bénin", flag: "🇧🇯" },
  { code: "+226", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "+228", name: "Togo", flag: "🇹🇬" },
  { code: "+227", name: "Niger", flag: "🇳🇪" },
  { code: "+223", name: "Mali", flag: "🇲🇱" },
  { code: "+237", name: "Cameroun", flag: "🇨🇲" },
  { code: "+242", name: "Congo", flag: "🇨🇬" },
  { code: "+257", name: "Burundi", flag: "🇧🇮" },
  { code: "+250", name: "Rwanda", flag: "🇷🇼" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+255", name: "Tanzanie", flag: "🇹🇿" },
  { code: "+256", name: "Ouganda", flag: "🇺🇬" },
  { code: "+257", name: "Burundi", flag: "🇧🇮" }
];

// Composant de maintenance
const MaintenanceBanner = ({ show }) => {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 border-2 border-amber-200"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {MAINTENANCE_MESSAGE.title}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {MAINTENANCE_MESSAGE.message}
          </p>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
            <p className="text-amber-800 text-sm">
              {MAINTENANCE_MESSAGE.details}
            </p>
            <p className="text-amber-700 text-xs mt-2 font-medium">
              ⏱️ {MAINTENANCE_MESSAGE.estimatedTime}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors cursor:pointer"
            >
              Retour 
            </button>
            
            <button
              onClick={() => window.open(`https://wa.me/${cleanedNumber}`, '_blank')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <span>📞</span>
              Support
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


export default function RetraitPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
const MAINTENANCE_MODE = true;
  const [selectedCountryCode, setSelectedCountryCode] = useState("+243");
  const whatsappNumber = "+1 (450) 914-1073";
  const { user, loading: authLoading } = useAuth();
  const cleanedNumber = whatsappNumber.replace(/\s|\(|\)|-/g, '');

  const [userInfo, setUserInfo] = useState({
    uid: "",
    email: "",
    phone: "",
    name: ""
  });
  
  // Hook de profil - maintenant il gère séparément countryCode et phoneNumber
  const { 
    profile, 
    loading: profileLoading, 
    saveProfile, 
    updateProfile,
    source,
    hasProfile
  } = useWithdrawalProfile(user?.uid, userInfo);
  


const [recipientName, setRecipientName] = useState(user?.name || '');

// 2. Ajouter un useEffect pour mettre à jour quand le profil charge
useEffect(() => {
  if (profile && profile.recipientName) {
    // Si le profil a un recipientName, l'utiliser
    setRecipientName(profile.recipientName);
  } else if (user.name) {
    // Sinon, utiliser le nom de l'utilisateur
    setRecipientName(user.name);
  }
}, [profile, user.name]);
  // États pour les agents dynamiques
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
  
  // MODIFICATION : linkedWallet ne contient que le numéro SANS code pays
  const [linkedWallet, setLinkedWallet] = useState({
    provider: profile?.provider || "orange",
    phoneNumber: profile?.phoneNumber || "", // SEULEMENT le numéro local
  });

  const [cryptoAddress, setCryptoAddress] = useState("");

  // États pour le système de limitation des retraits par niveau
  const [userLevel, setUserLevel] = useState(null); // LV1, LV2, etc.
  const [directReferrals, setDirectReferrals] = useState([]); // Liste des filleuls directs
  const [withdrawalLimit, setWithdrawalLimit] = useState(1.0); // Pourcentage de retrait autorisé (0.0 à 1.0)
  const [withdrawalLimitLoading, setWithdrawalLimitLoading] = useState(true);

  // États pour la contrainte d'un retrait par jour
  const [hasWithdrawnToday, setHasWithdrawnToday] = useState(false); // Si l'utilisateur a déjà retiré aujourd'hui
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(null); // Date du dernier retrait
  const [checkingDailyLimit, setCheckingDailyLimit] = useState(true); // Chargement de la vérification

  // Charger les données utilisateur et solde
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

  // Mettre à jour linkedWallet quand le profil change
  useEffect(() => {
    if (profile && !profileLoading) {
      setLinkedWallet({
        provider: profile.provider || "orange",
        phoneNumber: profile.phoneNumber || "" // SEULEMENT le numéro local
      });
      

       if (profile.cryptoAddress) {
      setCryptoAddress(profile.cryptoAddress);
    }
      // Mettre à jour le code pays si présent dans le profil
      if (profile.countryCode) {
        setSelectedCountryCode(profile.countryCode);
      } else {
        // Essayer de détecter le code pays du numéro utilisateur
        if (userInfo.phone) {
          const detectedCode = detectCountryCode(normalizePhone(user.phone));
          if (detectedCode) {
            setSelectedCountryCode(detectedCode);
          }
        }
      }
    }
  }, [profile, profileLoading, userInfo]);

  // Fonction pour détecter le code pays
  const detectCountryCode = (phoneNumber) => {
    if (!phoneNumber) return "+243";
    
    for (const country of countryCodes) {
      if (phoneNumber.startsWith(country.code)) {
        return country.code;
      }
    }
    return "+243"; // Par défaut RDC
  };

  // Charger les agents depuis Firestore
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

  // Charger le niveau de l'utilisateur et ses parrainages directs
  useEffect(() => {
    const loadUserLevelAndReferrals = async () => {
      if (!userInfo.uid) {
        setWithdrawalLimitLoading(false);
        return;
      }

      try {
        setWithdrawalLimitLoading(true);

        // 1. Récupérer le niveau d'investissement actif de l'utilisateur
        const userLevelsQuery = query(
          collection(db, 'user_levels'),
          where('userId', '==', userInfo.uid),
          where('status', '==', 'active')
        );
        const userLevelsSnapshot = await getDocs(userLevelsQuery);
        
        let highestLevel = null;
        if (!userLevelsSnapshot.empty) {
          // Prendre le niveau le plus élevé si plusieurs investissements actifs
          userLevelsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const levelName = data.levelName || data.levelId; // Ex: "LV1", "LV2", etc.
            
            if (!highestLevel || levelName > highestLevel) {
              highestLevel = levelName;
            }
          });
        }

        // 2. Récupérer les parrainages directs (filleuls de niveau 1)
        const usersQuery = query(
          collection(db, 'users'),
          where('referrerId', '==', userInfo.uid) // CORRECTION: referrerId au lieu de referredBy
        );
        const usersSnapshot = await getDocs(usersQuery);
        
        // 3. Pour chaque filleul, récupérer son niveau d'investissement
        const referralsWithLevels = [];
        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const referralId = userDoc.id;
          
          // Récupérer le niveau d'investissement du filleul
          const referralLevelsQuery = query(
            collection(db, 'user_levels'),
            where('userId', '==', referralId),
            where('status', '==', 'active')
          );
          const referralLevelsSnapshot = await getDocs(referralLevelsQuery);
          
          let referralLevel = null;
          if (!referralLevelsSnapshot.empty) {
            // Prendre le niveau le plus élevé
            referralLevelsSnapshot.docs.forEach(doc => {
              const data = doc.data();
              const levelName = data.levelName || data.levelId;
              
              if (!referralLevel || levelName > referralLevel) {
                referralLevel = levelName;
              }
            });
          }
          
          referralsWithLevels.push({
            id: referralId,
            name: userData.displayName || userData.email,
            level: referralLevel
          });
        }

        // 4. Calculer la limite de retrait
        const limit = calculateWithdrawalLimit(highestLevel, referralsWithLevels);

        // 5. Mettre à jour les états
        setUserLevel(highestLevel);
        setDirectReferrals(referralsWithLevels);
        setWithdrawalLimit(limit);

        console.log('📊 Limite de retrait calculée:', {
          userLevel: highestLevel,
          referralsCount: referralsWithLevels.length,
          referralsWithDifferentLevels: new Set(referralsWithLevels.map(r => r.level).filter(Boolean)).size,
          withdrawalLimit: `${Math.round(limit * 100)}%`
        });

      } catch (error) {
        console.error('❌ Erreur chargement niveau et parrainages:', error);
        // En cas d'erreur, autoriser 50% par défaut
        setWithdrawalLimit(0.50);
      } finally {
        setWithdrawalLimitLoading(false);
      }
    };

    loadUserLevelAndReferrals();
  }, [userInfo.uid]);

  // Vérifier si l'utilisateur a déjà fait un retrait aujourd'hui
  useEffect(() => {
    const checkDailyWithdrawalLimit = async () => {
      if (!userInfo.uid) {
        setCheckingDailyLimit(false);
        return;
      }

      try {
        setCheckingDailyLimit(true);

        // CORRECTION: Calculer minuit en UTC+1 (Kinshasa) de manière fiable
        // Ne pas utiliser toLocaleString qui dépend du navigateur
        const now = new Date();
        const utcTime = now.getTime();
        const kinshasaOffset = 1 * 60 * 60 * 1000; // UTC+1 en millisecondes
        const kinshasaTime = new Date(utcTime + kinshasaOffset);
        
        // Obtenir minuit en heure de Kinshasa
        const todayStart = new Date(Date.UTC(
          kinshasaTime.getUTCFullYear(),
          kinshasaTime.getUTCMonth(),
          kinshasaTime.getUTCDate(),
          0, 0, 0, 0
        ));
        // Ajuster pour UTC+1
        todayStart.setTime(todayStart.getTime() - kinshasaOffset);

        console.log('🕐 Vérification retrait quotidien:', {
          now: now.toISOString(),
          todayStart: todayStart.toISOString(),
          kinshasaTime: kinshasaTime.toISOString()
        });

        // Requête pour trouver les retraits d'aujourd'hui
        // CORRECTION: Utiliser 'transactions' au lieu de 'withdrawals'
        const withdrawalsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', userInfo.uid),
          where('createdAt', '>=', todayStart),
          where('withdrawalId', '!=', null), // Seulement les retraits (pas les dépôts)
          // where('status', 'in', ['pending']) // Exclure les retraits rejetés
        );

        const withdrawalsSnapshot = await getDocs(withdrawalsQuery);

        if (!withdrawalsSnapshot.empty) {
          // L'utilisateur a déjà fait un retrait aujourd'hui
          const lastWithdrawal = withdrawalsSnapshot.docs[0].data();
          const withdrawalDate = lastWithdrawal.createdAt?.toDate();
          
          setHasWithdrawnToday(true);
          setLastWithdrawalDate(withdrawalDate);

          console.log('⚠️ Retrait déjà effectué aujourd\'hui:', {
            date: withdrawalDate,
            count: withdrawalsSnapshot.size
          });
        } else {
          // Aucun retrait aujourd'hui
          setHasWithdrawnToday(false);
          setLastWithdrawalDate(null);

          console.log('✅ Aucun retrait aujourd\'hui - Retrait autorisé');
        }

      } catch (error) {
        console.error('❌ Erreur vérification retrait quotidien:', error);
        // En cas d'erreur, autoriser le retrait par sécurité
        setHasWithdrawnToday(false);
      } finally {
        setCheckingDailyLimit(false);
      }
    };

    checkDailyWithdrawalLimit();
  }, [userInfo.uid]);

 const autoSaveProfileAfterWithdrawal = async () => {
  if (!user.uid) return;
  
  try {
    const existingProfile = await withdrawalProfileService.getProfile(user.uid);
    console.log("ok je suis dans profile")
    // Données à sauvegarder selon la méthode
    let profileData = {};
    
    if (selectedMethod === "crypto") {
      // Pour crypto: sauvegarder l'adresse
      if (!cryptoAddress.trim()) return;
      
      profileData = {
        phoneNumber: "",
        recipientName: "",
        provider: "crypto",
        countryCode: "",
        cryptoAddress: cryptoAddress.trim()
      };
    } else {
      // Pour mobile: sauvegarder les infos classiques
      const recipientNameToUse = recipientName.trim() || userInfo.name || "";
      const phoneNumber = linkedWallet.phoneNumber || "";
      
      if (!recipientNameToUse || !phoneNumber) return;
      
      profileData = {
        phoneNumber: phoneNumber,
        recipientName: recipientNameToUse,
        provider: linkedWallet.provider,
        countryCode: selectedCountryCode,
        cryptoAddress: "" // Effacer l'adresse crypto si on passe à mobile
      };
    }
    
    if (existingProfile.success && existingProfile.exists) {
      // Mettre à jour le profil existant
      await withdrawalProfileService.saveProfile(userInfo.uid, profileData);
    } else {
      // Créer un nouveau profil
      await withdrawalProfileService.saveProfile(userInfo.uid, profileData);
    }
    
    // Recharger le profil
    if (profile && profile.refresh) {
      profile.refresh();
    }
  } catch (error) {
    console.error('Erreur sauvegarde automatique profil:', error);
  }
};

  // Fonction pour vérifier si l'utilisateur a 3 parrainages directs de niveaux différents
  const hasThreeDifferentLevelReferrals = (referrals) => {
    if (!referrals || referrals.length < 3) return false;
    
    // Extraire les niveaux uniques
    const uniqueLevels = new Set(referrals.map(ref => ref.level).filter(Boolean));
    
    // Vérifier qu'il y a au moins 3 niveaux différents
    return uniqueLevels.size >= 3;
  };

  // Fonction pour calculer la limite de retrait selon le niveau
  const calculateWithdrawalLimit = (level, referrals) => {
    // Si l'utilisateur a 3 parrainages de niveaux différents, il peut retirer 100%
    if (hasThreeDifferentLevelReferrals(referrals)) {
      return 1.0; // 100%
    }
    
    // Sinon, appliquer la limite selon le niveau
    const limits = {
      'LV1': 0.50,  // 50%
      'LV2': 0.50,  // 50%
      'LV3': 0.50,  // 50%
      'LV4': 0.50,  // 50%
      'LV5': 0.50,  // 50%
      'LV6': 0.40,  // 40%
      'LV7': 0.30,  // 30%
      'LV8': 0.30,  // 30%
      'LV9': 0.50,  // 50%
      'LV10': 0.50, // 50%
    };
    
    return limits[level] || 0.50; // Par défaut 50%
  };

  // Fonction pour obtenir le message de limite
  const getWithdrawalLimitMessage = () => {
    if (withdrawalLimit >= 1.0) {
      return {
        type: 'success',
        message: '✅ Vous pouvez retirer 100% de votre solde',
        detail: 'Vous avez 3 parrainages directs de niveaux différents'
      };
    }
    
    const percentage = Math.round(withdrawalLimit * 100);
    const maxAmount = Math.floor(accountBalance * withdrawalLimit);
    
    return {
      type: 'warning',
      message: `⚠️ Limite de retrait: ${percentage}% de votre solde`,
      detail: `Maximum: ${formatAmount(maxAmount)} CDF. Pour débloquer 100%, invitez 3 personnes de niveaux différents.`
    };
  };

  const paymentMethods = [
    {
      id: "orange",
      name: "Orange Money",
      icon: <OrangeIcon className="w-6 h-6" />,
      description: "Transfert mobile Orange",
      processingTime: "Moins de 30min",
      fees: "20%",
      minAmount: 1500,
      maxAmount: 1000000000000,
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
      fees: "20%",
      minAmount: 1500,
      maxAmount: 1000000000000,
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
      fees: "20%",
      minAmount: 1500,
      maxAmount: 1000000000000,
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
      fees: "20%",
      icon: <Zap className="w-6 h-6" />,
      description: "Transfert en crypto BEP20",
      processingTime: "15-30min",
      fees: "20%",
      minAmount: 5000,
      maxAmount: 1000000000000,
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
      return Math.round(numericAmount * 0.20);
    }
    return Math.round(numericAmount * 0.20);
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
    // Calculer le montant maximum en tenant compte de la limite de retrait
    const maxByLimit = Math.floor(accountBalance * withdrawalLimit);
    const maxAllowed = Math.min(
      maxByLimit,
      selectedMethodData?.maxAmount || maxByLimit
    );
    setAmount(maxAllowed.toString());
    setTransactionId(generateTransactionId());
  };


function normalizePhone(phone) {
  if (!phone) return "";
  
  const countryCodes = [
    // Afrique
    '+213', // Algérie
    '+244', // Angola
    '+229', // Bénin
    '+267', // Botswana
    '+226', // Burkina Faso
    '+257', // Burundi
    '+237', // Cameroun
    '+238', // Cap-Vert
    '+236', // République centrafricaine
    '+235', // Tchad
    '+269', // Comores
    '+243', // République démocratique du Congo
    '+242', // République du Congo
    '+225', // Côte d'Ivoire
    '+253', // Djibouti
    '+20',  // Égypte
    '+240', // Guinée équatoriale
    '+291', // Érythrée
    '+251', // Éthiopie
    '+241', // Gabon
    '+220', // Gambie
    '+233', // Ghana
    '+224', // Guinée
    '+245', // Guinée-Bissau
    '+254', // Kenya
    '+266', // Lesotho
    '+231', // Liberia
    '+218', // Libye
    '+261', // Madagascar
    '+265', // Malawi
    '+223', // Mali
    '+222', // Mauritanie
    '+230', // Maurice
    '+262', // Mayotte
    '+269', // Comores (à nouveau)
    '+212', // Maroc
    '+258', // Mozambique
    '+264', // Namibie
    '+227', // Niger
    '+234', // Nigeria
    '+250', // Rwanda
    '+262', // La Réunion
    '+590', // Saint-Barthélemy
    '+290', // Sainte-Hélène
    '+508', // Saint-Pierre-et-Miquelon
    '+239', // São Tomé-et-Principe
    '+221', // Sénégal
    '+248', // Seychelles
    '+232', // Sierra Leone
    '+252', // Somalie
    '+27',  // Afrique du Sud
    '+211', // Soudan du Sud
    '+249', // Soudan
    '+268', // Eswatini
    '+255', // Tanzanie
    '+228', // Togo
    '+216', // Tunisie
    '+256', // Ouganda
    '+260', // Zambie
    '+263', // Zimbabwe
    
    // Amérique du Nord
    '+1',   // États-Unis, Canada
    '+1 242', // Bahamas
    '+1 246', // Barbade
    '+1 264', // Anguilla
    '+1 268', // Antigua-et-Barbuda
    '+1 284', // Îles Vierges britanniques
    '+1 345', // Îles Caïmans
    '+1 441', // Bermudes
    '+1 473', // Grenade
    '+1 649', // Îles Turques-et-Caïques
    '+1 664', // Montserrat
    '+1 670', // Îles Mariannes du Nord
    '+1 671', // Guam
    '+1 684', // Samoa américaines
    '+1 758', // Sainte-Lucie
    '+1 767', // Dominique
    '+1 784', // Saint-Vincent-et-les-Grenadines
    '+1 787', // Porto Rico
    '+1 809', // République dominicaine
    '+1 829', // République dominicaine
    '+1 849', // République dominicaine
    '+1 868', // Trinité-et-Tobago
    '+1 869', // Saint-Christophe-et-Niévès
    '+1 876', // Jamaïque
    
    // Amérique du Sud
    '+54',  // Argentine
    '+591', // Bolivie
    '+55',  // Brésil
    '+56',  // Chili
    '+57',  // Colombie
    '+593', // Équateur
    '+500', // Îles Malouines
    '+594', // Guyane française
    '+590', // Guadeloupe
    '+596', // Martinique
    '+597', // Suriname
    '+598', // Uruguay
    '+58',  // Venezuela
    '+51',  // Pérou
    '+592', // Guyana
    '+595', // Paraguay
    
    // Asie
    '+93',  // Afghanistan
    '+374', // Arménie
    '+994', // Azerbaïdjan
    '+973', // Bahreïn
    '+880', // Bangladesh
    '+975', // Bhoutan
    '+673', // Brunei
    '+855', // Cambodge
    '+86',  // Chine
    '+357', // Chypre
    '+91',  // Inde
    '+62',  // Indonésie
    '+98',  // Iran
    '+964', // Irak
    '+972', // Israël
    '+81',  // Japon
    '+962', // Jordanie
    '+7',   // Kazakhstan, Russie
    '+965', // Koweït
    '+996', // Kirghizistan
    '+856', // Laos
    '+961', // Liban
    '+60',  // Malaisie
    '+960', // Maldives
    '+976', // Mongolie
    '+95',  // Myanmar
    '+977', // Népal
    '+850', // Corée du Nord
    '+968', // Oman
    '+92',  // Pakistan
    '+970', // Palestine
    '+63',  // Philippines
    '+974', // Qatar
    '+966', // Arabie saoudite
    '+82',  // Corée du Sud
    '+94',  // Sri Lanka
    '+963', // Syrie
    '+886', // Taïwan
    '+992', // Tadjikistan
    '+66',  // Thaïlande
    '+90',  // Turquie
    '+993', // Turkménistan
    '+971', // Émirats arabes unis
    '+998', // Ouzbékistan
    '+84',  // Viêt Nam
    '+967', // Yémen
    
    // Europe
    '+355', // Albanie
    '+376', // Andorre
    '+43',  // Autriche
    '+375', // Biélorussie
    '+32',  // Belgique
    '+387', // Bosnie-Herzégovine
    '+359', // Bulgarie
    '+385', // Croatie
    '+357', // Chypre
    '+420', // République tchèque
    '+45',  // Danemark
    '+372', // Estonie
    '+298', // Îles Féroé
    '+358', // Finlande
    '+33',  // France
    '+995', // Géorgie
    '+49',  // Allemagne
    '+350', // Gibraltar
    '+30',  // Grèce
    '+36',  // Hongrie
    '+354', // Islande
    '+353', // Irlande
    '+39',  // Italie
    '+383', // Kosovo
    '+371', // Lettonie
    '+423', // Liechtenstein
    '+370', // Lituanie
    '+352', // Luxembourg
    '+356', // Malte
    '+373', // Moldavie
    '+377', // Monaco
    '+382', // Monténégro
    '+31',  // Pays-Bas
    '+389', // Macédoine du Nord
    '+47',  // Norvège
    '+48',  // Pologne
    '+351', // Portugal
    '+40',  // Roumanie
    '+7',   // Russie
    '+378', // Saint-Marin
    '+381', // Serbie
    '+421', // Slovaquie
    '+386', // Slovénie
    '+34',  // Espagne
    '+46',  // Suède
    '+41',  // Suisse
    '+44',  // Royaume-Uni
    '+379', // Vatican
    
    // Océanie
    '+61',  // Australie
    '+672', // Île Norfolk
    '+677', // Îles Salomon
    '+678', // Vanuatu
    '+679', // Fidji
    '+682', // Îles Cook
    '+683', // Niue
    '+685', // Samoa
    '+686', // Kiribati
    '+687', // Nouvelle-Calédonie
    '+688', // Tuvalu
    '+689', // Polynésie française
    '+690', // Tokelau
    '+691', // États fédérés de Micronésie
    '+692', // Îles Marshall
    '+850', // Corée du Nord
    '+853', // Macao
    '+855', // Cambodge
    '+856', // Laos
    '+880', // Bangladesh
    '+886', // Taïwan
    '+960', // Maldives
    '+961', // Liban
    '+962', // Jordanie
    '+963', // Syrie
    '+964', // Irak
    '+965', // Koweït
    '+966', // Arabie saoudite
    '+967', // Yémen
    '+968', // Oman
    '+970', // Palestine
    '+971', // Émirats arabes unis
    '+972', // Israël
    '+973', // Bahreïn
    '+974', // Qatar
    '+975', // Bhoutan
    '+976', // Mongolie
    '+977', // Népal
    '+992', // Tadjikistan
    '+993', // Turkménistan
    '+994', // Azerbaïdjan
    '+995', // Géorgie
    '+996', // Kirghizistan
    '+998', // Ouzbékistan
  ];
  
  // Supprimer les espaces
  let normalized = phone.replace(/\s+/g, '');
  
  // Remplacer les codes pays par 0
  for (const code of countryCodes) {
    const cleanCode = code.replace(/\s+/g, ''); // Nettoyer le code des espaces
    if (normalized.startsWith(cleanCode)) {
      normalized = '0' + normalized.slice(cleanCode.length);
      break;
    }
  }
  
  // Si le numéro commence par + mais n'a pas été remplacé, supprimer simplement le +
  if (normalized.startsWith('+')) {
    normalized = normalized.slice(1);
  }
  
  // Supprimer tous les caractères non numériques restants
  return normalized.replace(/\D/g, "");
}

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Récupérer le nom de l'agent
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
        alert("Veuillez saisir une adresse BEP20 valide ");
        return false;
      }
    } else {
      const recipientNameToUse = recipientName.trim() || user.name || "";
      if (!recipientNameToUse.trim()) {
        alert("Veuillez saisir le nom du bénéficiaire.");
        return false;
      }
      
      // Vérifier que le numéro est valide (sans code pays)
      const phoneNumber = linkedWallet.phoneNumber || "";
      if (!phoneNumber || phoneNumber.length < 8) {
        alert("Veuillez vérifier votre numéro de téléphone.");
        return false;
      }
    }

    // Vérifier la limite de retrait selon le niveau et les parrainages
    const maxAllowedAmount = Math.floor(accountBalance * withdrawalLimit);
    if (numericAmount > maxAllowedAmount) {
      const percentage = Math.round(withdrawalLimit * 100);
      const uniqueLevels = new Set(directReferrals.map(r => r.level).filter(Boolean)).size;
      
      let message = `⚠️ Limite de retrait dépassée!\n\n`;
      message += `Votre niveau: ${userLevel || 'Non défini'}\n`;
      message += `Limite actuelle: ${percentage}% de votre solde\n`;
      message += `Montant maximum: ${formatAmount(maxAllowedAmount)} CDF\n`;
      message += `Montant demandé: ${formatAmount(numericAmount)} CDF\n\n`;
      
      if (withdrawalLimit < 1.0) {
        message += `📢 Pour débloquer 100% de votre solde:\n`;
        message += `• Invitez 3 personnes de niveaux différents\n`;
        message += `• Actuellement: ${directReferrals.length} parrainage(s) direct(s)\n`;
        message += `• Niveaux différents: ${uniqueLevels}\n\n`;
        message += `Ajustez le montant ou invitez plus de personnes.`;
      }
      
      alert(message);
      return false;
    }

    return true;
  };

  // Fonction pour vérifier si on est dans les heures ouvrables (8h-16h heure de Kinshasa)
  const isWithinBusinessHours = () => {
    // Créer une date avec le timezone de Kinshasa (UTC+1)
    const now = new Date();
    const kinshasaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Kinshasa' }));
    const currentHour = kinshasaTime.getHours();
    
    // Vérifier si l'heure est entre 8h et 16h
    return currentHour >= 8 && currentHour < 16;
  };

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
      const now = new Date();
      const kinshasaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Kinshasa' }));
      const currentHour = kinshasaTime.getHours();
      const currentMinute = kinshasaTime.getMinutes();
      
      alert(
        `⏰ Retraits disponibles uniquement entre 8h et 16h\n\n` +
        `Heure actuelle à Kinshasa: ${currentHour}h${currentMinute.toString().padStart(2, '0')}\n\n` +
        `Les retraits sont disponibles de 8h00 à 16h00 .\n` +
        `Veuillez réessayer pendant les heures ouvrables.`
      );
      return;
    }
     
    if (!userInfo.uid) {
      alert('Veuillez vous connecter pour effectuer un retrait.');
      router.push('/auth/login');
      return;
    }

    setIsProcessing(true);
  await autoSaveProfileAfterWithdrawal();
    try {
      const recipientNameToUse = recipientName.trim() || userInfo.name || "";
      
      // MODIFICATION : Envoyer SEULEMENT le numéro local sans code pays
      const withdrawalData = {
        profileSource: source,
        amount: numericAmount,
        fees: fees,
        netAmount: totalReceived,
        paymentMethod: selectedMethodData?.name || '',
        recipientPhone: selectedMethod === "crypto" ? "" : linkedWallet.phoneNumber || "", // SEULEMENT numéro local
        countryCode: selectedMethod === "crypto" ? "" : selectedCountryCode, // Code pays séparé
        recipientName: selectedMethod === "crypto" ? "" : recipientNameToUse,
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

          const now = new Date();
  const formattedDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
        let message = `✅ Demande de retrait soumise !\n\n` +
        
          `ID: ${result.withdrawalId}\n` +
           `Date: ${formattedDate}\n` +
          `Montant: ${formatAmount(numericAmount)} CDF\n` +
          `Frais: ${formatAmount(fees)} CDF\n` +
          `À recevoir: ${formatAmount(totalReceived)} CDF\n` +
          `Moyen: ${selectedMethodData?.name}\n` +
          `Agent: ${getAgentName()}\n`;
        
        if (selectedMethod === "crypto") {
          message += `Adresse: ${cryptoAddress}\n\n`;
        } else {
          message +=`Numéro: ${linkedWallet.phoneNumber || ""}\n` +
                     `Nom: ${recipientNameToUse}\n\n`;
        }
        
        message += `Votre demande est en attente de validation.\n` +
          `Le virement sera effectué après approbation admin.`;
        
        alert(message);
        
        // Sauvegarde automatique du profil après retrait réussi
          // await autoSaveProfileAfterWithdrawal();
        
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
    setIsEditing(true);
  };

  const handleSaveWallet = () => {
    if (isEditing) {
      const phoneNumber = linkedWallet.phoneNumber || "";
      
      if (!phoneNumber || phoneNumber.trim() === "") {
        alert("Veuillez saisir un numéro valide.");
        return;
      }

      // Validation du numéro local (sans code pays)
      if (phoneNumber.length < 8 || !/^\d+$/.test(phoneNumber)) {
        alert("Veuillez saisir un numéro valide (minimum 8 chiffres)");
        return;
      }

      setIsEditing(false);
      
      // Sauvegarder automatiquement le profil
      if (hasProfile) {
        updateProfile({
          phoneNumber: phoneNumber,
          provider: linkedWallet.provider,
          countryCode: selectedCountryCode
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

 const changeLinkedWallet = (provider) => {
  if (provider === "crypto") {
    setLinkedWallet({
      provider: "crypto",
      phoneNumber: ""
    });
    // Pré-remplir avec l'adresse crypto du profil si disponible
    if (profile?.cryptoAddress) {
      setCryptoAddress(profile.cryptoAddress);
    }
  } else {
    setLinkedWallet({
      provider: provider,
      phoneNumber: profile?.phoneNumber || linkedWallet.phoneNumber || ""
    });
    // Effacer l'adresse crypto quand on passe à mobile
    setCryptoAddress("");
  }
  setSelectedMethod(provider);
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

  // Fonction pour formater l'affichage du numéro
  const formatPhoneDisplay = () => {
    const phoneNumber = linkedWallet.phoneNumber ?  linkedWallet.phoneNumber : normalizePhone(user.phone);
    if (!phoneNumber) return "Non défini";
    return `${phoneNumber}`;
  };

  // Fonction pour copier le numéro complet
  const copyFullPhoneNumber = () => {
    const phoneNumber = linkedWallet.phoneNumber || "";
    if (!phoneNumber) return;
    const fullNumber = `${selectedCountryCode}${phoneNumber}`;
    copyToClipboard(fullNumber, "wallet");
  };

 if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
        {/* Header simplifié */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor:pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour Accueil</span>
            </button>
          </div>
        </div>

        {/* Contenu principal de maintenance */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden"
          >
            {/* Bannière supérieure */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <AlertCircle className="w-12 h-12" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">🔧 Service en maintenance</h1>
              <p className="text-amber-100 text-lg">Retraits temporairement indisponibles</p>
            </div>

            {/* Corps du message */}
            <div className="p-8 space-y-8">
              {/* Message principal */}
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-gray-600 text-lg mb-4">
                  Nous améliorons actuellement notre service de retrait pour vous offrir une meilleure expérience.
                </p>
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center justify-center gap-2 text-amber-800 font-semibold mb-3">
                   
                  </div>
                  <p className="text-amber-700">
                    Nos équipes travaillent pour rétablir le service dans les plus brefs délais.
                    Nous vous remercions pour votre patience.
                  </p>
                </div>
              </div>

              {/* Options disponibles pendant la maintenance */}
              {/* <div className="grid md:grid-cols-3 gap-4 mt-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-1">Solde disponible</h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatAmount(accountBalance)} CDF
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    Votre solde est toujours accessible
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-green-50 rounded-xl p-4 text-center border border-green-200"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-900 mb-1">Fonds sécurisés</h3>
                  <p className="text-sm text-green-700">
                    Vos fonds sont en sécurité pendant la maintenance
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-1">Retour estimé</h3>
                  <p className="text-sm text-purple-700">
                    Service disponible dans quelques heures
                  </p>
                </motion.div>
              </div> */}

              {/* Section support */}
              <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl p-6 mt-6">
                <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-900 text-lg mb-2">
                      📞 Besoin d'aide ?
                    </h3>
                    <p className="text-amber-800">
                      Notre équipe support est disponible pour répondre à vos questions.
                    </p>
                  </div>
                  <button
                    onClick={() => window.open(`https://wa.me/${cleanedNumber}`, '_blank')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>📱</span>
                    Contacter le support
                  </button>
                </div>
              </div>

             
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {/* ⏱️ Dernière mise à jour : {new Date().toLocaleString('fr-FR')} */}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
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
        {/* Bandeau informatif des heures de retrait */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 rounded-xl p-4 border ${
            isWithinBusinessHours()
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 ${
              isWithinBusinessHours() ? "text-green-600" : "text-amber-600"
            }`} />
            <div className="flex-1">
              <p className={`font-medium ${
                isWithinBusinessHours() ? "text-green-900" : "text-amber-900"
              }`}>
                {isWithinBusinessHours() 
                  ? "✅ Retraits disponibles" 
                  : "⏰ Retraits temporairement indisponibles"
                }
              </p>
              <p className={`text-sm ${
                isWithinBusinessHours() ? "text-green-700" : "text-amber-700"
              }`}>
                Les retraits sont disponibles de 8h00 à 16h00 
                {!isWithinBusinessHours() && " - Veuillez réessayer pendant les heures ouvrables"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bandeau de limite quotidienne (1 retrait par jour) */}
        {/* Afficher immédiatement, même pendant le chargement */}
        {(checkingDailyLimit || hasWithdrawnToday) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-6 rounded-xl p-4 border ${
              checkingDailyLimit 
                ? "bg-blue-50 border-blue-200" 
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {checkingDailyLimit ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <div className="flex-1">
                {checkingDailyLimit ? (
                  <>
                    <p className="font-semibold text-blue-900">
                      🔍 Vérification de la limite quotidienne...
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Vérification de vos retraits d'aujourd'hui en cours...
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-900">
                      ⛔ Limite quotidienne atteinte
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Vous avez déjà effectué un retrait aujourd'hui
                      {lastWithdrawalDate && ` à ${lastWithdrawalDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}.
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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

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

            {/* Bandeau de limite de retrait */}
            {!withdrawalLimitLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`rounded-xl p-4 border ${
                  withdrawalLimit >= 1.0
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    withdrawalLimit >= 1.0 ? "bg-green-100" : "bg-amber-100"
                  }`}>
                    {withdrawalLimit >= 1.0 ? (
                      <CheckCircle className={`w-5 h-5 text-green-600`} />
                    ) : (
                      <AlertCircle className={`w-5 h-5 text-amber-600`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      withdrawalLimit >= 1.0 ? "text-green-900" : "text-amber-900"
                    }`}>
                      {withdrawalLimit >= 1.0 
                        ? "✅ Retrait illimité activé" 
                        : `⚠️ Limite de retrait: ${Math.round(withdrawalLimit * 100)}%`
                      }
                    </p>
                    <p className={`text-sm mt-1 ${
                      withdrawalLimit >= 1.0 ? "text-green-700" : "text-amber-700"
                    }`}>
                      {withdrawalLimit >= 1.0 ? (
                        <>
                          Vous avez {directReferrals.length} parrainage(s) direct(s) de niveaux différents. 
                          Vous pouvez retirer 100% de votre solde.
                        </>
                      ) : (
                        <>
                          Niveau: {userLevel || 'Non défini'} • 
                          Maximum: {formatAmount(Math.floor(accountBalance * withdrawalLimit))} CDF
                        </>
                      )}
                    </p>
                    {withdrawalLimit < 1.0 && (
                      <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-800 font-medium">
                          💡 Pour débloquer 100% de votre solde:
                        </p>
                        <ul className="text-xs text-amber-700 mt-1 space-y-1">
                          <li>• Invitez 3 personnes de niveaux d'investissement différents</li>
                          <li>• Actuellement: {directReferrals.length} parrainage(s) direct(s)</li>
                          <li>• Niveaux différents: {new Set(directReferrals.map(r => r.level).filter(Boolean)).size}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

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
              
              {/* Indicateur de source */}
              {selectedMethod !== "crypto" && (
                <div className="mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hasProfile 
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {hasProfile ? "📁 Profil sauvegardé" : "👤 Informations du compte"}
                  </span>
                </div>
              )}
              
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
                    <div className="">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro de téléphone
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          <input
                            type="text"
                            value={linkedWallet.phoneNumber || ""}
                            onChange={(e) => setLinkedWallet({
                              ...linkedWallet,
                              phoneNumber: e.target.value.replace(/\D/g, "")
                            })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                            placeholder="Ex: 897654321"
                          />
                          <button
                            onClick={handleSaveWallet}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1"
                          >
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPhoneDisplay()}
                          </p>
                          {profile?.recipientName && (
                            <p className="text-sm text-gray-600 mt-1">
                              Nom: {profile.recipientName}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            {hasProfile 
                              ? ""
                              : "Ce numéro peut être modifié à tout moment selon vos préférences"}
                          </p>
                        </div>
                        <button
                          onClick={copyFullPhoneNumber}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          disabled={!linkedWallet.phoneNumber}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedField === "wallet" ? "Copié !" : "Copier"}
                        </button>
                      </div>
                      
                     
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
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Numéro de téléphone
                              </label>
                              
                              <div className="flex items-center gap-2 mb-2">
                             
                                <input
                                  type="text"
                                  value={linkedWallet.phoneNumber || ""}
                                  onChange={(e) => setLinkedWallet({
                                    ...linkedWallet,
                                    phoneNumber: e.target.value.replace(/\D/g, "")
                                  })}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                  placeholder="Numéro "
                                />
                              </div>
                              
                              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div>
                                  <p className="text-sm font-medium text-blue-900">Numéro complet:</p>
                                  <p className="text-lg font-bold text-blue-800">
                                    {linkedWallet?.phoneNumber ? linkedWallet.phoneNumber : normalizePhone(user.phone)}
                                  </p>
                                </div>
                              
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
                            <>
                              <div className="pb-3 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-green-900">Nom bénéficiaire</span>
                                </div>
                                <p className="text-sm font-medium text-green-900">
                                  {recipientName}
                                </p>
                              </div>
                              
                              <div className="pb-3 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-green-900">Numéro de retrait</span>
                                </div>
                                <p className="text-sm font-medium text-green-900">
                                  {linkedWallet.phoneNumber || "Non défini"}
                                </p>
                               
                              </div>
                            </>
                          )}

                          <div className="flex justify-between">
                            <span className={selectedMethod === "crypto" ? "text-amber-900" : "text-green-900"}>
                              Moyen de retrait :
                            </span>
                            <span className="font-semibold">{selectedMethodData.name}</span>
                          </div>
                          
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
                              Frais ({selectedMethod === "crypto" ? "20%" : "20%"}) :
                            </span>
                            <span className="font-semibold text-red-600">-{formatAmount(fees)} CDF</span>
                          </div>

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
                                <li>• Frais de retrait : 20% du montant retiré</li>
                                <li>• Minimum : 5,000 CDF pour les retraits crypto</li>
                                <li>• Utilisez toujours une adresse BEP20 valide</li>
                                <li>• Vérifiez votre adresse avant de confirmer</li>
                                <li>• Les transactions crypto sont irréversibles</li>
                                <li>• Contactez le support en cas de problème</li>
                              </>
                            ) : (
                              <>
                                <li>• Délai de traitement : Moins de 30min (max 24h)</li>
                                <li>• Horaires : Lundi au samedi, 8h00 à 16h00</li>
                                <li>• Frais de retrait : 20% du montant retiré</li>
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
                      <p className="text-xs text-gray-500">({selectedMethod === "crypto" ? "20%" : "20%"} du montant)</p>
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
                
                {selectedMethod && selectedMethod !== "crypto" && (
                  <>
               
                    
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Numéro de retrait</span>
                        <button
                          onClick={() => copyToClipboard(linkedWallet.phoneNumber, "receipt-number")}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                          disabled={!linkedWallet.phoneNumber}
                        >
                          Copier
                        </button>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {linkedWallet.phoneNumber ? linkedWallet.phoneNumber :  normalizePhone(user.phone)  || "Non défini"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Utilisez uniquement ce numéro pour les retraits
                      </p>
                    </div>
                  </>
                )}
                
                {selectedMethod === "crypto" && (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Adresse BEP20</span>
                      {cryptoAddress && (
                        <button
                          onClick={() => copyToClipboard(cryptoAddress, "crypto-summary")}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Copier
                        </button>
                      )}
                    </div>
                    {cryptoAddress ? (
                      <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-2 rounded mt-1">
                        {cryptoAddress}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">À saisir</p>
                    )}
                  </div>
                )}
                
                {/* Nom de l'agent */}
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
                disabled={isProcessing || !numericAmount || !selectedMethod || numericAmount < (selectedMethodData?.minAmount || 0) || !isWithinBusinessHours() || hasWithdrawnToday}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing || !numericAmount || !selectedMethod || numericAmount < (selectedMethodData?.minAmount || 0) || !isWithinBusinessHours() || hasWithdrawnToday
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
                ) : hasWithdrawnToday ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Limite quotidienne atteinte
                  </span>
                ) : !isWithinBusinessHours() ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    Retraits disponibles de 8h à 16h
                  </span>
                ) : (
                  "Confirmer le retrait"
                )}
              </button>
              
              {(!numericAmount || !selectedMethod || !isWithinBusinessHours() || hasWithdrawnToday) && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  {!numericAmount && "Saisissez un montant pour continuer"}
                  {numericAmount && !selectedMethod && "Sélectionnez un moyen de retrait"}
                  {numericAmount && selectedMethod && numericAmount < (selectedMethodData?.minAmount || 0) && `Minimum ${formatAmount(selectedMethodData.minAmount)} CDF`}
                  {numericAmount && selectedMethod && numericAmount >= (selectedMethodData?.minAmount || 0) && !isWithinBusinessHours() && !hasWithdrawnToday && "Les retraits sont disponibles de 8h00 à 16h00"}
                  {numericAmount && selectedMethod && numericAmount >= (selectedMethodData?.minAmount || 0) && isWithinBusinessHours() && hasWithdrawnToday && "Vous avez déjà effectué un retrait aujourd'hui - Prochain retrait demain"}
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
                    <strong>Frais de retrait :</strong> 20% (mobiles) 
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span className="text-sm">
                    Minimum : 1 ,500 CDF (mobiles) / 5,000 CDF (crypto)
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
                    Pour les retraits
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
                onClick={() => window.open(`https://wa.me/${cleanedNumber}`, '_blank')}
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
