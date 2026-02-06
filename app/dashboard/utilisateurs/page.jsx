// "use client";

// import { 
//   Search,
//   Filter,
//   Plus,
//   Download,
//   Edit,
//   Trash2,
//   Eye,
//   Mail,
//   Phone,
//   Calendar,
//   Shield,
//   CheckCircle,
//   XCircle,
//   MoreVertical,
//   UserPlus,
//   Ban,
//   Unlock,
//   Send,
//   RefreshCw,
//   AlertCircle,
//   Wallet,
//   TrendingUp,
//   CreditCard,
//   User,
//   Globe,
//   PhoneCall,
//   MapPin,
//   Clock,
//   DollarSign,
//   BarChart3,
//   Loader2,
//   PlusCircle,
//   MinusCircle,
//   History,
//   LogOut
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import DashboardCard from '@/components/DashboardCard';
// import Drawer from '@/components/Drawer';
// import { auth, db } from '@/lib/firebase';
// import { 
//   collection, 
//   getDocs, 
//   doc, 
//   updateDoc, 
//   deleteDoc,
//   getDoc,
//   query,
//   where,
//   orderBy,
//   limit,
//   serverTimestamp,
//   increment,
//   arrayUnion
// } from 'firebase/firestore';
// import { useAuth } from '@/contexts/AuthContext';
// import BackButton from '@/components/BackButton';

// export default function UtilisateursPage() {
//   const [filter, setFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
  
//   const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
//   const [editDrawerOpen, setEditDrawerOpen] = useState(false);
//   const [balanceDrawerOpen, setBalanceDrawerOpen] = useState(false); 
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userWallet, setUserWallet] = useState(null);
//   const [userTransactions, setUserTransactions] = useState([]);
//   const [drawerLoading, setDrawerLoading] = useState(false);
  
//   // NOUVEAU: État pour la modification du solde
//  const [balanceForm, setBalanceForm] = useState({
//   type: 'add', 
//   amount: '',
//   reason: '',
//   notes: '',
//   balanceType: 'wallet' 
// })
  
//   const [balanceHistory, setBalanceHistory] = useState([]);
//   const [balanceHistoryLoading, setBalanceHistoryLoading] = useState(false); 
//    const  {user} = useAuth();


//   const [editForm, setEditForm] = useState({
//     phone: '',
//     email: '',
//     displayName: '',
//     role: 'user',
//     status: 'active',
//     invitationCode: '' ,
//     fullName: ''
//   });

// const getCurrentBalance = (balanceType) => {
//   if (!userWallet) return 0;
  
//   switch(balanceType) {
//     case 'wallet':
//       return userWallet.available || 0;
//     case 'action':
//       return userWallet.invested || 0;
//     case 'referralEarnings':
//       return userWallet.referralEarnings || 0;
//     default:
//       return 0;
//   }
// };

// const getBalanceLabel = (balanceType) => {
//   switch(balanceType) {
//     case 'wallet':
//       return 'Solde Disponible';
//     case 'action':
//       return 'Solde Investi';
//     case 'referralEarnings':
//       return 'Gains Parrainage';
//     default:
//       return 'Solde';
//   }
// };
//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       const usersSnapshot = await getDocs(collection(db, 'users'));
//       const usersData = usersSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         registration: doc.data().createdAt?.toDate?.() || new Date(),
//         lastLogin: doc.data().lastLogin?.toDate?.() || null
//       }));
//       setUsers(usersData);
//     } catch (error) {
//       console.error('Erreur chargement utilisateurs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserDetails = async (userId) => {
//     try {
//       setDrawerLoading(true);
      
//       const userDoc = await getDoc(doc(db, 'users', userId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         setUserDetails({
//           id: userDoc.id,
//           ...userData
//         });
        
//         setEditForm({
//           phone: userData.phone || '',
//           email: userData.email || '',
//           displayName: userData.displayName || '',
//           role: userData.role || 'user',
//           status: userData.status || 'active',
//           invitationCode: userData?.invitationCode || ''
//         });
//       }

//       const walletDoc = await getDoc(doc(db, 'wallets', userId));
//       if (walletDoc.exists()) {
//         const walletData = walletDoc.data();
//         setUserWallet({
//           available: walletData.balances?.wallet?.amount || 0,
//           invested: walletData.balances?.action?.amount || 0,
//           totalDeposited: walletData.balances?.totalDeposited?.amount || 0,
//           referralEarnings: walletData.stats?.referralEarnings || 0,
//           totalEarned: walletData.stats?.totalEarned || 0,
//           totalInvested: walletData.stats?.totalInvested || 0,
//           totalWithdrawn: walletData.stats?.totalWithdrawn || 0,
//           balanceHistory: walletData.balanceHistory || []
//         });
        
//         // Charger l'historique des modifications de solde
//         setBalanceHistory(walletData.balanceHistory || []);
//       }

//       const transactionsQuery = query(
//         collection(db, 'transactions'),
//         where('userId', '==', userId),
//         orderBy('createdAt', 'desc'),
//         limit(10)
//       );
//       const transactionsSnap = await getDocs(transactionsQuery);
//       setUserTransactions(transactionsSnap.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })));

//     } catch (error) {
//       console.error('Erreur chargement détails:', error);
//     } finally {
//       setDrawerLoading(false);
//     }
//   };

//   // NOUVEAU: Charger l'historique des modifications de solde
//   const loadBalanceHistory = async (userId) => {
//     try {
//       setBalanceHistoryLoading(true);
//       const walletDoc = await getDoc(doc(db, 'wallets', userId));
//       if (walletDoc.exists()) {
//         const walletData = walletDoc.data();
//         setBalanceHistory(walletData.balanceHistory || []);
//       }
//     } catch (error) {
//       console.error('Erreur chargement historique solde:', error);
//     } finally {
//       setBalanceHistoryLoading(false);
//     }
//   };

//   const handleViewUser = async (user) => {
//     setSelectedUser(user);
//     await loadUserDetails(user.id);
//     setViewDrawerOpen(true);
//   };

//   const handleEditUser = async (user) => {
//     setSelectedUser(user);
//     await loadUserDetails(user.id);
//     setEditDrawerOpen(true);
//   };

//   // NOUVEAU: Ouvrir le drawer de modification du solde
//  const handleBalanceModification = async (user) => {
//   setSelectedUser(user);
//   await loadUserDetails(user.id);
//   setBalanceForm({
//     type: 'add',
//     amount: '',
//     reason: '',
//     notes: '',
//     balanceType: 'wallet'
//   });
//   setBalanceDrawerOpen(true);
// };

//   const handleSaveEdit = async () => {
//     if (!selectedUser) return;
    
//     try {
//       setActionLoading(true);
//       const userRef = doc(db, 'users', selectedUser.id);
      
//       await updateDoc(userRef, {
//         ...editForm,
//         updatedAt: serverTimestamp()
//       });
      
//       alert('Utilisateur mis à jour avec succès !');
//       setEditDrawerOpen(false);
//       await loadUsers();
//     } catch (error) {
//       console.error('Erreur mise à jour:', error);
//       alert('Erreur lors de la mise à jour');
//     } finally {
//       setActionLoading(false);
//     }
//   };

// //   NOUVEAU: Fonction pour modifier le solde
// // Cherchez cette fonction et modifiez-la :
// const handleBalanceUpdate = async () => {
//   if (!selectedUser || !balanceForm.amount || isNaN(parseFloat(balanceForm.amount))) {
//     alert('Veuillez saisir un montant valide');
//     return;
//   }

//   const amount = parseFloat(balanceForm.amount);
//   if (amount <= 0) {
//     alert('Le montant doit être supérieur à 0');
//     return;
//   }

//   // Vérification du solde disponible seulement pour le retrait du wallet
//   if (balanceForm.type === 'remove' && balanceForm.balanceType === 'wallet') {
//     const currentBalance = getCurrentBalance(balanceForm.balanceType);
//     if (amount > currentBalance) {
//       alert(`Le solde disponible est insuffisant. Solde actuel: ${formatAmount(currentBalance)} CDF`);
//       return;
//     }
//   }

//   const currentUser = auth.currentUser;
//   if (!currentUser) {
//     alert('Vous devez être connecté pour effectuer cette action');
//     return;
//   }

//   const adminName = currentUser.displayName || currentUser.email || 'Administrateur';
  
//   if (!confirm(`${balanceForm.type === 'add' ? 'Ajouter' : 'Retirer'} ${formatAmount(amount)} CDF du ${getBalanceLabel(balanceForm.balanceType)} de ${selectedUser.displayName || selectedUser.email || selectedUser.phone} ?`)) {
//     return;
//   }

//   try {
//     setActionLoading(true);
//     const walletRef = doc(db, 'wallets', selectedUser.id);
//     const userDoc = await getDoc(walletRef);
    
//     if (!userDoc.exists()) {
//       alert('Portefeuille utilisateur non trouvé');
//       return;
//     }

//     // Déterminer le chemin Firestore selon le type de solde
//     let firestorePath = '';
//     switch(balanceForm.balanceType) {
//       case 'wallet':
//         firestorePath = 'balances.wallet.amount';
//         break;
//       case 'action':
//         firestorePath = 'balances.action.amount';
//         break;
//       case 'referralEarnings':
//         firestorePath = 'stats.referralEarnings';
//         break;
//       default:
//         firestorePath = 'balances.wallet.amount';
//     }

//    let currentBalance = 0;
// const walletData = userDoc.data();

// // Récupérer le bon solde selon le type
// switch(balanceForm.balanceType) {
//   case 'wallet':
//     currentBalance = walletData?.balances?.wallet?.amount || 0;
//     break;
//   case 'action':
//     currentBalance = walletData?.balances?.action?.amount || 0;
//     break;
//   case 'referralEarnings':
//     currentBalance = walletData?.stats?.referralEarnings || 0;
//     break;
// }
    
//     const newAmount = balanceForm.type === 'add' ? amount : -amount;
//     const newBalance = currentBalance + newAmount;

//     // Créer l'entrée d'historique
//     const balanceHistoryEntry = {
//       type: balanceForm.type,
//       amount: amount,
//       balanceType: balanceForm.balanceType,
//       balanceLabel: getBalanceLabel(balanceForm.balanceType),
//       previousBalance: currentBalance,
//       newBalance: newBalance,
//       reason: balanceForm.reason,
//       notes: balanceForm.notes,
//       adminId: currentUser.uid,
//       adminName: adminName,
//       timestamp: Date.now(),
//       date: new Date().toISOString()
//     };

//     // Mettre à jour le solde spécifique et l'historique
//  const updateData = {
//   'balanceHistory': arrayUnion(balanceHistoryEntry),
//   updatedAt: serverTimestamp()
// };

// // Ajouter l'incrémentation/décrémentation du solde selon le type
// updateData[firestorePath] = newBalance; 

// // Mettre à jour les statistiques selon le type d'opération
// if (balanceForm.type === 'add') {
//   // Pour TOUS les ajouts, mettre à jour totalEarned
//   updateData['stats.totalEarned'] = increment(amount);
  
//   // Ajouter des statistiques spécifiques selon le type
//   if (balanceForm.balanceType === 'wallet') {
//     updateData['balances.totalDeposited.amount'] = increment(amount);
//     updateData['stats.totalDeposited'] = increment(amount);
//   } else if (balanceForm.balanceType === 'action') {
//     updateData['stats.totalInvested'] = increment(amount);
//   } else if (balanceForm.balanceType === 'referralEarnings') {
//     updateData['stats.referralEarnings'] = increment(amount);
//   }
// } else {
//   // Pour les retraits
//   if (balanceForm.balanceType === 'wallet') {
//     updateData['stats.totalWithdrawn'] = increment(amount);
//   } else if (balanceForm.balanceType === 'action') {
//     updateData['stats.totalInvested'] = increment(-amount);
//   } else if (balanceForm.balanceType === 'referralEarnings') {
//     updateData['stats.referralEarnings'] = increment(-amount);
//     updateData['stats.totalEarned'] = increment(-amount);
//   }
// }

// await updateDoc(walletRef, updateData);

//     if (balanceForm.type === 'add' && balanceForm.balanceType === 'wallet') {
//       await updateDoc(walletRef, {
//         'balances.totalDeposited.amount': increment(amount),
//         'stats.totalEarned': increment(amount)
//       });
//     }

// const operationType = balanceForm.type === 'add' ? 'ajouté à' : 'retiré de';
// alert(`✅ ${formatAmount(amount)} CDF ${operationType} ${getBalanceLabel(balanceForm.balanceType)} avec succès !\n\n💰 Ancien solde: ${formatAmount(currentBalance)} CDF\n💰 Nouveau solde: ${formatAmount(newBalance)} CDF\n📊 Différence: ${balanceForm.type === 'add' ? '+' : '-'}${formatAmount(amount)} CDF`);
    
//     setBalanceForm({
//       type: 'add',
//       amount: '',
//       reason: '',
//       notes: '',
//       balanceType: 'wallet'
//     });
    
//     await loadUserDetails(selectedUser.id);
//     await loadBalanceHistory(selectedUser.id);
    
//   } catch (error) {
//     console.error('Erreur modification solde:', error);
//     alert('Erreur lors de la modification du solde');
//   } finally {
//     setActionLoading(false);
//   }
// };

//   const handleUserAction = async (action, userId) => {
//     const user = users.find(u => u.id === userId);
//     if (!user) return;

//     const actionText = {
//       activate: 'Activer',
//       suspend: 'Suspendre',
//       delete: 'Supprimer'
//     }[action];

//     if (!confirm(`${actionText} ${user.displayName || user.email || user.phone} ?`)) {
//       return;
//     }

//     try {
//       setActionLoading(true);
//       const userRef = doc(db, 'users', userId);
      
//       switch(action) {
//         case 'activate':
//           await updateDoc(userRef, { 
//             status: 'active',
//             updatedAt: serverTimestamp()
//           });
//           alert(`${user.displayName || user.email || user.phone} activé !`);
//           break;
//         case 'suspend':
//           await updateDoc(userRef, { 
//             status: 'suspended',
//             updatedAt: serverTimestamp()
//           });
//           alert(`${user.displayName || user.email || user.phone} suspendu !`);
//           break;
//         case 'delete':
//           const walletRef = doc(db, 'wallets', userId);
//           await deleteDoc(walletRef);
//           await deleteDoc(userRef);
//           alert(`${user.displayName || user.email || user.phone} supprimé !`);
//           break;
//       }

//       await loadUsers();
//     } catch (error) {
//       console.error(`Erreur ${action} utilisateur:`, error);
//       alert('Erreur lors de l\'opération');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedUsers.length === 0) {
//       alert('Veuillez sélectionner au moins un utilisateur');
//       return;
//     }

//     if (!confirm(`${action === 'delete' ? 'Supprimer' : action === 'suspend' ? 'Suspendre' : 'Activer'} ${selectedUsers.length} utilisateur(s) ?`)) {
//       return;
//     }

//     try {
//       setActionLoading(true);
      
//       for (const userId of selectedUsers) {
//         const userRef = doc(db, 'users', userId);
        
//         switch(action) {
//           case 'activate':
//             await updateDoc(userRef, { 
//               status: 'active',
//               updatedAt: serverTimestamp()
//             });
//             break;
//           case 'suspend':
//             await updateDoc(userRef, { 
//               status: 'suspended',
//               updatedAt: serverTimestamp()
//             });
//             break;
//           case 'delete':
//             await deleteDoc(userRef);
//             break;
//         }
//       }

//       alert(`${selectedUsers.length} utilisateur(s) ${action === 'delete' ? 'supprimé(s)' : action === 'suspend' ? 'suspendu(s)' : 'activé(s)'} !`);
      
//       await loadUsers();
//       setSelectedUsers([]);
//     } catch (error) {
//       console.error('Erreur action groupée:', error);
//       alert('Erreur lors de l\'opération');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     if (filter !== 'all' && user.status !== filter) return false;
//     if (search) {
//       const searchLower = search.toLowerCase();
//       return (
//         user.id?.toLowerCase().includes(searchLower) ||
//         user.displayName?.toLowerCase().includes(searchLower) ||
//         user.email?.toLowerCase().includes(searchLower) ||
//         user.phone?.toLowerCase().includes(searchLower) ||
//         user.phoneNumber?.toLowerCase().includes(searchLower)
//       );
//     }
//     return true;
//   });

//   const roleColors = {
//     admin: 'bg-red-100 text-red-800',
//     moderator: 'bg-purple-100 text-purple-800',
//     user: 'bg-blue-100 text-blue-800'
//   };

//   const statusColors = {
//     active: 'bg-green-100 text-green-800',
//     inactive: 'bg-gray-100 text-gray-800',
//     suspended: 'bg-red-100 text-red-800'
//   };

//   const formatDate = (date) => {
//     if (!date) return 'Jamais';
//     const d = date.toDate ? date.toDate() : new Date(date);
//     return d.toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatAmount = (amount) => {
//     return amount?.toLocaleString('fr-FR') || '0';
//   };

//   const formatHistoryDate = (date) => {
//     if (!date) return 'Date inconnue';
//     const d = date.toDate ? date.toDate() : new Date(date);
//     return d.toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const toggleUserSelection = (userId) => {
//     setSelectedUsers(prev => 
//       prev.includes(userId) 
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedUsers.length === filteredUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(filteredUsers.map(user => user.id));
//     }
//   };

//   const stats = {
//     total: users.length,
//     active: users.filter(u => u.status === 'active').length,
//     suspended: users.filter(u => u.status === 'suspended').length,
//     admins: users.filter(u => u.role === 'admin').length,
//     today: users.filter(u => {
//       const today = new Date();
//       const regDate = u.registration.toDate ? u.registration.toDate() : new Date(u.registration);
//       return regDate.toDateString() === today.toDateString();
//     }).length
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header */}

//        <BackButton />
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
//           <p className="text-sm sm:text-base text-gray-600 mt-1">Gestion des utilisateurs</p>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//           <button 
//             onClick={loadUsers}
//             disabled={actionLoading}
//             className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span className="hidden sm:inline">Actualiser</span>
//           </button>
          
//           {/* Bouton Calculer les gains journaliers */}
//           <button 
//             onClick={calculateDailyGains}
//             disabled={calculatingDailyGains}
//             className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
//               calculatingDailyGains
//                 ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                 : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
//             }`}
//           >
//             {calculatingDailyGains ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 <span>Calcul...</span>
//               </>
//             ) : (
//               <>
//                 <DollarSign className="w-4 h-4" />
//                 <span>Gains Journaliers</span>
//               </>
//             )}
//           </button>
          
//           <Link 
//             href="/dashboard/utilisateurs/nouveau"
//             className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
//           >
//             <UserPlus className="w-4 h-4" />
//             <span>Nouvel utilisateur</span>
//           </Link>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Total</p>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Actifs</p>
//           <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Suspendus</p>
//           <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.suspended}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Admins</p>
//           <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.admins}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Nouveaux</p>
//           <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.today}</p>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
//       <DashboardCard>
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">Tous les statuts</option>
//               <option value="active">Actifs</option>
//               <option value="suspended">Suspendus</option>
//               <option value="inactive">Inactifs</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Actions groupées */}
//         {selectedUsers.length > 0 && (
//           <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//               <div className="flex items-center">
//                 <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2" />
//                 <span className="font-medium text-blue-900 text-sm sm:text-base">
//                   {selectedUsers.length} sélectionné(s)
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-1 sm:gap-2">
//                 <button 
//                   onClick={() => handleBulkAction('activate')}
//                   disabled={actionLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-xs sm:text-sm disabled:opacity-50"
//                 >
//                   <Unlock className="w-3 sm:w-4 h-3 sm:h-4" />
//                   <span className="hidden sm:inline">Activer</span>
//                 </button>
//                 <button 
//                   onClick={() => handleBulkAction('suspend')}
//                   disabled={actionLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-xs sm:text-sm disabled:opacity-50"
//                 >
//                   <Ban className="w-3 sm:w-4 h-3 sm:h-4" />
//                   <span className="hidden sm:inline">Suspendre</span>
//                 </button>
//                 <button 
//                   onClick={() => handleBulkAction('delete')}
//                   disabled={actionLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-xs sm:text-sm disabled:opacity-50"
//                 >
//                   <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
//                   <span className="hidden sm:inline">Supprimer</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </DashboardCard>

//       {/* Table des utilisateurs */}
//       <DashboardCard className='mb-35'>
//         <div className="overflow-x-auto -mx-2 sm:mx-0">
//           <div className="min-w-full inline-block align-middle">
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
//                           onChange={toggleSelectAll}
//                           className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
//                         />
//                       </div>
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Utilisateur
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                       Rôle
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Statut
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                       Inscription
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50">
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
//                           <input
//                             type="checkbox"
//                             checked={selectedUsers.includes(user.id)}
//                             onChange={() => toggleUserSelection(user.id)}
//                             className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
//                           />
//                         </td>
//                         <td className="px-2 sm:px-4 py-3">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//                               {user.fullName?.charAt(0) || user.email?.charAt(0) || user.phone?.charAt(0) || 'U'}
//                             </div>
//                             <div className="ml-2 sm:ml-3 min-w-0">
//                               <div className="text-sm font-medium text-gray-900 truncate">
//                                 {user.fullName || user.fullName || 'Sans nom'}
//                               </div>
//                               <div className="text-xs text-gray-500 flex items-center truncate">
//                                 <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
//                                 <span className="truncate">{user.email || 'Pas d\'email'}</span>
//                               </div>
//                               {user.phone && (
//                                 <div className="text-xs text-gray-500 flex items-center truncate">
//                                   <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
//                                   <span className="truncate">{user.phone}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
//                           <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role || 'user']}`}>
//                             {user.role || 'user'}
//                           </span>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status || 'active']}`}>
//                             {user.status || 'active'}
//                           </span>
//                           <div className="text-xs text-gray-500 mt-1 truncate hidden sm:block">
//                             Dernière connexion: {formatDate(user.lastLogin)}
//                           </div>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">
//                           <div className="text-sm text-gray-900">
//                             <div className="flex items-center">
//                               <Calendar className="w-3 h-3 mr-1 text-gray-400" />
//                               {formatDate(user.registration)}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
//                           <div className="flex items-center space-x-1 sm:space-x-2">
//                             <button
//                               onClick={() => handleViewUser(user)}
//                               className="text-blue-600 hover:text-blue-900 p-1"
//                               title="Voir profil"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleEditUser(user)}
//                               className="text-gray-600 hover:text-gray-900 p-1"
//                               title="Modifier"
//                             >
//                               <Edit className="w-4 h-4" />
//                             </button>
//                             {/* NOUVEAU: Bouton pour modifier le solde */}
//                             <button
//                               onClick={() => handleBalanceModification(user)}
//                               className="text-green-600 hover:text-green-900 p-1"
//                               title="Modifier le solde"
//                             >
//                               <DollarSign className="w-4 h-4" />
//                             </button>
//                             {user.status === 'suspended' ? (
//                               <button 
//                                 onClick={() => handleUserAction('activate', user.id)}
//                                 disabled={actionLoading}
//                                 className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
//                                 title="Réactiver"
//                               >
//                                 <Unlock className="w-4 h-4" />
//                               </button>
//                             ) : (
//                               <button 
//                                 onClick={() => handleUserAction('suspend', user.id)}
//                                 disabled={actionLoading}
//                                 className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
//                                 title="Suspendre"
//                               >
//                                 <Ban className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="px-4 py-8 text-center">
//                         <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
//                         <p className="text-gray-500 text-sm sm:text-base">Aucun utilisateur trouvé</p>
//                         {search && (
//                           <p className="text-xs sm:text-sm text-gray-400 mt-1">
//                             Aucun résultat pour "{search}"
//                           </p>
//                         )}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
        
//         {/* Pagination */}
//         {filteredUsers.length > 0 && (
//           <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//             <div className="text-xs sm:text-sm text-gray-500">
//               Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
//             </div>
//           </div>
//         )}
//       </DashboardCard>

//       {/* Drawer de visualisation */}
//       <Drawer
//         isOpen={viewDrawerOpen}
//         onClose={() => setViewDrawerOpen(false)}
//         title={`Profil de ${selectedUser?.fullName || selectedUser?.email || selectedUser?.phone}`}
//         size="lg"
//         loading={drawerLoading}
//       >
//         {userDetails && userWallet && (
//           <div className="space-y-4 sm:space-y-6">
//             {/* Informations personnelles */}
//             <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-5">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
//                 <User className="w-4 sm:w-5 h-4 sm:h-5" />
//                 Informations personnelles
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Nom complet</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{userDetails.fullName || 'Non spécifié'}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{userDetails.email}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Téléphone</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{userDetails.phone || 'Non spécifié'}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Statut</label>
//                   <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[userDetails.status || 'active']}`}>
//                     {userDetails.status || 'active'}
//                   </span>
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Code d'invitation</label>
//                   <p className="text-gray-900 font-mono text-sm sm:text-base">{userDetails?.invitationCode || 'Non défini'}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Inscription</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{formatDate(userDetails?.createdAt)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Soldes financiers */}
//             <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
//                 <Wallet className="w-4 sm:w-5 h-4 sm:h-5" />
//                 Soldes financiers
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
//                     <span className="text-xs sm:text-sm font-medium text-blue-900">Solde Disponible</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
//                     {formatAmount(userWallet.available)} CDF
//                   </p>
//                   <p className="text-xs text-blue-700 mt-1">Pour investissements/retraits</p>
//                 </div>
//                 <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
//                     <span className="text-xs sm:text-sm font-medium text-green-900">Solde Investi</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
//                     {formatAmount(userWallet.invested)} CDF
//                   </p>
//                   <p className="text-xs text-green-700 mt-1">Actuellement en action</p>
//                 </div>
//                 <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" />
//                     <span className="text-xs sm:text-sm font-medium text-purple-900">Total Dépôts</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
//                     {formatAmount(userWallet.totalDeposited)} CDF
//                   </p>
//                 </div>
//                 <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" />
//                     <span className="text-xs sm:text-sm font-medium text-amber-900">Gains Parrainage</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
//                     {formatAmount(userWallet.referralEarnings)} CDF
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* NOUVEAU: Historique des modifications de solde */}
//             <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
//               <div className="flex items-center justify-between mb-3 sm:mb-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1 sm:gap-2">
//                   <History className="w-4 sm:w-5 h-4 sm:h-5" />
//                   Historique des modifications de solde
//                 </h3>
//                 <button
//                   onClick={() => loadBalanceHistory(selectedUser.id)}
//                   disabled={balanceHistoryLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 disabled:opacity-50"
//                 >
//                   <RefreshCw className={`w-3 sm:w-4 h-3 sm:h-4 ${balanceHistoryLoading ? 'animate-spin' : ''}`} />
//                   Actualiser
//                 </button>
//               </div>
              
//               {balanceHistory.length > 0 ? (
//                 <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
//                   {balanceHistory
//                     .sort((a, b) => {
//                       const dateA = a.timestamp?.toDate?.() || new Date(a.date || 0);
//                       const dateB = b.timestamp?.toDate?.() || new Date(b.date || 0);
//                       return dateB - dateA;
//                     })
//                     .map((entry, index) => (
//                       <div 
//                         key={index} 
//                         className={`p-3 rounded-lg border ${
//                           entry.type === 'add' 
//                             ? 'bg-green-50 border-green-200' 
//                             : 'bg-red-50 border-red-200'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between mb-1">
//                           <div className="flex items-center gap-2">
//                             {entry.type === 'add' ? (
//                               <PlusCircle className="w-4 h-4 text-green-600" />
//                             ) : (
//                               <MinusCircle className="w-4 h-4 text-red-600" />
//                             )}
//                             <span className={`font-semibold ${
//                               entry.type === 'add' ? 'text-green-700' : 'text-red-700'
//                             }`}>
//                               {entry.type === 'add' ? '+' : '-'}{formatAmount(entry.amount)} CDF
//                             </span>
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             {formatHistoryDate(entry.timestamp || entry.date)}
//                           </span>
//                         </div>
                        
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
//                           <div>
//                             <span className="text-gray-600">Ancien solde:</span>{' '}
//                             <span className="font-medium">{formatAmount(entry.previousBalance)} CDF</span>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Nouveau solde:</span>{' '}
//                             <span className="font-medium">{formatAmount(entry.newBalance)} CDF</span>
//                           </div>
//                           <div className="sm:col-span-2">
//                             <span className="text-gray-600">Administrateur:</span>{' '}
//                             <span className="font-medium">{entry.adminName || 'Système'}</span>
//                           </div>
//                           {entry.reason && (
//                             <div className="sm:col-span-2">
//                               <span className="text-gray-600">Motif:</span>{' '}
//                               <span className="font-medium">{entry.reason}</span>
//                             </div>
//                           )}
//                           {entry.notes && (
//                             <div className="sm:col-span-2">
//                               <span className="text-gray-600">Notes:</span>{' '}
//                               <span className="text-gray-700">{entry.notes}</span>
//                             </div>
//                           )}
//                         </div>
//                         Cherchez dans l'historique et ajoutez après le montant :
// <div className="mb-1">
//   <div className="flex items-center gap-2">
//     {entry.type === 'add' ? (
//       <PlusCircle className="w-4 h-4 text-green-600" />
//     ) : (
//       <MinusCircle className="w-4 h-4 text-red-600" />
//     )}
//     <span className={`font-semibold ${
//       entry.type === 'add' ? 'text-green-700' : 'text-red-700'
//     }`}>
//       {entry.type === 'add' ? '+' : '-'}{formatAmount(entry.amount)} CDF
//     </span>
//     <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//       {entry.balanceLabel || 'Solde Disponible'}
//     </span>
//   </div>
// </div>
//                       </div>
//                     ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4">
//                   <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-gray-500 text-sm">Aucune modification de solde enregistrée</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </Drawer>

//       {/* Drawer d'édition */}
//       <Drawer
//         isOpen={editDrawerOpen}
//         onClose={() => setEditDrawerOpen(false)}
//         title={`Modifier ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
//         size="md"
//       >
//         <div className="space-y-3 sm:space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Nom complet
//             </label>
//             <input
//               type="text"
//               value={editForm.displayName}
//               onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//               placeholder="Nom de l'utilisateur"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={editForm.email}
//               onChange={(e) => setEditForm({...editForm, email: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//               placeholder="email@exemple.com"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Téléphone
//             </label>
//             <input
//               type="tel"
//               value={editForm.phone}
//               onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//               placeholder="+243 XX XXX XX XX"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Rôle
//             </label>
//             <select
//               value={editForm.role}
//               onChange={(e) => setEditForm({...editForm, role: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//             >
//               <option value="user">Utilisateur</option>
//               <option value="moderator">Modérateur</option>
//               <option value="admin">Administrateur</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Statut
//             </label>
//             <select
//               value={editForm.status}
//               onChange={(e) => setEditForm({...editForm, status: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//             >
//               <option value="active">Actif</option>
//               <option value="suspended">Suspendu</option>
//               <option value="inactive">Inactif</option>
//             </select>
//           </div>
//           <div className="pt-3 sm:pt-4 border-t border-gray-200">
//             <button
//               onClick={handleSaveEdit}
//               disabled={actionLoading}
//               className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
//             >
//               {actionLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
//             </button>
//           </div>
//         </div>
//       </Drawer>

//       {/* NOUVEAU: Drawer de modification du solde */}
//       <Drawer
//         isOpen={balanceDrawerOpen}
//         onClose={() => setBalanceDrawerOpen(false)}
//         title={`Modifier le solde de ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
//         size="md"
//       >
//         {selectedUser && userWallet && ( 
//           <div className="space-y-4 sm:space-y-6 mb-20">
//             {/* Informations sur le solde actuel */}
//           <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Type de solde à modifier
//       </label>
//       <div className="grid grid-cols-3 gap-2">
//         <button
//           type="button"
//           onClick={() => setBalanceForm({...balanceForm, balanceType: 'wallet'})}
//           className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
//             balanceForm.balanceType === 'wallet'
//               ? 'border-blue-500 bg-blue-50 text-blue-700'
//               : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
//           }`}
//         >
//           <CreditCard className="w-5 h-5 mb-1" />
//           <span className="text-xs font-medium">Disponible</span>
//           <span className="text-xs mt-1">{formatAmount(userWallet.available)} CDF</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setBalanceForm({...balanceForm, balanceType: 'action'})}
//           className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
//             balanceForm.balanceType === 'action'
//               ? 'border-green-500 bg-green-50 text-green-700'
//               : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
//           }`}
//         >
//           <TrendingUp className="w-5 h-5 mb-1" />
//           <span className="text-xs font-medium">Investi</span>
//           <span className="text-xs mt-1">{formatAmount(userWallet.invested)} CDF</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setBalanceForm({...balanceForm, balanceType: 'referralEarnings'})}
//           className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
//             balanceForm.balanceType === 'referralEarnings'
//               ? 'border-amber-500 bg-amber-50 text-amber-700'
//               : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300'
//           }`}
//         >
//           <BarChart3 className="w-5 h-5 mb-1" />
//           <span className="text-xs font-medium">Parrainage</span>
//           <span className="text-xs mt-1">{formatAmount(userWallet.referralEarnings)} CDF</span>
//         </button>
//       </div>
//     </div>

//     {/* Informations sur le solde actuel */}
//     <div className={`rounded-lg sm:rounded-xl p-4 border ${
//       balanceForm.balanceType === 'wallet' ? 'bg-blue-50 border-blue-200' :
//       balanceForm.balanceType === 'action' ? 'bg-green-50 border-green-200' :
//       'bg-amber-50 border-amber-200'
//     }`}>
//       <div className="flex items-center justify-between mb-2">
//         <span className={`text-sm font-medium ${
//           balanceForm.balanceType === 'wallet' ? 'text-blue-900' :
//           balanceForm.balanceType === 'action' ? 'text-green-900' :
//           'text-amber-900'
//         }`}>
//           {getBalanceLabel(balanceForm.balanceType)} actuel
//         </span>
//         <span className={`text-lg sm:text-xl font-bold ${
//           balanceForm.balanceType === 'wallet' ? 'text-blue-700' :
//           balanceForm.balanceType === 'action' ? 'text-green-700' :
//           'text-amber-700'
//         }`}>
//           {formatAmount(getCurrentBalance(balanceForm.balanceType))} CDF
//         </span>
//       </div>
//       <p className={`text-xs ${
//         balanceForm.balanceType === 'wallet' ? 'text-blue-600' :
//         balanceForm.balanceType === 'action' ? 'text-green-600' :
//         'text-amber-600'
//       }`}>
//         {balanceForm.balanceType === 'wallet' 
//           ? 'Solde disponible pour investissements et retraits'
//           : balanceForm.balanceType === 'action'
//           ? 'Montant actuellement investi dans des actions'
//           : 'Gains cumulés provenant du parrainage'
//         }
//       </p>
//     </div>

//             {/* Formulaire de modification */}
//             <div className="space-y-3 sm:space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type d'opération
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setBalanceForm({...balanceForm, type: 'add'})}
//                     className={`p-3 sm:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
//                       balanceForm.type === 'add'
//                         ? 'border-green-500 bg-green-50 text-green-700'
//                         : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
//                     }`}
//                   >
//                     <PlusCircle className="w-6 h-6 mb-2" />
//                     <span className="font-semibold">Ajouter</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setBalanceForm({...balanceForm, type: 'remove'})}
//                     className={`p-3 sm:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
//                       balanceForm.type === 'remove'
//                         ? 'border-red-500 bg-red-50 text-red-700'
//                         : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
//                     }`}
//                   >
//                     <MinusCircle className="w-6 h-6 mb-2" />
//                     <span className="font-semibold">Retirer</span>
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Montant (CDF)
//                 </label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <span className="text-gray-500">CDF</span>
//                   </div>
//                   <input
//                     type="number"
//                     value={balanceForm.amount}
//                     onChange={(e) => setBalanceForm({...balanceForm, amount: e.target.value})}
//                     className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
//                     placeholder="0"
//                     min="1"
//                     step="100"
//                   />
//                 </div>
//              {balanceForm.amount && !isNaN(parseFloat(balanceForm.amount)) && (
//   <div className={`mt-2 p-2 rounded ${
//     balanceForm.type === 'add'
//       ? 'bg-green-50 text-green-700'
//       : 'bg-red-50 text-red-700'
//   }`}>
//     <div className="flex justify-between text-sm">
//       <span>Nouveau solde:</span>
//       <span className="font-bold">
//         {formatAmount(
//           balanceForm.type === 'add'
//             ? getCurrentBalance(balanceForm.balanceType) + parseFloat(balanceForm.amount)
//             : getCurrentBalance(balanceForm.balanceType) - parseFloat(balanceForm.amount)
//         )} CDF
//       </span>
//     </div>
//     {balanceForm.type === 'remove' && 
//      balanceForm.balanceType === 'wallet' && 
//      parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType) && (
//       <p className="text-xs mt-1 font-medium">
//         ⚠️ Le montant à retirer dépasse le solde disponible
//       </p>
//     )}
//   </div>
// )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Motif (optionnel mais recommandé)
//                 </label>
//                 <select
//                   value={balanceForm.reason}
//                   onChange={(e) => setBalanceForm({...balanceForm, reason: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                 >
//                   <option value="">Sélectionner un motif</option>
//                   <option value="correction">Correction de solde</option>
//                   <option value="bonus">Bonus promotionnel</option>
//                   <option value="compensation">Compensation</option>
//                   <option value="erreur">Correction d'erreur</option>
//                   <option value="autre">Autre</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Notes supplémentaires (optionnel)
//                 </label>
//                 <textarea
//                   value={balanceForm.notes}
//                   onChange={(e) => setBalanceForm({...balanceForm, notes: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                   placeholder="Détails supplémentaires sur cette modification..."
//                   rows="3"
//                 />
//               </div>

//               {/* Informations d'audit */}
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-600 mb-1">
//                   Cette modification sera enregistrée avec:
//                 </p>
//                 <ul className="text-xs text-gray-500 space-y-1">
//                   <li>• Date et heure actuelles</li>
//                   <li>• Votre nom d'administrateur</li>
//                   <li>• Le motif spécifié</li>
//                   <li>• Les notes fournies</li>
//                 </ul>
//               </div>

//               <div className="pt-3 sm:pt-4 border-t border-gray-200">
//                 <button
//                   onClick={handleBalanceUpdate}
//                   disabled={actionLoading || !balanceForm.amount || 
//   (balanceForm.type === 'remove' && 
//    balanceForm.balanceType === 'wallet' && 
//    parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType))}
//                   className={`w-full px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
//                     actionLoading || !balanceForm.amount || 
//                     (balanceForm.type === 'remove' && parseFloat(balanceForm.amount) > userWallet.available)
//                       ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                       : balanceForm.type === 'add'
//                       ? 'bg-green-600 hover:bg-green-700 text-white'
//                       : 'bg-red-600 hover:bg-red-700 text-white'
//                   }`}
//                 >
//                   {actionLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Traitement en cours...
//                     </span>
//                   ) : (
//                    `${balanceForm.type === 'add' ? 'Ajouter' : 'Retirer'} ${balanceForm.amount ? formatAmount(parseFloat(balanceForm.amount)) : '0'} CDF du ${getBalanceLabel(balanceForm.balanceType)}`
//                   )}
//                 </button>
                
//                 {!balanceForm.amount && (
//                   <p className="text-xs text-gray-500 text-center mt-2">
//                     Veuillez saisir un montant
//                   </p>
//                 )}
                
//               {balanceForm.type === 'remove' && 
//  balanceForm.balanceType === 'wallet' && 
//  balanceForm.amount && 
//  parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType) && (
//   <p className="text-xs text-red-600 text-center mt-2">
//     Le montant à retirer ne peut pas dépasser le solde disponible
//   </p>
// )}
//               </div>
//             </div>
//           </div>
//         )}
//       </Drawer>
//     </div>
//   );
// }



























// "use client";

// import { 
//   Search,
//   Filter,
//   Plus,
//   Download,
//   Edit,
//   Trash2,
//   Eye,
//   Mail,
//   Phone,
//   Calendar,
//   Shield,
//   CheckCircle,
//   XCircle,
//   MoreVertical,
//   UserPlus,
//   Ban,
//   Unlock,
//   Send,
//   RefreshCw,
//   AlertCircle,
//   Wallet,
//   TrendingUp,
//   CreditCard,
//   User,
//   Globe,
//   PhoneCall,
//   MapPin,
//   Clock,
//   DollarSign,
//   BarChart3,
//   Loader2,
//   PlusCircle,
//   MinusCircle,
//   History,
//   LogOut,
//   Calculator,
//   FileText,
//   Zap,
//   Coins,
//   CalendarDays,
//   CheckSquare,
//   XSquare,
//   AlertTriangle
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import DashboardCard from '@/components/DashboardCard';
// import Drawer from '@/components/Drawer';
// import { auth, db } from '@/lib/firebase';
// import { MessageCircle } from "lucide-react";
// import { 
//   collection, 
//   getDocs, 
//   doc, 
//   updateDoc, 
//   deleteDoc,
//   getDoc,
//   query,
//   where,
//   orderBy,
//   limit,
//   serverTimestamp,
//   increment,
//   arrayUnion,
//   writeBatch,
//   Timestamp,
//   runTransaction,
//   setDoc
// } from 'firebase/firestore';
// import { useAuth } from '@/contexts/AuthContext';
// import BackButton from '@/components/BackButton';

// export default function UtilisateursPage() {
//   const [filter, setFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
// const [eligibleInvestments, setEligibleInvestments] = useState([]);
// const [selectedInvestments, setSelectedInvestments] = useState([]);
// const [selectionMode, setSelectionMode] = useState(false);
//   const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
//   const [editDrawerOpen, setEditDrawerOpen] = useState(false);
//   const [balanceDrawerOpen, setBalanceDrawerOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userWallet, setUserWallet] = useState(null);
//   const [userTransactions, setUserTransactions] = useState([]);
//   const [drawerLoading, setDrawerLoading] = useState(false);
  
//   const [calculatingDailyGains, setCalculatingDailyGains] = useState(false);
//   const [calculationProgress, setCalculationProgress] = useState({
//     current: 0,
//     total: 0,
//     processed: 0,
//     errors: 0,
//     totalAmount: 0
//   });
//   const [lastCalculation, setLastCalculation] = useState(null);
//   const [calculationResults, setCalculationResults] = useState(null);
//   const [calculationDrawerOpen, setCalculationDrawerOpen] = useState(false);
// const [whatsappConfig, setWhatsappConfig] = useState({
//   phoneNumber: "+243XXXXXXXXX",
//   message: "Bonjour, je souhaite obtenir plus d'informations.",
//   groupLink: "https://chat.whatsapp.com/Ia3LZeKx2BI9kBhQogzQi8"
// });
// const [whatsappDrawerOpen, setWhatsappDrawerOpen] = useState(false);
// const [whatsappLoading, setWhatsappLoading] = useState(false);


// const loadWhatsappConfig = async () => {
//   try {
//     const configRef = doc(db, 'admin_config', 'whatsapp_settings');
//     const configSnap = await getDoc(configRef);
    
//     if (configSnap.exists()) {
//       setWhatsappConfig(configSnap.data());
//     }
//   } catch (error) {
//     console.error('Erreur chargement config WhatsApp:', error);
//   }
// };

// const saveWhatsappConfig = async () => {
//   try {
//     setWhatsappLoading(true);
//     const configRef = doc(db, 'admin_config', 'whatsapp_settings');
    
//     await setDoc(configRef, {
//       ...whatsappConfig,
//       updatedAt: serverTimestamp(),
//       updatedBy: auth.currentUser?.uid
//     });
    
//     alert('Configuration WhatsApp mise à jour avec succès !');
//     setWhatsappDrawerOpen(false);
//   } catch (error) {
//     console.error('Erreur sauvegarde config WhatsApp:', error);
//     alert('Erreur lors de la sauvegarde');
//   } finally {
//     setWhatsappLoading(false);
//   }
// };

// useEffect(() => {
//   loadUsers();
//   loadLastCalculation();
//   loadWhatsappConfig();
// }, []);


//     const [editForm, setEditForm] = useState({
//     phone: '',
//     email: '',
//     displayName: '',
//     role: 'user',
//     status: 'active',
//     invitationCode: '',
//     fullName: ''
//   });
  
//   const [balanceForm, setBalanceForm] = useState({
//     type: 'add',
//     amount: '',
//     reason: '',
//     notes: '',
//     balanceType: 'wallet'
//   });
  
//   const [balanceHistory, setBalanceHistory] = useState([]);
//   const [balanceHistoryLoading, setBalanceHistoryLoading] = useState(false);
//   const { user } = useAuth();

//   const getCurrentBalance = (balanceType) => {
//     if (!userWallet) return 0;
    
//     switch(balanceType) {
//       case 'wallet':
//         return userWallet.available || 0;
//       case 'action':
//         return userWallet.invested || 0;
//       case 'referralEarnings':
//         return userWallet.referralEarnings || 0;
//       default:
//         return 0;
//     }
//   };

//   const getBalanceLabel = (balanceType) => {
//     switch(balanceType) {
//       case 'wallet':
//         return 'Solde Disponible';
//       case 'action':
//         return 'Solde Investi';
//       case 'referralEarnings':
//         return 'Gains Parrainage';
//       default:
//         return 'Solde';
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//     loadLastCalculation();
//   }, []);

//   const loadLastCalculation = async () => {
//     try {
//       const calculationRef = doc(db, 'admin_logs', 'dailyGainsCalculation');
//       const calculationSnap = await getDoc(calculationRef);
      
//       if (calculationSnap.exists()) {
//         const data = calculationSnap.data();
//         setLastCalculation({
//           id: calculationSnap.id,
//           ...data,
//           timestamp: data.timestamp?.toDate?.() || new Date(data.date || 0)
//         });
//       }
//     } catch (error) {
//       console.error('Erreur chargement dernier calcul:', error);
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       const usersSnapshot = await getDocs(collection(db, 'users'));
//       const usersData = usersSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         registration: doc.data().createdAt?.toDate?.() || new Date(),
//         lastLogin: doc.data().lastLogin?.toDate?.() || null
//       }));
//       setUsers(usersData);
//     } catch (error) {
//       console.error('Erreur chargement utilisateurs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserDetails = async (userId) => {
//     try {
//       setDrawerLoading(true);
      
//       const userDoc = await getDoc(doc(db, 'users', userId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         setUserDetails({
//           id: userDoc.id,
//           ...userData
//         });
        
//         setEditForm({
//           phone: userData.phone || '',
//           email: userData.email || '',
//           displayName: userData.displayName || '',
//           role: userData.role || 'user',
//           status: userData.status || 'active',
//           invitationCode: userData?.invitationCode || ''
//         });
//       }

//       const walletDoc = await getDoc(doc(db, 'wallets', userId));
//       if (walletDoc.exists()) {
//         const walletData = walletDoc.data();
//         setUserWallet({
//           available: walletData.balances?.wallet?.amount || 0,
//           invested: walletData.balances?.action?.amount || 0,
//           totalDeposited: walletData.balances?.totalDeposited?.amount || 0,
//           referralEarnings: walletData.stats?.referralEarnings || 0,
//           totalEarned: walletData.stats?.totalEarned || 0,
//           totalInvested: walletData.stats?.totalInvested || 0,
//           totalWithdrawn: walletData.stats?.totalWithdrawn || 0,
//           lastDailyGainAt: walletData.stats?.lastDailyGainAt?.toDate?.() || null, 
//           totalDailyGains: walletData.stats?.totalDailyGains || 0, 
//           balanceHistory: walletData.balanceHistory || []
//         });
        
//         setBalanceHistory(walletData.balanceHistory || []);
//       }

//       const transactionsQuery = query(
//         collection(db, 'transactions'),
//         where('userId', '==', userId),
//         orderBy('createdAt', 'desc'),
//         limit(10)
//       );
//       const transactionsSnap = await getDocs(transactionsQuery);
//       setUserTransactions(transactionsSnap.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })));

//     } catch (error) {
//       console.error('Erreur chargement détails:', error);
//     } finally {
//       setDrawerLoading(false);
//     }
//   };

// const calculateDailyGains = async () => {
//   const currentAdmin = auth.currentUser;
//   if (!currentAdmin) {
//     alert('Vous devez être connecté en tant qu\'administrateur');
//     return;
//   }

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   if (lastCalculation && lastCalculation.timestamp >= today) {
//     if (!confirm('Un calcul a déjà été effectué aujourd\'hui. Voulez-vous vraiment relancer le calcul ?')) {
//       return;
//     }
//   }

//   if (!confirm(`Êtes-vous sûr de vouloir calculer les gains journaliers ?
  
// ⚠️ Cette action :
// • Récupérera tous les investissements actifs
// • Vous permettra de sélectionner manuellement les utilisateurs
// • Ajoutera les gains aux soldes disponibles
// • Ne peut être annulée

// Cliquez sur OK pour continuer.`)) {
//     return;
//   }

//   try {
//     setCalculatingDailyGains(true);
//     setSelectionMode(true);
//     setCalculationProgress({
//       current: 0,
//       total: 0,
//       processed: 0,
//       errors: 0,
//       totalAmount: 0
//     });

//     console.log('📊 Récupération des investissements actifs...');
//     const activeInvestmentsQuery = query(
//       collection(db, 'user_levels'),
//       where('status', '==', 'active')
//     );
    
//     const investmentsSnapshot = await getDocs(activeInvestmentsQuery);
//     const allInvestments = investmentsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     console.log(`📈 ${allInvestments.length} investissements actifs trouvés`);
    
//     const filteredInvestments = [];
//     const skippedUsers = [];
    
//     for (const investment of allInvestments) {
//       try {
//         const walletRef = doc(db, 'wallets', investment.userId);
//         const walletSnap = await getDoc(walletRef);
        
//         if (!walletSnap.exists()) {
//           skippedUsers.push({
//             userId: investment.userId,
//             reason: 'Portefeuille non trouvé',
//             investment
//           });
//           continue;
//         }
        
//         const walletData = walletSnap.data();
//         const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
        
//         const alreadyProcessedToday = lastGainDate && 
//           lastGainDate.getDate() === today.getDate() &&
//           lastGainDate.getMonth() === today.getMonth() &&
//           lastGainDate.getFullYear() === today.getFullYear();
        
//         if (alreadyProcessedToday) {
//           skippedUsers.push({
//             userId: investment.userId,
//             reason: 'Déjà payé aujourd\'hui',
//             lastGainDate,
//             investment
//           });
//           continue;
//         }
        
//         const endDate = investment.scheduledEndDate?.toDate?.();
//         if (endDate && endDate < today) {
//           skippedUsers.push({
//             userId: investment.userId,
//             reason: 'Investissement terminé',
//             endDate,
//             investment
//           });
//           continue;
//         }
        
//         filteredInvestments.push(investment);
//       } catch (error) {
//         console.error(`Erreur vérification utilisateur ${investment.userId}:`, error);
//         skippedUsers.push({
//           userId: investment.userId,
//           reason: 'Erreur de vérification',
//           error: error.message,
//           investment
//         });
//       }
//     }

//     console.log(`✅ ${filteredInvestments.length} investissements éligibles`);
//     console.log(`⏭️ ${skippedUsers.length} investissements ignorés`);

//     setEligibleInvestments(filteredInvestments);
//     setSelectedInvestments(filteredInvestments.map(inv => inv.id));
    
//     setSelectionMode(true);

//   } catch (error) {
//     console.error('Erreur préparation calcul gains journaliers:', error);
//     alert(`❌ Erreur lors de la préparation du calcul : ${error.message}`);
//     setCalculatingDailyGains(false);
//   }
// };

// const executeDailyGainsCalculation = async (selectedInvestmentIds) => {
//   const currentAdmin = auth.currentUser;
//   if (!currentAdmin) return;

//  console.log('DEBUG: Début de executeDailyGainsCalculation');
//   console.log('DEBUG: selectedInvestmentIds:', selectedInvestmentIds);
//   console.log('DEBUG: eligibleInvestments.length:', eligibleInvestments.length);

//   try {
//     setCalculatingDailyGains(true);
//     setSelectionMode(false);
//     const startTime = Date.now();
    
//     const investmentsToProcess = eligibleInvestments.filter(inv => 
//       selectedInvestmentIds.includes(inv.id)
//     );

//     setCalculationProgress({
//       current: 0,
//       total: investmentsToProcess.length,
//       processed: 0,
//       errors: 0,
//       totalAmount: 0
//     });

//     const today = new Date();
//     const results = {
//       success: [],
//       failed: [],
//       totalAmount: 0
//     };

//     for (let i = 0; i < investmentsToProcess.length; i++) {
//       const investment = investmentsToProcess[i];
      
//       try {
//         setCalculationProgress(prev => ({
//           ...prev,
//           current: i + 1
//         }));

//         const dailyGain = investment.dailyGain || 
//           (investment.investedAmount * (investment.dailyReturnRate || 0));
        
//         if (!dailyGain || dailyGain <= 0) {
//           results.failed.push({
//             userId: investment.userId,
//             investmentId: investment.id,
//             reason: 'Gain journalier invalide ou nul',
//             dailyGain,
//             investment
//           });
//           setCalculationProgress(prev => ({ ...prev, errors: prev.errors + 1 }));
//           continue;
//         }

//         await runTransaction(db, async (transaction) => {
//           const walletRef = doc(db, 'wallets', investment.userId);
//           const walletSnap = await transaction.get(walletRef);
          
//           if (!walletSnap.exists()) {
//             throw new Error('Portefeuille non trouvé');
//           }

//           const walletData = walletSnap.data();
          
//           const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
//           const alreadyProcessed = lastGainDate && 
//             lastGainDate.getDate() === today.getDate() &&
//             lastGainDate.getMonth() === today.getMonth() &&
//             lastGainDate.getFullYear() === today.getFullYear();
          
//           if (alreadyProcessed) {
//             throw new Error('Déjà payé aujourd\'hui');
//           }

//           transaction.update(walletRef, {
//             'balances.wallet.amount': increment(dailyGain),
//             'balances.wallet.lastUpdated': serverTimestamp(),
//             'stats.totalEarned': increment(dailyGain),
//             'stats.totalDailyGains': increment(dailyGain),
//             'stats.lastDailyGainAt': serverTimestamp(),
//             updatedAt: serverTimestamp(),
//             version: increment(1)
//           });

//           const transactionRef = doc(collection(db, 'transactions'));
//           transaction.set(transactionRef, {
//             transactionId: `GAIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             userId: investment.userId,
//             userEmail: investment.userEmail,
//             type: 'daily_gain',
//             amount: dailyGain,
//             currency: 'CDF',
//             status: 'completed',
//             description: `Gain journalier - ${investment.levelName || 'Niveau actif'}`,
//             metadata: {
//               investmentId: investment.id,
//               levelId: investment.levelId,
//               levelName: investment.levelName,
//               investedAmount: investment.investedAmount,
//               dailyReturnRate: investment.dailyReturnRate,
//               dailyGain: investment.dailyGain,
//               calculationBatch: startTime.toString(),
//               adminId: currentAdmin.uid,
//               adminName: currentAdmin.displayName || currentAdmin.email
//             },
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp()
//           });
//         });

//         results.success.push({
//           userId: investment.userId,
//           investmentId: investment.id,
//           dailyGain,
//           investment
//         });
        
//         results.totalAmount += dailyGain;
//         setCalculationProgress(prev => ({
//           ...prev,
//           processed: prev.processed + 1,
//           totalAmount: prev.totalAmount + dailyGain
//         }));

//       } catch (error) {
//         console.error(`Erreur traitement utilisateur ${investment.userId}:`, error);
//         results.failed.push({
//           userId: investment.userId,
//           investmentId: investment.id,
//           reason: error.message,
//           error,
//           investment
//         });
//         setCalculationProgress(prev => ({ ...prev, errors: prev.errors + 1 }));
//       }
//     }

//     const calculationRef = doc(db, 'admin_logs', 'dailyGainsCalculation');
//     const calculationData = {
//       date: today.toISOString().split('T')[0],
//       timestamp: serverTimestamp(),
//       adminId: currentAdmin.uid,
//       adminName: currentAdmin.displayName || currentAdmin.email,
//       usersProcessed: results.success.length,
//       totalAmountDistributed: results.totalAmount,
//       errors: results.failed.length,
//       processingTime: Date.now() - startTime,
//       status: 'completed',
//       details: {
//         totalInvestments: eligibleInvestments.length,
//         selectedInvestments: investmentsToProcess.length,
//         successCount: results.success.length,
//         failedCount: results.failed.length
//       }
//     };

//     await setDoc(calculationRef, calculationData, { merge: true });
    
//     setLastCalculation({
//       id: 'dailyGainsCalculation',
//       ...calculationData,
//       timestamp: new Date()
//     });
    
//     setCalculationResults({
//       ...results,
//       processingTime: Date.now() - startTime,
//       calculationDate: new Date()
//     });

//     alert(`✅ Calcul des gains journaliers terminé !

// 📊 Résultats :
// • Utilisateurs traités : ${results.success.length}
// • Gains distribués : ${formatAmount(results.totalAmount)} CDF
// • Échecs : ${results.failed.length}
// • Temps de traitement : ${Math.round((Date.now() - startTime) / 1000)} secondes`);

//     setCalculationDrawerOpen(true);

//   } catch (error) {
//     console.error('Erreur calcul gains journaliers:', error);
//     alert(`❌ Erreur lors du calcul des gains : ${error.message}`);
//   } finally {
//     setCalculatingDailyGains(false);
//     setEligibleInvestments([]);
//     setSelectedInvestments([]);
//   }
// };

// const toggleInvestmentSelection = (investmentId) => {
//   setSelectedInvestments(prev => 
//     prev.includes(investmentId) 
//       ? prev.filter(id => id !== investmentId)
//       : [...prev, investmentId]
//   );
// };

// const toggleSelectAllInvestments = () => {
//   if (selectedInvestments.length === eligibleInvestments.length) {
//     setSelectedInvestments([]);
//   } else {
//     setSelectedInvestments(eligibleInvestments.map(inv => inv.id));
//   }
// };











//   const generateReportCSV = (results) => {
//     if (!results) return '';
    
//     const headers = [
//       'User ID',
//       'Email',
//       'Investment ID',
//       'Level Name',
//       'Invested Amount',
//       'Daily Gain',
//       'Status',
//       'Reason'
//     ];
    
//     const rows = [];
    
//     results.success.forEach(item => {
//       rows.push([
//         item.userId,
//         item.investment.userEmail || '',
//         item.investmentId,
//         item.investment.levelName || '',
//         item.investment.investedAmount || 0,
//         item.dailyGain,
//         'SUCCESS',
//         ''
//       ]);
//     });
    
//     results.failed.forEach(item => {
//       rows.push([
//         item.userId,
//         item.investment.userEmail || '',
//         item.investmentId,
//         item.investment.levelName || '',
//         item.investment.investedAmount || 0,
//         0,
//         'FAILED',
//         item.reason
//       ]);
//     });
    
//     if (results.skippedUsers) {
//       results.skippedUsers.forEach(item => {
//         rows.push([
//           item.userId,
//           item.investment.userEmail || '',
//           item.investment.id,
//           item.investment.levelName || '',
//           item.investment.investedAmount || 0,
//           0,
//           'SKIPPED',
//           item.reason
//         ]);
//       });
//     }
    
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.join(','))
//     ].join('\n');
    
//     return csvContent;
//   };

//   const downloadReport = () => {
//     if (!calculationResults) return;
    
//     const csvContent = generateReportCSV(calculationResults);
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
    
//     const dateStr = new Date().toISOString().split('T')[0];
//     link.href = URL.createObjectURL(blob);
//     link.download = `gains_journaliers_${dateStr}.csv`;
//     link.click();
//   };

//   const loadBalanceHistory = async (userId) => {
//     try {
//       setBalanceHistoryLoading(true);
//       const walletDoc = await getDoc(doc(db, 'wallets', userId));
//       if (walletDoc.exists()) {
//         const walletData = walletDoc.data();
//         setBalanceHistory(walletData.balanceHistory || []);
//       }
//     } catch (error) {
//       console.error('Erreur chargement historique solde:', error);
//     } finally {
//       setBalanceHistoryLoading(false);
//     }
//   };

//   const handleViewUser = async (user) => {
//     setSelectedUser(user);
//     await loadUserDetails(user.id);
//     setViewDrawerOpen(true);
//   };

//   const handleEditUser = async (user) => {
//     setSelectedUser(user);
//     await loadUserDetails(user.id);
//     setEditDrawerOpen(true);
//   };

//   const handleBalanceModification = async (user) => {
//     setSelectedUser(user);
//     await loadUserDetails(user.id);
//     setBalanceForm({
//       type: 'add',
//       amount: '',
//       reason: '',
//       notes: '',
//       balanceType: 'wallet'
//     });
//     setBalanceDrawerOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     if (!selectedUser) return;
    
//     try {
//       setActionLoading(true);
//       const userRef = doc(db, 'users', selectedUser.id);
      
//       await updateDoc(userRef, {
//         ...editForm,
//         updatedAt: serverTimestamp()
//       });
      
//       alert('Utilisateur mis à jour avec succès !');
//       setEditDrawerOpen(false);
//       await loadUsers();
//     } catch (error) {
//       console.error('Erreur mise à jour:', error);
//       alert('Erreur lors de la mise à jour');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleBalanceUpdate = async () => {
//     if (!selectedUser || !balanceForm.amount || isNaN(parseFloat(balanceForm.amount))) {
//       alert('Veuillez saisir un montant valide');
//       return;
//     }

//     const amount = parseFloat(balanceForm.amount);
//     if (amount <= 0) {
//       alert('Le montant doit être supérieur à 0');
//       return;
//     }

//     if (balanceForm.type === 'remove' && balanceForm.balanceType === 'wallet') {
//       const currentBalance = getCurrentBalance(balanceForm.balanceType);
//       if (amount > currentBalance) {
//         alert(`Le solde disponible est insuffisant. Solde actuel: ${formatAmount(currentBalance)} CDF`);
//         return;
//       }
//     }

//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       alert('Vous devez être connecté pour effectuer cette action');
//       return;
//     }

//     const adminName = currentUser.displayName || currentUser.email || 'Administrateur';
    
//     if (!confirm(`${balanceForm.type === 'add' ? 'Ajouter' : 'Retirer'} ${formatAmount(amount)} CDF du ${getBalanceLabel(balanceForm.balanceType)} de ${selectedUser.displayName || selectedUser.email || selectedUser.phone} ?`)) {
//       return;
//     }

//     try {
//       setActionLoading(true);
//       const walletRef = doc(db, 'wallets', selectedUser.id);
//       const userDoc = await getDoc(walletRef);
      
//       if (!userDoc.exists()) {
//         alert('Portefeuille utilisateur non trouvé');
//         return;
//       }

//       let firestorePath = '';
//       switch(balanceForm.balanceType) {
//         case 'wallet':
//           firestorePath = 'balances.wallet.amount';
//           break;
//         case 'action':
//           firestorePath = 'balances.action.amount';
//           break;
//         case 'referralEarnings':
//           firestorePath = 'stats.referralEarnings';
//           break;
//         default:
//           firestorePath = 'balances.wallet.amount';
//       }

//       let currentBalance = 0;
//       const walletData = userDoc.data();

//       switch(balanceForm.balanceType) {
//         case 'wallet':
//           currentBalance = walletData?.balances?.wallet?.amount || 0;
//           break;
//         case 'action':
//           currentBalance = walletData?.balances?.action?.amount || 0;
//           break;
//         case 'referralEarnings':
//           currentBalance = walletData?.stats?.referralEarnings || 0;
//           break;
//       }
      
//       const newAmount = balanceForm.type === 'add' ? amount : -amount;
//       const newBalance = currentBalance + newAmount;

//       const balanceHistoryEntry = {
//         type: balanceForm.type,
//         amount: amount,
//         balanceType: balanceForm.balanceType,
//         balanceLabel: getBalanceLabel(balanceForm.balanceType),
//         previousBalance: currentBalance,
//         newBalance: newBalance,
//         reason: balanceForm.reason,
//         notes: balanceForm.notes,
//         adminId: currentUser.uid,
//         adminName: adminName,
//         timestamp: Date.now(),
//         date: new Date().toISOString()
//       };

//       const updateData = {
//         'balanceHistory': arrayUnion(balanceHistoryEntry),
//         updatedAt: serverTimestamp()
//       };

//       updateData[firestorePath] = newBalance;

//       if (balanceForm.type === 'add') {
//         updateData['stats.totalEarned'] = increment(amount);
        
//         if (balanceForm.balanceType === 'wallet') {
//           updateData['balances.totalDeposited.amount'] = increment(amount);
//           updateData['stats.totalDeposited'] = increment(amount);
//         } else if (balanceForm.balanceType === 'action') {
//           updateData['stats.totalInvested'] = increment(amount);
//         } else if (balanceForm.balanceType === 'referralEarnings') {
//           updateData['stats.referralEarnings'] = increment(amount);
//         }
//       } else {
//         if (balanceForm.balanceType === 'wallet') {
//           updateData['stats.totalWithdrawn'] = increment(amount);
//         } else if (balanceForm.balanceType === 'action') {
//           updateData['stats.totalInvested'] = increment(-amount);
//         } else if (balanceForm.balanceType === 'referralEarnings') {
//           updateData['stats.referralEarnings'] = increment(-amount);
//           updateData['stats.totalEarned'] = increment(-amount);
//         }
//       }

//       await updateDoc(walletRef, updateData);

//       if (balanceForm.type === 'add' && balanceForm.balanceType === 'wallet') {
//         await updateDoc(walletRef, {
//           'balances.totalDeposited.amount': increment(amount),
//           'stats.totalEarned': increment(amount)
//         });
//       }

//       const operationType = balanceForm.type === 'add' ? 'ajouté à' : 'retiré de';
//       alert(`✅ ${formatAmount(amount)} CDF ${operationType} ${getBalanceLabel(balanceForm.balanceType)} avec succès !\n\n💰 Ancien solde: ${formatAmount(currentBalance)} CDF\n💰 Nouveau solde: ${formatAmount(newBalance)} CDF\n📊 Différence: ${balanceForm.type === 'add' ? '+' : '-'}${formatAmount(amount)} CDF`);
      
//       setBalanceForm({
//         type: 'add',
//         amount: '',
//         reason: '',
//         notes: '',
//         balanceType: 'wallet'
//       });
      
//       await loadUserDetails(selectedUser.id);
//       await loadBalanceHistory(selectedUser.id);
      
//     } catch (error) {
//       console.error('Erreur modification solde:', error);
//       alert('Erreur lors de la modification du solde');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleUserAction = async (action, userId) => {
//     const user = users.find(u => u.id === userId);
//     if (!user) return;

//     const actionText = {
//       activate: 'Activer',
//       suspend: 'Suspendre',
//       delete: 'Supprimer'
//     }[action];

//     if (!confirm(`${actionText} ${user.displayName || user.email || user.phone} ?`)) {
//       return;
//     }

//     try {
//       setActionLoading(true);
//       const userRef = doc(db, 'users', userId);
      
//       switch(action) {
//         case 'activate':
//           await updateDoc(userRef, { 
//             status: 'active',
//             updatedAt: serverTimestamp()
//           });
//           alert(`${user.displayName || user.email || user.phone} activé !`);
//           break;
//         case 'suspend':
//           await updateDoc(userRef, { 
//             status: 'suspended',
//             updatedAt: serverTimestamp()
//           });
//           alert(`${user.displayName || user.email || user.phone} suspendu !`);
//           break;
//         case 'delete':
//           const walletRef = doc(db, 'wallets', userId);
//           await deleteDoc(walletRef);
//           await deleteDoc(userRef);
//           alert(`${user.displayName || user.email || user.phone} supprimé !`);
//           break;
//       }

//       await loadUsers();
//     } catch (error) {
//       console.error(`Erreur ${action} utilisateur:`, error);
//       alert('Erreur lors de l\'opération');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedUsers.length === 0) {
//       alert('Veuillez sélectionner au moins un utilisateur');
//       return;
//     }

//     if (!confirm(`${action === 'delete' ? 'Supprimer' : action === 'suspend' ? 'Suspendre' : 'Activer'} ${selectedUsers.length} utilisateur(s) ?`)) {
//       return;
//     }

//     try {
//       setActionLoading(true);
      
//       for (const userId of selectedUsers) {
//         const userRef = doc(db, 'users', userId);
        
//         switch(action) {
//           case 'activate':
//             await updateDoc(userRef, { 
//               status: 'active',
//               updatedAt: serverTimestamp()
//             });
//             break;
//           case 'suspend':
//             await updateDoc(userRef, { 
//               status: 'suspended',
//               updatedAt: serverTimestamp()
//             });
//             break;
//           case 'delete':
//             await deleteDoc(userRef);
//             break;
//         }
//       }

//       alert(`${selectedUsers.length} utilisateur(s) ${action === 'delete' ? 'supprimé(s)' : action === 'suspend' ? 'suspendu(s)' : 'activé(s)'} !`);
      
//       await loadUsers();
//       setSelectedUsers([]);
//     } catch (error) {
//       console.error('Erreur action groupée:', error);
//       alert('Erreur lors de l\'opération');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     if (filter !== 'all' && user.status !== filter) return false;
//     if (search) {
//       const searchLower = search.toLowerCase();
//       return (
//         user.id?.toLowerCase().includes(searchLower) ||
//         user.displayName?.toLowerCase().includes(searchLower) ||
//         user.email?.toLowerCase().includes(searchLower) ||
//         user.phone?.toLowerCase().includes(searchLower) ||
//         user.phoneNumber?.toLowerCase().includes(searchLower)
//       );
//     }
//     return true;
//   });

//   const roleColors = {
//     admin: 'bg-red-100 text-red-800',
//     moderator: 'bg-purple-100 text-purple-800',
//     user: 'bg-blue-100 text-blue-800'
//   };

//   const statusColors = {
//     active: 'bg-green-100 text-green-800',
//     inactive: 'bg-gray-100 text-gray-800',
//     suspended: 'bg-red-100 text-red-800'
//   };

//   const formatDate = (date) => {
//     if (!date) return 'Jamais';
//     const d = date.toDate ? date.toDate() : new Date(date);
//     return d.toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatAmount = (amount) => {
//     return amount?.toLocaleString('fr-FR') || '0';
//   };

//   const formatHistoryDate = (date) => {
//     if (!date) return 'Date inconnue';
//     const d = date.toDate ? date.toDate() : new Date(date);
//     return d.toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const toggleUserSelection = (userId) => {
//     setSelectedUsers(prev => 
//       prev.includes(userId) 
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedUsers.length === filteredUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(filteredUsers.map(user => user.id));
//     }
//   };

//   const stats = {
//     total: users.length,
//     active: users.filter(u => u.status === 'active').length,
//     suspended: users.filter(u => u.status === 'suspended').length,
//     admins: users.filter(u => u.role === 'admin').length,
//     today: users.filter(u => {
//       const today = new Date();
//       const regDate = u.registration.toDate ? u.registration.toDate() : new Date(u.registration);
//       return regDate.toDateString() === today.toDateString();
//     }).length
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header */}
//       <BackButton />
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
//           <p className="text-sm sm:text-base text-gray-600 mt-1">Gestion des utilisateurs</p>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//           {/* NOUVEAU: Bouton Calculer les gains journaliers */}
//           <button 
//             onClick={calculateDailyGains}
//             disabled={calculatingDailyGains}
//             className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
//               calculatingDailyGains
//                 ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                 : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
//             }`}
//           >
//             {calculatingDailyGains ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 <span>Calcul en cours...</span>
//               </>
//             ) : (
//               <>
//                 <Calculator className="w-4 h-4" />
//                 <span>Calculer les gains journaliers</span>
//               </>
//             )}
//           </button>
//            <button 
//     onClick={() => setWhatsappDrawerOpen(true)}
//     className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 text-sm sm:text-base"
//   >
//     <MessageCircle className="w-4 h-4" />
//     <span>Modifier WhatsApp</span>
//   </button>




//           <button 
//             onClick={loadUsers}
//             disabled={actionLoading}
//             className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span className="hidden sm:inline">Actualiser</span>
//           </button>
//           {/* <Link 
//             href="/dashboard/utilisateurs/nouveau"
//             className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
//           >
//             <UserPlus className="w-4 h-4" />
//             <span>Nouvel utilisateur</span>
//           </Link> */}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Total</p>
//           <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Actifs</p>
//           <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Suspendus</p>
//           <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.suspended}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Admins</p>
//           <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.admins}</p>
//         </div>
//         <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
//           <p className="text-xs sm:text-sm text-gray-500">Nouveaux</p>
//           <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.today}</p>
//         </div>
//         {/* NOUVEAU: Dernier calcul */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-green-200">
//           <p className="text-xs sm:text-sm text-gray-500">Dernier calcul</p>
//           <p className="text-xl sm:text-2xl font-bold text-emerald-600">
//             {lastCalculation ? formatDate(lastCalculation.timestamp) : 'Jamais'}
//           </p>
//           {lastCalculation && (
//             <p className="text-xs text-emerald-700 mt-1">
//               {formatAmount(lastCalculation.totalAmountDistributed || 0)} CDF
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Barre de progression pendant le calcul */}
//       {calculatingDailyGains && (
//         <DashboardCard className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Zap className="w-5 h-5 text-green-600 animate-pulse" />
//                 <span className="font-medium text-green-800">Calcul des gains journaliers en cours...</span>
//               </div>
//               <span className="text-sm text-green-700">
//                 {calculationProgress.current}/{calculationProgress.total}
//               </span>
//             </div>
            
//             <div className="w-full bg-green-200 rounded-full h-2.5">
//               <div 
//                 className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
//                 style={{ 
//                   width: calculationProgress.total > 0 
//                     ? `${(calculationProgress.current / calculationProgress.total) * 100}%` 
//                     : '0%' 
//                 }}
//               ></div>
//             </div>
            
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//               <div className="bg-white p-2 rounded border border-green-200">
//                 <p className="text-gray-500">Traités</p>
//                 <p className="font-bold text-green-600">{calculationProgress.processed}</p>
//               </div>
//               <div className="bg-white p-2 rounded border border-red-200">
//                 <p className="text-gray-500">Échecs</p>
//                 <p className="font-bold text-red-600">{calculationProgress.errors}</p>
//               </div>
//               <div className="bg-white p-2 rounded border border-blue-200">
//                 <p className="text-gray-500">Gains totaux</p>
//                 <p className="font-bold text-blue-600">{formatAmount(calculationProgress.totalAmount)} CDF</p>
//               </div>
//               <div className="bg-white p-2 rounded border border-purple-200">
//                 <p className="text-gray-500">Progression</p>
//                 <p className="font-bold text-purple-600">
//                   {calculationProgress.total > 0 
//                     ? `${Math.round((calculationProgress.current / calculationProgress.total) * 100)}%`
//                     : '0%'
//                   }
//                 </p>
//               </div>
//             </div>
            
//             <p className="text-xs text-green-700 text-center">
//               Ne fermez pas cette page pendant le calcul...
//             </p>
//           </div>
//         </DashboardCard>
//       )}

//       {/* Filtres et recherche */}
//       <DashboardCard>
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">Tous les statuts</option>
//               <option value="active">Actifs</option>
//               <option value="suspended">Suspendus</option>
//               <option value="inactive">Inactifs</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Actions groupées */}
//         {selectedUsers.length > 0 && (
//           <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//               <div className="flex items-center">
//                 <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2" />
//                 <span className="font-medium text-blue-900 text-sm sm:text-base">
//                   {selectedUsers.length} sélectionné(s)
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-1 sm:gap-2">
//                 <button 
//                   onClick={() => handleBulkAction('activate')}
//                   disabled={actionLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-xs sm:text-sm disabled:opacity-50"
//                 >
//                   <Unlock className="w-3 sm:w-4 h-3 sm:h-4" />
//                   <span className="hidden sm:inline">Activer</span>
//                 </button>
//                 <button 
//                   onClick={() => handleBulkAction('suspend')}
//                   disabled={actionLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-xs sm:text-sm disabled:opacity-50"
//                 >
//                   <Ban className="w-3 sm:w-4 h-3 sm:h-4" />
//                   <span className="hidden sm:inline">Suspendre</span>
//                 </button>
//                 <button 
//                   onClick={() => handleBulkAction('delete')}
//                   disabled={actionLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-xs sm:text-sm disabled:opacity-50"
//                 >
//                   <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
//                   <span className="hidden sm:inline">Supprimer</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </DashboardCard>

//       {/* Table des utilisateurs */}
//       <DashboardCard className='mb-35'>
//         <div className="overflow-x-auto -mx-2 sm:mx-0">
//           <div className="min-w-full inline-block align-middle">
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
//                           onChange={toggleSelectAll}
//                           className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
//                         />
//                       </div>
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Utilisateur
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                       Rôle
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Statut
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                       Inscription
//                     </th>
//                     <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50">
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
//                           <input
//                             type="checkbox"
//                             checked={selectedUsers.includes(user.id)}
//                             onChange={() => toggleUserSelection(user.id)}
//                             className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
//                           />
//                         </td>
//                         <td className="px-2 sm:px-4 py-3">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//                               {user.fullName?.charAt(0) || user.email?.charAt(0) || user.phone?.charAt(0) || 'U'}
//                             </div>
//                             <div className="ml-2 sm:ml-3 min-w-0">
//                               <div className="text-sm font-medium text-gray-900 truncate">
//                                 {user.fullName || user.fullName || 'Sans nom'}
//                               </div>
//                               <div className="text-xs text-gray-500 flex items-center truncate">
//                                 <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
//                                 <span className="truncate">{user.email || 'Pas d\'email'}</span>
//                               </div>
//                               {user.phone && (
//                                 <div className="text-xs text-gray-500 flex items-center truncate">
//                                   <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
//                                   <span className="truncate">{user.phone}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
//                           <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role || 'user']}`}>
//                             {user.role || 'user'}
//                           </span>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status || 'active']}`}>
//                             {user.status || 'active'}
//                           </span>
//                           <div className="text-xs text-gray-500 mt-1 truncate hidden sm:block">
//                             Dernière connexion: {formatDate(user.lastLogin)}
//                           </div>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">
//                           <div className="text-sm text-gray-900">
//                             <div className="flex items-center">
//                               <Calendar className="w-3 h-3 mr-1 text-gray-400" />
//                               {formatDate(user.registration)}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
//                           <div className="flex items-center space-x-1 sm:space-x-2">
//                             <button
//                               onClick={() => handleViewUser(user)}
//                               className="text-blue-600 hover:text-blue-900 p-1"
//                               title="Voir profil"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleEditUser(user)}
//                               className="text-gray-600 hover:text-gray-900 p-1"
//                               title="Modifier"
//                             >
//                               <Edit className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleBalanceModification(user)}
//                               className="text-green-600 hover:text-green-900 p-1"
//                               title="Modifier le solde"
//                             >
//                               <DollarSign className="w-4 h-4" />
//                             </button>
//                             {user.status === 'suspended' ? (
//                               <button 
//                                 onClick={() => handleUserAction('activate', user.id)}
//                                 disabled={actionLoading}
//                                 className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
//                                 title="Réactiver"
//                               >
//                                 <Unlock className="w-4 h-4" />
//                               </button>
//                             ) : (
//                               <button 
//                                 onClick={() => handleUserAction('suspend', user.id)}
//                                 disabled={actionLoading}
//                                 className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
//                                 title="Suspendre"
//                               >
//                                 <Ban className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="px-4 py-8 text-center">
//                         <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
//                         <p className="text-gray-500 text-sm sm:text-base">Aucun utilisateur trouvé</p>
//                         {search && (
//                           <p className="text-xs sm:text-sm text-gray-400 mt-1">
//                             Aucun résultat pour "{search}"
//                           </p>
//                         )}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
        
//         {/* Pagination */}
//         {filteredUsers.length > 0 && (
//           <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//             <div className="text-xs sm:text-sm text-gray-500">
//               Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
//             </div>
//           </div>
//         )}
//       </DashboardCard>

//       {/* NOUVEAU: Drawer des résultats du calcul */}
//       <Drawer
//         isOpen={calculationDrawerOpen}
//         onClose={() => setCalculationDrawerOpen(false)}
//         title="Rapport des gains journaliers"
//         size="xl"
//       >
//         {calculationResults && (
//           <div className="space-y-4 sm:space-y-6">
//             {/* Résumé global */}
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-200">
//                   <p className="text-xs sm:text-sm text-gray-500">Utilisateurs traités</p>
//                   <p className="text-lg sm:text-xl font-bold text-green-600">
//                     {calculationResults.success.length}
//                   </p>
//                 </div>
//                 <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200">
//                   <p className="text-xs sm:text-sm text-gray-500">Gains distribués</p>
//                   <p className="text-lg sm:text-xl font-bold text-blue-600">
//                     {formatAmount(calculationResults.totalAmount)} CDF
//                   </p>
//                 </div>
//                 <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-200">
//                   <p className="text-xs sm:text-sm text-gray-500">Échecs</p>
//                   <p className="text-lg sm:text-xl font-bold text-red-600">
//                     {calculationResults.failed.length}
//                   </p>
//                 </div>
//                 <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200">
//                   <p className="text-xs sm:text-sm text-gray-500">Temps de traitement</p>
//                   <p className="text-lg sm:text-xl font-bold text-purple-600">
//                     {Math.round(calculationResults.processingTime / 1000)}s
//                   </p>
//                 </div>
//               </div>
              
//               <div className="mt-4 pt-4 border-t border-green-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Date du calcul</p>
//                     <p className="text-gray-900">{formatDate(calculationResults.calculationDate)}</p>
//                   </div>
//                   <button
//                     onClick={downloadReport}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     <FileText className="w-4 h-4" />
//                     Télécharger le rapport
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Liste des succès */}
//             {calculationResults.success.length > 0 && (
//               <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
//                   <CheckSquare className="w-5 h-5 text-green-600" />
//                   Utilisateurs traités avec succès ({calculationResults.success.length})
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead>
//                       <tr>
//                         <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                         <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
//                         <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Investissement</th>
//                         <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gain</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {calculationResults.success.slice(0, 10).map((item, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-2 sm:px-4 py-2">
//                             <div className="text-xs font-mono text-gray-900 truncate max-w-[120px]">
//                               {item.userId.substring(0, 8)}...
//                             </div>
//                           </td>
//                           <td className="px-2 sm:px-4 py-2">
//                             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                               {item.investment.levelName || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="px-2 sm:px-4 py-2">
//                             <span className="text-xs text-gray-700">
//                               {formatAmount(item.investment.investedAmount || 0)} CDF
//                             </span>
//                           </td>
//                           <td className="px-2 sm:px-4 py-2">
//                             <span className="text-xs font-bold text-green-700">
//                               +{formatAmount(item.dailyGain)} CDF
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 {calculationResults.success.length > 10 && (
//                   <p className="text-xs text-gray-500 mt-2 text-center">
//                     ...et {calculationResults.success.length - 10} autres utilisateurs
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Liste des échecs */}
//             {calculationResults.failed.length > 0 && (
//               <div className="bg-white rounded-xl border border-red-100 p-4 sm:p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
//                   <XSquare className="w-5 h-5 text-red-600" />
//                   Échecs de traitement ({calculationResults.failed.length})
//                 </h3>
//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {calculationResults.failed.slice(0, 10).map((item, index) => (
//                     <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
//                       <div className="flex items-start gap-2">
//                         <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-red-900">
//                             Utilisateur: {item.userId.substring(0, 8)}...
//                           </p>
//                           <p className="text-xs text-red-700">{item.reason}</p>
//                           <p className="text-xs text-gray-600 mt-1">
//                             Niveau: {item.investment.levelName || 'N/A'} • 
//                             Investissement: {formatAmount(item.investment.investedAmount || 0)} CDF
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {calculationResults.failed.length > 10 && (
//                   <p className="text-xs text-gray-500 mt-2 text-center">
//                     ...et {calculationResults.failed.length - 10} autres échecs
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </Drawer>

//       {/* Drawer de visualisation */}
//       <Drawer
//         isOpen={viewDrawerOpen}
//         onClose={() => setViewDrawerOpen(false)}
//         title={`Profil de ${selectedUser?.fullName || selectedUser?.email || selectedUser?.phone}`}
//         size="lg"
//         loading={drawerLoading}
//       >
//         {userDetails && userWallet && (
//           <div className="space-y-4 sm:space-y-6">
//             {/* Informations personnelles */}
//             <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-5">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
//                 <User className="w-4 sm:w-5 h-4 sm:h-5" />
//                 Informations personnelles
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Nom complet</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{userDetails.fullName || 'Non spécifié'}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{userDetails.email}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Téléphone</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{userDetails.phone || 'Non spécifié'}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Statut</label>
//                   <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[userDetails.status || 'active']}`}>
//                     {userDetails.status || 'active'}
//                   </span>
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Code d'invitation</label>
//                   <p className="text-gray-900 font-mono text-sm sm:text-base">{userDetails?.invitationCode || 'Non défini'}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Inscription</label>
//                   <p className="text-gray-900 text-sm sm:text-base">{formatDate(userDetails?.createdAt)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Soldes financiers */}
//             <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
//                 <Wallet className="w-4 sm:w-5 h-4 sm:h-5" />
//                 Soldes financiers
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
//                     <span className="text-xs sm:text-sm font-medium text-blue-900">Solde Disponible</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
//                     {formatAmount(userWallet.available)} CDF
//                   </p>
//                   <p className="text-xs text-blue-700 mt-1">Pour investissements/retraits</p>
//                 </div>
//                 <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
//                     <span className="text-xs sm:text-sm font-medium text-green-900">Solde Investi</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
//                     {formatAmount(userWallet.invested)} CDF
//                   </p>
//                   <p className="text-xs text-green-700 mt-1">Actuellement en action</p>
//                 </div>
//                 <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" />
//                     <span className="text-xs sm:text-sm font-medium text-purple-900">Total Dépôts</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
//                     {formatAmount(userWallet.totalDeposited)} CDF
//                   </p>
//                 </div>
//                 <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
//                   <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
//                     <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" />
//                     <span className="text-xs sm:text-sm font-medium text-amber-900">Gains Parrainage</span>
//                   </div>
//                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
//                     {formatAmount(userWallet.referralEarnings)} CDF
//                   </p>
//                 </div>
//               </div>
              
//               {/* NOUVEAU: Informations sur les gains journaliers */}
//               {userWallet.lastDailyGainAt && (
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs font-medium text-gray-500">Dernier gain journalier</p>
//                       <p className="text-sm text-gray-900">{formatDate(userWallet.lastDailyGainAt)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-medium text-gray-500">Total gains journaliers</p>
//                       <p className="text-sm font-bold text-green-600">{formatAmount(userWallet.totalDailyGains)} CDF</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Historique des modifications de solde */}
//             <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
//               <div className="flex items-center justify-between mb-3 sm:mb-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1 sm:gap-2">
//                   <History className="w-4 sm:w-5 h-4 sm:h-5" />
//                   Historique des modifications de solde
//                 </h3>
//                 <button
//                   onClick={() => loadBalanceHistory(selectedUser.id)}
//                   disabled={balanceHistoryLoading}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 disabled:opacity-50"
//                 >
//                   <RefreshCw className={`w-3 sm:w-4 h-3 sm:h-4 ${balanceHistoryLoading ? 'animate-spin' : ''}`} />
//                   Actualiser
//                 </button>
//               </div>
              
//               {balanceHistory.length > 0 ? (
//                 <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
//                   {balanceHistory
//                     .sort((a, b) => {
//                       const dateA = a.timestamp?.toDate?.() || new Date(a.date || 0);
//                       const dateB = b.timestamp?.toDate?.() || new Date(b.date || 0);
//                       return dateB - dateA;
//                     })
//                     .map((entry, index) => (
//                       <div 
//                         key={index} 
//                         className={`p-3 rounded-lg border ${
//                           entry.type === 'add' 
//                             ? 'bg-green-50 border-green-200' 
//                             : 'bg-red-50 border-red-200'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between mb-1">
//                           <div className="flex items-center gap-2">
//                             {entry.type === 'add' ? (
//                               <PlusCircle className="w-4 h-4 text-green-600" />
//                             ) : (
//                               <MinusCircle className="w-4 h-4 text-red-600" />
//                             )}
//                             <span className={`font-semibold ${
//                               entry.type === 'add' ? 'text-green-700' : 'text-red-700'
//                             }`}>
//                               {entry.type === 'add' ? '+' : '-'}{formatAmount(entry.amount)} CDF
//                             </span>
//                             <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                               {entry.balanceLabel || 'Solde Disponible'}
//                             </span>
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             {formatHistoryDate(entry.timestamp || entry.date)}
//                           </span>
//                         </div>
                        
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
//                           <div>
//                             <span className="text-gray-600">Ancien solde:</span>{' '}
//                             <span className="font-medium">{formatAmount(entry.previousBalance)} CDF</span>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Nouveau solde:</span>{' '}
//                             <span className="font-medium">{formatAmount(entry.newBalance)} CDF</span>
//                           </div>
//                           <div className="sm:col-span-2">
//                             <span className="text-gray-600">Administrateur:</span>{' '}
//                             <span className="font-medium">{entry.adminName || 'Système'}</span>
//                           </div>
//                           {entry.reason && (
//                             <div className="sm:col-span-2">
//                               <span className="text-gray-600">Motif:</span>{' '}
//                               <span className="font-medium">{entry.reason}</span>
//                             </div>
//                           )}
//                           {entry.notes && (
//                             <div className="sm:col-span-2">
//                               <span className="text-gray-600">Notes:</span>{' '}
//                               <span className="text-gray-700">{entry.notes}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4">
//                   <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-gray-500 text-sm">Aucune modification de solde enregistrée</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </Drawer>

//       {/* Drawer d'édition */}
//       <Drawer
//         isOpen={editDrawerOpen}
//         onClose={() => setEditDrawerOpen(false)}
//         title={`Modifier ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
//         size="md"
//       >
//         <div className="space-y-3 sm:space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Nom complet
//             </label>
//             <input
//               type="text"
//               value={editForm.displayName}
//               onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//               placeholder="Nom de l'utilisateur"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={editForm.email}
//               onChange={(e) => setEditForm({...editForm, email: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//               placeholder="email@exemple.com"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Téléphone
//             </label>
//             <input
//               type="tel"
//               value={editForm.phone}
//               onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//               placeholder="+243 XX XXX XX XX"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Rôle
//             </label>
//             <select
//               value={editForm.role}
//               onChange={(e) => setEditForm({...editForm, role: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//             >
//               <option value="user">Utilisateur</option>
//               <option value="moderator">Modérateur</option>
//               <option value="admin">Administrateur</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Statut
//             </label>
//             <select
//               value={editForm.status}
//               onChange={(e) => setEditForm({...editForm, status: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//             >
//               <option value="active">Actif</option>
//               <option value="suspended">Suspendu</option>
//               <option value="inactive">Inactif</option>
//             </select>
//           </div>
//           <div className="pt-3 sm:pt-4 border-t border-gray-200">
//             <button
//               onClick={handleSaveEdit}
//               disabled={actionLoading}
//               className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
//             >
//               {actionLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
//             </button>
//           </div>
//         </div>
//       </Drawer>

//       {/* Drawer de modification du solde */}
//       <Drawer
//         isOpen={balanceDrawerOpen}
//         onClose={() => setBalanceDrawerOpen(false)}
//         title={`Modifier le solde de ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
//         size="md"
//       >
//         {selectedUser && userWallet && ( 
//           <div className="space-y-4 sm:space-y-6 mb-20">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Type de solde à modifier
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setBalanceForm({...balanceForm, balanceType: 'wallet'})}
//                   className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
//                     balanceForm.balanceType === 'wallet'
//                       ? 'border-blue-500 bg-blue-50 text-blue-700'
//                       : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
//                   }`}
//                 >
//                   <CreditCard className="w-5 h-5 mb-1" />
//                   <span className="text-xs font-medium">Disponible</span>
//                   <span className="text-xs mt-1">{formatAmount(userWallet.available)} CDF</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setBalanceForm({...balanceForm, balanceType: 'action'})}
//                   className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
//                     balanceForm.balanceType === 'action'
//                       ? 'border-green-500 bg-green-50 text-green-700'
//                       : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <TrendingUp className="w-5 h-5 mb-1" />
//                   <span className="text-xs font-medium">Investi</span>
//                   <span className="text-xs mt-1">{formatAmount(userWallet.invested)} CDF</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setBalanceForm({...balanceForm, balanceType: 'referralEarnings'})}
//                   className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
//                     balanceForm.balanceType === 'referralEarnings'
//                       ? 'border-amber-500 bg-amber-50 text-amber-700'
//                       : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300'
//                   }`}
//                 >
//                   <BarChart3 className="w-5 h-5 mb-1" />
//                   <span className="text-xs font-medium">Parrainage</span>
//                   <span className="text-xs mt-1">{formatAmount(userWallet.referralEarnings)} CDF</span>
//                 </button>
//               </div>
//             </div>

//             <div className={`rounded-lg sm:rounded-xl p-4 border ${
//               balanceForm.balanceType === 'wallet' ? 'bg-blue-50 border-blue-200' :
//               balanceForm.balanceType === 'action' ? 'bg-green-50 border-green-200' :
//               'bg-amber-50 border-amber-200'
//             }`}>
//               <div className="flex items-center justify-between mb-2">
//                 <span className={`text-sm font-medium ${
//                   balanceForm.balanceType === 'wallet' ? 'text-blue-900' :
//                   balanceForm.balanceType === 'action' ? 'text-green-900' :
//                   'text-amber-900'
//                 }`}>
//                   {getBalanceLabel(balanceForm.balanceType)} actuel
//                 </span>
//                 <span className={`text-lg sm:text-xl font-bold ${
//                   balanceForm.balanceType === 'wallet' ? 'text-blue-700' :
//                   balanceForm.balanceType === 'action' ? 'text-green-700' :
//                   'text-amber-700'
//                 }`}>
//                   {formatAmount(getCurrentBalance(balanceForm.balanceType))} CDF
//                 </span>
//               </div>
//               <p className={`text-xs ${
//                 balanceForm.balanceType === 'wallet' ? 'text-blue-600' :
//                 balanceForm.balanceType === 'action' ? 'text-green-600' :
//                 'text-amber-600'
//               }`}>
//                 {balanceForm.balanceType === 'wallet' 
//                   ? 'Solde disponible pour investissements et retraits'
//                   : balanceForm.balanceType === 'action'
//                   ? 'Montant actuellement investi dans des actions'
//                   : 'Gains cumulés provenant du parrainage'
//                 }
//               </p>
//             </div>

//             <div className="space-y-3 sm:space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type d'opération
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setBalanceForm({...balanceForm, type: 'add'})}
//                     className={`p-3 sm:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
//                       balanceForm.type === 'add'
//                         ? 'border-green-500 bg-green-50 text-green-700'
//                         : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
//                     }`}
//                   >
//                     <PlusCircle className="w-6 h-6 mb-2" />
//                     <span className="font-semibold">Ajouter</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setBalanceForm({...balanceForm, type: 'remove'})}
//                     className={`p-3 sm:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
//                       balanceForm.type === 'remove'
//                         ? 'border-red-500 bg-red-50 text-red-700'
//                         : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
//                     }`}
//                   >
//                     <MinusCircle className="w-6 h-6 mb-2" />
//                     <span className="font-semibold">Retirer</span>
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Montant (CDF)
//                 </label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <span className="text-gray-500">CDF</span>
//                   </div>
//                   <input
//                     type="number"
//                     value={balanceForm.amount}
//                     onChange={(e) => setBalanceForm({...balanceForm, amount: e.target.value})}
//                     className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
//                     placeholder="0"
//                     min="1"
//                     step="100"
//                   />
//                 </div>
//                 {balanceForm.amount && !isNaN(parseFloat(balanceForm.amount)) && (
//                   <div className={`mt-2 p-2 rounded ${
//                     balanceForm.type === 'add'
//                       ? 'bg-green-50 text-green-700'
//                       : 'bg-red-50 text-red-700'
//                   }`}>
//                     <div className="flex justify-between text-sm">
//                       <span>Nouveau solde:</span>
//                       <span className="font-bold">
//                         {formatAmount(
//                           balanceForm.type === 'add'
//                             ? getCurrentBalance(balanceForm.balanceType) + parseFloat(balanceForm.amount)
//                             : getCurrentBalance(balanceForm.balanceType) - parseFloat(balanceForm.amount)
//                         )} CDF
//                       </span>
//                     </div>
//                     {balanceForm.type === 'remove' && 
//                      balanceForm.balanceType === 'wallet' && 
//                      parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType) && (
//                       <p className="text-xs mt-1 font-medium">
//                         ⚠️ Le montant à retirer dépasse le solde disponible
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Motif (optionnel mais recommandé)
//                 </label>
//                 <select
//                   value={balanceForm.reason}
//                   onChange={(e) => setBalanceForm({...balanceForm, reason: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                 >
//                   <option value="">Sélectionner un motif</option>
//                   <option value="correction">Correction de solde</option>
//                   <option value="bonus">Bonus promotionnel</option>
//                   <option value="compensation">Compensation</option>
//                   <option value="erreur">Correction d'erreur</option>
//                   <option value="autre">Autre</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Notes supplémentaires (optionnel)
//                 </label>
//                 <textarea
//                   value={balanceForm.notes}
//                   onChange={(e) => setBalanceForm({...balanceForm, notes: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                   placeholder="Détails supplémentaires sur cette modification..."
//                   rows="3"
//                 />
//               </div>

//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-600 mb-1">
//                   Cette modification sera enregistrée avec:
//                 </p>
//                 <ul className="text-xs text-gray-500 space-y-1">
//                   <li>• Date et heure actuelles</li>
//                   <li>• Votre nom d'administrateur</li>
//                   <li>• Le motif spécifié</li>
//                   <li>• Les notes fournies</li>
//                 </ul>
//               </div>

//               <div className="pt-3 sm:pt-4 border-t border-gray-200">
//                 <button
//                   onClick={handleBalanceUpdate}
//                   disabled={actionLoading || !balanceForm.amount || 
//                     (balanceForm.type === 'remove' && 
//                      balanceForm.balanceType === 'wallet' && 
//                      parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType))}
//                   className={`w-full px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
//                     actionLoading || !balanceForm.amount || 
//                     (balanceForm.type === 'remove' && parseFloat(balanceForm.amount) > userWallet.available)
//                       ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                       : balanceForm.type === 'add'
//                       ? 'bg-green-600 hover:bg-green-700 text-white'
//                       : 'bg-red-600 hover:bg-red-700 text-white'
//                   }`}
//                 >
//                   {actionLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Traitement en cours...
//                     </span>
//                   ) : (
//                    `${balanceForm.type === 'add' ? 'Ajouter' : 'Retirer'} ${balanceForm.amount ? formatAmount(parseFloat(balanceForm.amount)) : '0'} CDF du ${getBalanceLabel(balanceForm.balanceType)}`
//                   )}
//                 </button>
                
//                 {!balanceForm.amount && (
//                   <p className="text-xs text-gray-500 text-center mt-2">
//                     Veuillez saisir un montant
//                   </p>
//                 )}
                
//                 {balanceForm.type === 'remove' && 
//                   balanceForm.balanceType === 'wallet' && 
//                   balanceForm.amount && 
//                   parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType) && (
//                   <p className="text-xs text-red-600 text-center mt-2">
//                     Le montant à retirer ne peut pas dépasser le solde disponible
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </Drawer>


//       {/* AJOUTER ce Drawer après le Drawer des résultats du calcul */}
// <Drawer
//   isOpen={selectionMode}
//   onClose={() => {
//     setSelectionMode(false);
//     setCalculatingDailyGains(false);
//   }}
//   title="Sélection des utilisateurs pour les gains"
//   size="xl"
// >
//   <div className="space-y-6">
//     <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold text-blue-900 mb-1">
//             Sélection manuelle des gains journaliers
//           </h3>
//           <p className="text-sm text-blue-700">
//             {eligibleInvestments.length} investissements éligibles trouvés
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={toggleSelectAllInvestments}
//             className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm hover:bg-blue-50"
//           >
//             {selectedInvestments.length === eligibleInvestments.length 
//               ? 'Tout désélectionner' 
//               : 'Tout sélectionner'}
//           </button>
//           <span className="text-sm font-medium text-blue-900">
//             {selectedInvestments.length}/{eligibleInvestments.length} sélectionnés
//           </span>
//         </div>
//       </div>
      
//       {selectedInvestments.length > 0 && (
//         <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-green-800">
//                 Gains totaux estimés
//               </p>
//               <p className="text-2xl font-bold text-green-700">
//                 {formatAmount(
//                   eligibleInvestments
//                     .filter(inv => selectedInvestments.includes(inv.id))
//                     .reduce((total, inv) => total + (inv.dailyGain || (inv.investedAmount * (inv.dailyReturnRate || 0))), 0)
//                 )} CDF
//               </p>
//             </div>
//             <button
//               onClick={() => executeDailyGainsCalculation(selectedInvestments)}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
//             >
//               Confirmer et exécuter
//             </button>
//           </div>
//         </div>
//       )}
//     </div>

//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead>
//           <tr>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//               <input
//                 type="checkbox"
//                 checked={selectedInvestments.length === eligibleInvestments.length && eligibleInvestments.length > 0}
//                 onChange={toggleSelectAllInvestments}
//                 className="h-4 w-4 text-blue-600 rounded"
//               />
//             </th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investissement</th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gain journalier</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {eligibleInvestments.map((investment) => (
//             <tr key={investment.id} className="hover:bg-gray-50">
//               <td className="px-4 py-3">
//                 <input
//                   type="checkbox"
//                   checked={selectedInvestments.includes(investment.id)}
//                   onChange={() => toggleInvestmentSelection(investment.id)}
//                   className="h-4 w-4 text-blue-600 rounded"
//                 />
//               </td>
//               <td className="px-4 py-3">
//                 <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
//                   {investment.userEmail || investment.userId.substring(0, 8) + '...'}
//                 </div>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   {investment.levelName || 'N/A'}
//                 </span>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="text-sm font-medium text-gray-900">
//                   {formatAmount(investment.investedAmount || 0)} CDF
//                 </span>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="text-sm font-bold text-green-700">
//                   {formatAmount(investment.dailyGain || (investment.investedAmount * (investment.dailyReturnRate || 0)))} CDF
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//     {eligibleInvestments.length === 0 && (
//       <div className="text-center py-8">
//         <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//         <p className="text-gray-500">Aucun investissement éligible trouvé</p>
//       </div>
//     )}
//   </div>
// </Drawer>



// {/* AJOUTER ce Drawer à la fin de tous les autres Drawers */}
// <Drawer
//   isOpen={whatsappDrawerOpen}
//   onClose={() => setWhatsappDrawerOpen(false)}
//   title="Configuration WhatsApp"
//   size="md"
// >
//   <div className="space-y-4">
//     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//       <div className="flex items-center gap-2 mb-2">
//         <MessageCircle className="w-5 h-5 text-green-600" />
//         <h3 className="text-lg font-semibold text-green-900">
//           Paramètres WhatsApp
//         </h3>
//       </div>
//       <p className="text-sm text-green-700">
//         Configurez le lien WhatsApp qui sera utilisé dans l'application
//       </p>
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Numéro de téléphone
//       </label>
//       <input
//         type="text"
//         value={whatsappConfig.phoneNumber}
//         onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumber: e.target.value})}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//         placeholder="+243XXXXXXXXX"
//       />
//       <p className="text-xs text-gray-500 mt-1">
//         Format: +243 suivi du numéro (ex: +243810000000)
//       </p>
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Message par défaut
//       </label>
//       <textarea
//         value={whatsappConfig.message}
//         onChange={(e) => setWhatsappConfig({...whatsappConfig, message: e.target.value})}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//         rows="3"
//         placeholder="Message automatique..."
//       />
//       <p className="text-xs text-gray-500 mt-1">
//         Message qui sera pré-rempli dans WhatsApp
//       </p>
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Lien du groupe WhatsApp
//       </label>
//       <input
//         type="url"
//         value={whatsappConfig.groupLink}
//         onChange={(e) => setWhatsappConfig({...whatsappConfig, groupLink: e.target.value})}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//         placeholder="https://chat.whatsapp.com/..."
//       />
//       <p className="text-xs text-gray-500 mt-1">
//         Lien d'invitation au groupe WhatsApp
//       </p>
//     </div>

//     <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//       <p className="text-xs text-gray-600 mb-1">
//         Prévisualisation du lien :
//       </p>
//       <p className="text-xs font-mono text-gray-800 break-all">
//         {`https://wa.me/${whatsappConfig.phoneNumber.replace('+', '')}?text=${encodeURIComponent(whatsappConfig.message)}`}
//       </p>
//     </div>

//     <div className="pt-4 border-t border-gray-200">
//       <button
//         onClick={saveWhatsappConfig}
//         disabled={whatsappLoading}
//         className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
//       >
//         {whatsappLoading ? (
//           <>
//             <Loader2 className="w-4 h-4 animate-spin" />
//             Sauvegarde...
//           </>
//         ) : (
//           'Enregistrer la configuration'
//         )}
//       </button>
//     </div>
//   </div>
// </Drawer>
//     </div>
//   );
// }



"use client";

import { 
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserPlus,
  Ban,
  Unlock,
  Send,
  RefreshCw,
  AlertCircle,
  Wallet,
  TrendingUp,
  CreditCard,
  User,
  Globe,
  PhoneCall,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  Loader2,
  PlusCircle,
  MinusCircle,
  History,
  LogOut,
  Calculator,
  FileText,
  Zap,
  Coins,
  CalendarDays,
  CheckSquare,
  XSquare,
  AlertTriangle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';
import Drawer from '@/components/Drawer';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  writeBatch,
  Timestamp,
  runTransaction,
  setDoc
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import BackButton from '@/components/BackButton';

export default function UtilisateursPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [balanceDrawerOpen, setBalanceDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  
  const [calculatingDailyGains, setCalculatingDailyGains] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState({
    current: 0,
    total: 0,
    processed: 0,
    errors: 0,
    totalAmount: 0
  });
  const [lastCalculation, setLastCalculation] = useState(null);
  const [calculationResults, setCalculationResults] = useState(null);
  const [calculationDrawerOpen, setCalculationDrawerOpen] = useState(false);


    const [editForm, setEditForm] = useState({
    phone: '',
    email: '',
    displayName: '',
    role: 'user',
    status: 'active',
    invitationCode: '',
    fullName: ''
  });
  console.log('ok utlisateur')
  const [balanceForm, setBalanceForm] = useState({
    type: 'add',
    amount: '',
    reason: '',
    notes: '',
    balanceType: 'wallet'
  });
  
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [balanceHistoryLoading, setBalanceHistoryLoading] = useState(false);
  const { user } = useAuth();

  const getCurrentBalance = (balanceType) => {
    if (!userWallet) return 0;
    
    switch(balanceType) {
      case 'wallet':
        return userWallet.available || 0;
      case 'action':
        return userWallet.invested || 0;
      case 'referralEarnings':
        return userWallet.referralEarnings || 0;
      default:
        return 0;
    }
  };

  const getBalanceLabel = (balanceType) => {
    switch(balanceType) {
      case 'wallet':
        return 'Solde Disponible';
      case 'action':
        return 'Solde Investi';
      case 'referralEarnings':
        return 'Gains Parrainage';
      default:
        return 'Solde';
    }
  };

  useEffect(() => {
    loadUsers();
    loadLastCalculation();
  }, []);

  const loadLastCalculation = async () => {
    try {
      const calculationRef = doc(db, 'admin_logs', 'dailyGainsCalculation');
      const calculationSnap = await getDoc(calculationRef);
      
      if (calculationSnap.exists()) {
        const data = calculationSnap.data();
        setLastCalculation({
          id: calculationSnap.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(data.date || 0)
        });
      }
    } catch (error) {
      console.error('Erreur chargement dernier calcul:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registration: doc.data().createdAt?.toDate?.() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate?.() || null
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      setDrawerLoading(true);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          id: userDoc.id,
          ...userData
        });
        
        setEditForm({
          phone: userData.phone || '',
          email: userData.email || '',
          displayName: userData.displayName || '',
          role: userData.role || 'user',
          status: userData.status || 'active',
          invitationCode: userData?.invitationCode || ''
        });
      }

      const walletDoc = await getDoc(doc(db, 'wallets', userId));
      if (walletDoc.exists()) {
        const walletData = walletDoc.data();
        setUserWallet({
          available: walletData.balances?.wallet?.amount || 0,
          invested: walletData.balances?.action?.amount || 0,
          totalDeposited: walletData.balances?.totalDeposited?.amount || 0,
          referralEarnings: walletData.stats?.referralEarnings || 0,
          totalEarned: walletData.stats?.totalEarned || 0,
          totalInvested: walletData.stats?.totalInvested || 0,
          totalWithdrawn: walletData.stats?.totalWithdrawn || 0,
          lastDailyGainAt: walletData.stats?.lastDailyGainAt?.toDate?.() || null, 
          totalDailyGains: walletData.stats?.totalDailyGains || 0, 
          balanceHistory: walletData.balanceHistory || []
        });
        
        setBalanceHistory(walletData.balanceHistory || []);
      }

      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const transactionsSnap = await getDocs(transactionsQuery);
      setUserTransactions(transactionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const calculateDailyGains = async () => {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      alert('Vous devez être connecté en tant qu\'administrateur');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastCalculation && lastCalculation.timestamp >= today) {
      if (!confirm('Un calcul a déjà été effectué aujourd\'hui. Voulez-vous vraiment relancer le calcul ?')) {
        return;
      }
    }

    if (!confirm(`Êtes-vous sûr de vouloir calculer les gains journaliers ?
    
⚠️ Cette action :
• Affectera tous les utilisateurs avec investissements actifs
• Ajoutera les gains aux soldes disponibles
• Ne peut être annulée

Cliquez sur OK pour continuer.`)) {
      return;
    }

    try {
      setCalculatingDailyGains(true);
      setCalculationProgress({
        current: 0,
        total: 0,
        processed: 0,
        errors: 0,
        totalAmount: 0
      });

      const startTime = Date.now();
      
      console.log('📊 Récupération des investissements actifs...');
      const activeInvestmentsQuery = query(
        collection(db, 'user_levels'),
        where('status', '==', 'active')
      );
      
      const investmentsSnapshot = await getDocs(activeInvestmentsQuery);
      const activeInvestments = investmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📈 ${activeInvestments.length} investissements actifs trouvés`);
      
      const eligibleInvestments = [];
      const skippedUsers = [];
      
      for (const investment of activeInvestments) {
        try {
          const walletRef = doc(db, 'wallets', investment.userId);
          const walletSnap = await getDoc(walletRef);
          
          if (!walletSnap.exists()) {
            skippedUsers.push({
              userId: investment.userId,
              reason: 'Portefeuille non trouvé',
              investment
            });
            continue;
          }
          
          const walletData = walletSnap.data();
          const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
          
          const alreadyProcessedToday = lastGainDate && 
            lastGainDate.getDate() === today.getDate() &&
            lastGainDate.getMonth() === today.getMonth() &&
            lastGainDate.getFullYear() === today.getFullYear();
          
          if (alreadyProcessedToday) {
            skippedUsers.push({
              userId: investment.userId,
              reason: 'Déjà payé aujourd\'hui',
              lastGainDate,
              investment
            });
            continue;
          }
          
          const endDate = investment.scheduledEndDate?.toDate?.();
          if (endDate && endDate < today) {
            skippedUsers.push({
              userId: investment.userId,
              reason: 'Investissement terminé',
              endDate,
              investment
            });
            continue;
          }
          
          eligibleInvestments.push(investment);
        } catch (error) {
          console.error(`Erreur vérification utilisateur ${investment.userId}:`, error);
          skippedUsers.push({
            userId: investment.userId,
            reason: 'Erreur de vérification',
            error: error.message,
            investment
          });
        }
      }

      console.log(`✅ ${eligibleInvestments.length} investissements éligibles`);
      console.log(`⏭️ ${skippedUsers.length} investissements ignorés`);

      // VÉRIFICATION: Si aucun investissement éligible
      if (eligibleInvestments.length === 0) {
        setCalculatingDailyGains(false);
        
        let message = `ℹ️ Aucun investissement éligible pour le calcul des gains aujourd'hui.\n\n`;
        message += `📊 Statistiques :\n`;
        message += `• Total investissements actifs : ${activeInvestments.length}\n`;
        message += `• Investissements ignorés : ${skippedUsers.length}\n\n`;
        
        if (skippedUsers.length > 0) {
          message += `📋 Raisons principales :\n`;
          const reasons = {};
          skippedUsers.forEach(skip => {
            reasons[skip.reason] = (reasons[skip.reason] || 0) + 1;
          });
          Object.entries(reasons).forEach(([reason, count]) => {
            message += `• ${reason} : ${count} utilisateur(s)\n`;
          });
        }
        
        message += `\n💡 Les gains ont probablement déjà été calculés aujourd'hui.`;
        
        alert(message);
        return;
      }

      setCalculationProgress(prev => ({
        ...prev,
        total: eligibleInvestments.length
      }));

      const batchSize = 500;
      const results = {
        success: [],
        failed: [],
        totalAmount: 0
      };

      for (let i = 0; i < eligibleInvestments.length; i += batchSize) {
        const batch = eligibleInvestments.slice(i, i + batchSize);
        
        for (const investment of batch) {
          try {
            setCalculationProgress(prev => ({
              ...prev,
              current: i + batch.indexOf(investment) + 1
            }));

            const dailyGain = investment.dailyGain || 
              (investment.investedAmount * (investment.dailyReturnRate || 0));
            
            if (!dailyGain || dailyGain <= 0) {
              results.failed.push({
                userId: investment.userId,
                investmentId: investment.id,
                reason: 'Gain journalier invalide ou nul',
                dailyGain,
                investment
              });
              setCalculationProgress(prev => ({ ...prev, errors: prev.errors + 1 }));
              continue;
            }

            await runTransaction(db, async (transaction) => {
              const walletRef = doc(db, 'wallets', investment.userId);
              const walletSnap = await transaction.get(walletRef);
              
              if (!walletSnap.exists()) {
                throw new Error('Portefeuille non trouvé');
              }

              const walletData = walletSnap.data();
              
              const lastGainDate = walletData.stats?.lastDailyGainAt?.toDate?.();
              const alreadyProcessed = lastGainDate && 
                lastGainDate.getDate() === today.getDate() &&
                lastGainDate.getMonth() === today.getMonth() &&
                lastGainDate.getFullYear() === today.getFullYear();
              
              if (alreadyProcessed) {
                throw new Error('Déjà payé aujourd\'hui');
              }

              transaction.update(walletRef, {
                'balances.wallet.amount': increment(dailyGain),
                'balances.wallet.lastUpdated': serverTimestamp(),
                'stats.totalEarned': increment(dailyGain),
                'stats.totalDailyGains': increment(dailyGain),
                'stats.lastDailyGainAt': serverTimestamp(),
                updatedAt: serverTimestamp(),
                version: increment(1)
              });

              const transactionRef = doc(collection(db, 'transactions'));
              transaction.set(transactionRef, {
                transactionId: `GAIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: investment.userId,
                userEmail: investment.userEmail,
                type: 'daily_gain',
                amount: dailyGain,
                currency: 'CDF',
                status: 'completed',
                description: `Gain journalier - ${investment.levelName || 'Niveau actif'}`,
                metadata: {
                  investmentId: investment.id,
                  levelId: investment.levelId,
                  levelName: investment.levelName,
                  investedAmount: investment.investedAmount,
                  dailyReturnRate: investment.dailyReturnRate,
                  dailyGain: investment.dailyGain,
                  calculationBatch: startTime.toString(),
                  adminId: currentAdmin.uid,
                  adminName: currentAdmin.displayName || currentAdmin.email
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            });

            results.success.push({
              userId: investment.userId,
              investmentId: investment.id,
              dailyGain,
              investment
            });
            
            results.totalAmount += dailyGain;
            setCalculationProgress(prev => ({
              ...prev,
              processed: prev.processed + 1,
              totalAmount: prev.totalAmount + dailyGain
            }));

          } catch (error) {
            console.error(`Erreur traitement utilisateur ${investment.userId}:`, error);
            results.failed.push({
              userId: investment.userId,
              investmentId: investment.id,
              reason: error.message,
              error,
              investment
            });
            setCalculationProgress(prev => ({ ...prev, errors: prev.errors + 1 }));
          }
        }
      }

      const calculationRef = doc(db, 'admin_logs', 'dailyGainsCalculation');
      const calculationData = {
        date: today.toISOString().split('T')[0],
        timestamp: serverTimestamp(),
        adminId: currentAdmin.uid,
        adminName: currentAdmin.displayName || currentAdmin.email,
        usersProcessed: results.success.length,
        totalAmountDistributed: results.totalAmount,
        errors: results.failed.length,
        processingTime: Date.now() - startTime,
        status: 'completed',
        details: {
          totalInvestments: activeInvestments.length,
          eligibleInvestments: eligibleInvestments.length,
          skippedInvestments: skippedUsers.length,
          successCount: results.success.length,
          failedCount: results.failed.length,
          skippedDetails: skippedUsers.slice(0, 50)
        }
      };

      await setDoc(calculationRef, calculationData, { merge: true });
      
      setLastCalculation({
        id: 'dailyGainsCalculation',
        ...calculationData,
        timestamp: new Date()
      });
      
      setCalculationResults({
        ...results,
        skippedUsers,
        processingTime: Date.now() - startTime,
        calculationDate: new Date()
      });

      alert(`✅ Calcul des gains journaliers terminé !

📊 Résultats :
• Utilisateurs traités : ${results.success.length}
• Gains distribués : ${formatAmount(results.totalAmount)} CDF
• Échecs : ${results.failed.length}
• Temps de traitement : ${Math.round((Date.now() - startTime) / 1000)} secondes

📋 Détails disponibles dans le rapport.`);

      setCalculationDrawerOpen(true);

    } catch (error) {
      console.error('Erreur calcul gains journaliers:', error);
      alert(`❌ Erreur lors du calcul des gains : ${error.message}`);
    } finally {
      setCalculatingDailyGains(false);
    }
  };

  const generateReportCSV = (results) => {
    if (!results) return '';
    
    const headers = [
      'User ID',
      'Email',
      'Investment ID',
      'Level Name',
      'Invested Amount',
      'Daily Gain',
      'Status',
      'Reason'
    ];
    
    const rows = [];
    
    results.success.forEach(item => {
      rows.push([
        item.userId,
        item.investment.userEmail || '',
        item.investmentId,
        item.investment.levelName || '',
        item.investment.investedAmount || 0,
        item.dailyGain,
        'SUCCESS',
        ''
      ]);
    });
    
    results.failed.forEach(item => {
      rows.push([
        item.userId,
        item.investment.userEmail || '',
        item.investmentId,
        item.investment.levelName || '',
        item.investment.investedAmount || 0,
        0,
        'FAILED',
        item.reason
      ]);
    });
    
    if (results.skippedUsers) {
      results.skippedUsers.forEach(item => {
        rows.push([
          item.userId,
          item.investment.userEmail || '',
          item.investment.id,
          item.investment.levelName || '',
          item.investment.investedAmount || 0,
          0,
          'SKIPPED',
          item.reason
        ]);
      });
    }
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };

  const downloadReport = () => {
    if (!calculationResults) return;
    
    const csvContent = generateReportCSV(calculationResults);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = URL.createObjectURL(blob);
    link.download = `gains_journaliers_${dateStr}.csv`;
    link.click();
  };

  const loadBalanceHistory = async (userId) => {
    try {
      setBalanceHistoryLoading(true);
      const walletDoc = await getDoc(doc(db, 'wallets', userId));
      if (walletDoc.exists()) {
        const walletData = walletDoc.data();
        setBalanceHistory(walletData.balanceHistory || []);
      }
    } catch (error) {
      console.error('Erreur chargement historique solde:', error);
    } finally {
      setBalanceHistoryLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setViewDrawerOpen(true);
  };

  const handleEditUser = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setEditDrawerOpen(true);
  };

  const handleBalanceModification = async (user) => {
    setSelectedUser(user);
    await loadUserDetails(user.id);
    setBalanceForm({
      type: 'add',
      amount: '',
      reason: '',
      notes: '',
      balanceType: 'wallet'
    });
    setBalanceDrawerOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      const userRef = doc(db, 'users', selectedUser.id);
      
      await updateDoc(userRef, {
        ...editForm,
        updatedAt: serverTimestamp()
      });
      
      alert('Utilisateur mis à jour avec succès !');
      setEditDrawerOpen(false);
      await loadUsers();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBalanceUpdate = async () => {
    if (!selectedUser || !balanceForm.amount || isNaN(parseFloat(balanceForm.amount))) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    const amount = parseFloat(balanceForm.amount);
    if (amount <= 0) {
      alert('Le montant doit être supérieur à 0');
      return;
    }

    if (balanceForm.type === 'remove' && balanceForm.balanceType === 'wallet') {
      const currentBalance = getCurrentBalance(balanceForm.balanceType);
      if (amount > currentBalance) {
        alert(`Le solde disponible est insuffisant. Solde actuel: ${formatAmount(currentBalance)} CDF`);
        return;
      }
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Vous devez être connecté pour effectuer cette action');
      return;
    }

    const adminName = currentUser.displayName || currentUser.email || 'Administrateur';
    
    if (!confirm(`${balanceForm.type === 'add' ? 'Ajouter' : 'Retirer'} ${formatAmount(amount)} CDF du ${getBalanceLabel(balanceForm.balanceType)} de ${selectedUser.displayName || selectedUser.email || selectedUser.phone} ?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const walletRef = doc(db, 'wallets', selectedUser.id);
      const userDoc = await getDoc(walletRef);
      
      if (!userDoc.exists()) {
        alert('Portefeuille utilisateur non trouvé');
        return;
      }

      let firestorePath = '';
      switch(balanceForm.balanceType) {
        case 'wallet':
          firestorePath = 'balances.wallet.amount';
          break;
        case 'action':
          firestorePath = 'balances.action.amount';
          break;
        case 'referralEarnings':
          firestorePath = 'stats.referralEarnings';
          break;
        default:
          firestorePath = 'balances.wallet.amount';
      }

      let currentBalance = 0;
      const walletData = userDoc.data();

      switch(balanceForm.balanceType) {
        case 'wallet':
          currentBalance = walletData?.balances?.wallet?.amount || 0;
          break;
        case 'action':
          currentBalance = walletData?.balances?.action?.amount || 0;
          break;
        case 'referralEarnings':
          currentBalance = walletData?.stats?.referralEarnings || 0;
          break;
      }
      
      const newAmount = balanceForm.type === 'add' ? amount : -amount;
      const newBalance = currentBalance + newAmount;

      const balanceHistoryEntry = {
        type: balanceForm.type,
        amount: amount,
        balanceType: balanceForm.balanceType,
        balanceLabel: getBalanceLabel(balanceForm.balanceType),
        previousBalance: currentBalance,
        newBalance: newBalance,
        reason: balanceForm.reason,
        notes: balanceForm.notes,
        adminId: currentUser.uid,
        adminName: adminName,
        timestamp: Date.now(),
        date: new Date().toISOString()
      };

      const updateData = {
        'balanceHistory': arrayUnion(balanceHistoryEntry),
        updatedAt: serverTimestamp()
      };

      updateData[firestorePath] = newBalance;

      if (balanceForm.type === 'add') {
        updateData['stats.totalEarned'] = increment(amount);
        
        if (balanceForm.balanceType === 'wallet') {
          updateData['balances.totalDeposited.amount'] = increment(amount);
          updateData['stats.totalDeposited'] = increment(amount);
        } else if (balanceForm.balanceType === 'action') {
          updateData['stats.totalInvested'] = increment(amount);
        } else if (balanceForm.balanceType === 'referralEarnings') {
          updateData['stats.referralEarnings'] = increment(amount);
        }
      } else {
        if (balanceForm.balanceType === 'wallet') {
          updateData['stats.totalWithdrawn'] = increment(amount);
        } else if (balanceForm.balanceType === 'action') {
          updateData['stats.totalInvested'] = increment(-amount);
        } else if (balanceForm.balanceType === 'referralEarnings') {
          updateData['stats.referralEarnings'] = increment(-amount);
          updateData['stats.totalEarned'] = increment(-amount);
        }
      }

      await updateDoc(walletRef, updateData);

      if (balanceForm.type === 'add' && balanceForm.balanceType === 'wallet') {
        await updateDoc(walletRef, {
          'balances.totalDeposited.amount': increment(amount),
          'stats.totalEarned': increment(amount)
        });
      }

      const operationType = balanceForm.type === 'add' ? 'ajouté à' : 'retiré de';
      alert(`✅ ${formatAmount(amount)} CDF ${operationType} ${getBalanceLabel(balanceForm.balanceType)} avec succès !\n\n💰 Ancien solde: ${formatAmount(currentBalance)} CDF\n💰 Nouveau solde: ${formatAmount(newBalance)} CDF\n📊 Différence: ${balanceForm.type === 'add' ? '+' : '-'}${formatAmount(amount)} CDF`);
      
      setBalanceForm({
        type: 'add',
        amount: '',
        reason: '',
        notes: '',
        balanceType: 'wallet'
      });
      
      await loadUserDetails(selectedUser.id);
      await loadBalanceHistory(selectedUser.id);
      
    } catch (error) {
      console.error('Erreur modification solde:', error);
      alert('Erreur lors de la modification du solde');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserAction = async (action, userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const actionText = {
      activate: 'Activer',
      suspend: 'Suspendre',
      delete: 'Supprimer'
    }[action];

    if (!confirm(`${actionText} ${user.displayName || user.email || user.phone} ?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const userRef = doc(db, 'users', userId);
      
      switch(action) {
        case 'activate':
          await updateDoc(userRef, { 
            status: 'active',
            updatedAt: serverTimestamp()
          });
          alert(`${user.displayName || user.email || user.phone} activé !`);
          break;
        case 'suspend':
          await updateDoc(userRef, { 
            status: 'suspended',
            updatedAt: serverTimestamp()
          });
          alert(`${user.displayName || user.email || user.phone} suspendu !`);
          break;
        case 'delete':
          const walletRef = doc(db, 'wallets', userId);
          await deleteDoc(walletRef);
          await deleteDoc(userRef);
          alert(`${user.displayName || user.email || user.phone} supprimé !`);
          break;
      }

      await loadUsers();
    } catch (error) {
      console.error(`Erreur ${action} utilisateur:`, error);
      alert('Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    if (!confirm(`${action === 'delete' ? 'Supprimer' : action === 'suspend' ? 'Suspendre' : 'Activer'} ${selectedUsers.length} utilisateur(s) ?`)) {
      return;
    }

    try {
      setActionLoading(true);
      
      for (const userId of selectedUsers) {
        const userRef = doc(db, 'users', userId);
        
        switch(action) {
          case 'activate':
            await updateDoc(userRef, { 
              status: 'active',
              updatedAt: serverTimestamp()
            });
            break;
          case 'suspend':
            await updateDoc(userRef, { 
              status: 'suspended',
              updatedAt: serverTimestamp()
            });
            break;
          case 'delete':
            await deleteDoc(userRef);
            break;
        }
      }

      alert(`${selectedUsers.length} utilisateur(s) ${action === 'delete' ? 'supprimé(s)' : action === 'suspend' ? 'suspendu(s)' : 'activé(s)'} !`);
      
      await loadUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Erreur action groupée:', error);
      alert('Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'all' && user.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        user.id?.toLowerCase().includes(searchLower) ||
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.phoneNumber?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800'
  };

  const formatDate = (date) => {
    if (!date) return 'Jamais';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return amount?.toLocaleString('fr-FR') || '0';
  };

  const formatHistoryDate = (date) => {
    if (!date) return 'Date inconnue';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    today: users.filter(u => {
      const today = new Date();
      const regDate = u.registration.toDate ? u.registration.toDate() : new Date(u.registration);
      return regDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gestion des utilisateurs</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* NOUVEAU: Bouton Calculer les gains journaliers */}
          <button 
            onClick={calculateDailyGains}
            disabled={calculatingDailyGains}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
              calculatingDailyGains
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {calculatingDailyGains ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calcul en cours...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>Calculer les gains journaliers</span>
              </>
            )}
          </button>
          
          <button 
            onClick={loadUsers}
            disabled={actionLoading}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          {/* <Link 
            href="/dashboard/utilisateurs/nouveau"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </Link> */}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Actifs</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Suspendus</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.suspended}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Admins</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Nouveaux</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.today}</p>
        </div>
        {/* NOUVEAU: Dernier calcul */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-green-200">
          <p className="text-xs sm:text-sm text-gray-500">Dernier calcul</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">
            {lastCalculation ? formatDate(lastCalculation.timestamp) : 'Jamais'}
          </p>
          {lastCalculation && (
            <p className="text-xs text-emerald-700 mt-1">
              {formatAmount(lastCalculation.totalAmountDistributed || 0)} CDF
            </p>
          )}
        </div>
      </div>

      {/* Barre de progression pendant le calcul */}
      {calculatingDailyGains && (
        <DashboardCard className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600 animate-pulse" />
                <span className="font-medium text-green-800">Calcul des gains journaliers en cours...</span>
              </div>
              <span className="text-sm text-green-700">
                {calculationProgress.current}/{calculationProgress.total}
              </span>
            </div>
            
            <div className="w-full bg-green-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ 
                  width: calculationProgress.total > 0 
                    ? `${(calculationProgress.current / calculationProgress.total) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-green-200">
                <p className="text-gray-500">Traités</p>
                <p className="font-bold text-green-600">{calculationProgress.processed}</p>
              </div>
              <div className="bg-white p-2 rounded border border-red-200">
                <p className="text-gray-500">Échecs</p>
                <p className="font-bold text-red-600">{calculationProgress.errors}</p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <p className="text-gray-500">Gains totaux</p>
                <p className="font-bold text-blue-600">{formatAmount(calculationProgress.totalAmount)} CDF</p>
              </div>
              <div className="bg-white p-2 rounded border border-purple-200">
                <p className="text-gray-500">Progression</p>
                <p className="font-bold text-purple-600">
                  {calculationProgress.total > 0 
                    ? `${Math.round((calculationProgress.current / calculationProgress.total) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
            
            <p className="text-xs text-green-700 text-center">
              Ne fermez pas cette page pendant le calcul...
            </p>
          </div>
        </DashboardCard>
      )}

      {/* Filtres et recherche */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>
        
        {/* Actions groupées */}
        {selectedUsers.length > 0 && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900 text-sm sm:text-base">
                  {selectedUsers.length} sélectionné(s)
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <button 
                  onClick={() => handleBulkAction('activate')}
                  disabled={actionLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Unlock className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Activer</span>
                </button>
                <button 
                  onClick={() => handleBulkAction('suspend')}
                  disabled={actionLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Ban className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Suspendre</span>
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Table des utilisateurs */}
      <DashboardCard className='mb-35'>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleSelectAll}
                          className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
                        />
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Rôle
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Inscription
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {user.fullName?.charAt(0) || user.email?.charAt(0) || user.phone?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-2 sm:ml-3 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {user.fullName || user.fullName || 'Sans nom'}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center truncate">
                                <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{user.email || 'Pas d\'email'}</span>
                              </div>
                              {user.phone && (
                                <div className="text-xs text-gray-500 flex items-center truncate">
                                  <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role || 'user']}`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status || 'active']}`}>
                            {user.status || 'active'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1 truncate hidden sm:block">
                            Dernière connexion: {formatDate(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              {formatDate(user.registration)}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Voir profil"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleBalanceModification(user)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Modifier le solde"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                            {user.status === 'suspended' ? (
                              <button 
                                onClick={() => handleUserAction('activate', user.id)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                title="Réactiver"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction('suspend', user.id)}
                                disabled={actionLoading}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                title="Suspendre"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-500 text-sm sm:text-base">Aucun utilisateur trouvé</p>
                        {search && (
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Aucun résultat pour "{search}"
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500">
              Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
            </div>
          </div>
        )}
      </DashboardCard>

      {/* NOUVEAU: Drawer des résultats du calcul */}
      <Drawer
        isOpen={calculationDrawerOpen}
        onClose={() => setCalculationDrawerOpen(false)}
        title="Rapport des gains journaliers"
        size="xl"
      >
        {calculationResults && (
          <div className="space-y-4 sm:space-y-6">
            {/* Résumé global */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-200">
                  <p className="text-xs sm:text-sm text-gray-500">Utilisateurs traités</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    {calculationResults.success.length}
                  </p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-gray-500">Gains distribués</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">
                    {formatAmount(calculationResults.totalAmount)} CDF
                  </p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-200">
                  <p className="text-xs sm:text-sm text-gray-500">Échecs</p>
                  <p className="text-lg sm:text-xl font-bold text-red-600">
                    {calculationResults.failed.length}
                  </p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200">
                  <p className="text-xs sm:text-sm text-gray-500">Temps de traitement</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-600">
                    {Math.round(calculationResults.processingTime / 1000)}s
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date du calcul</p>
                    <p className="text-gray-900">{formatDate(calculationResults.calculationDate)}</p>
                  </div>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4" />
                    Télécharger le rapport
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des succès */}
            {calculationResults.success.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                  Utilisateurs traités avec succès ({calculationResults.success.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Investissement</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {calculationResults.success.slice(0, 10).map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-4 py-2">
                            <div className="text-xs font-mono text-gray-900 truncate max-w-[120px]">
                              {item.userId.substring(0, 8)}...
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {item.investment.levelName || 'N/A'}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            <span className="text-xs text-gray-700">
                              {formatAmount(item.investment.investedAmount || 0)} CDF
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            <span className="text-xs font-bold text-green-700">
                              +{formatAmount(item.dailyGain)} CDF
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {calculationResults.success.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ...et {calculationResults.success.length - 10} autres utilisateurs
                  </p>
                )}
              </div>
            )}

            {/* Liste des échecs */}
            {calculationResults.failed.length > 0 && (
              <div className="bg-white rounded-xl border border-red-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <XSquare className="w-5 h-5 text-red-600" />
                  Échecs de traitement ({calculationResults.failed.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {calculationResults.failed.slice(0, 10).map((item, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">
                            Utilisateur: {item.userId.substring(0, 8)}...
                          </p>
                          <p className="text-xs text-red-700">{item.reason}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Niveau: {item.investment.levelName || 'N/A'} • 
                            Investissement: {formatAmount(item.investment.investedAmount || 0)} CDF
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {calculationResults.failed.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ...et {calculationResults.failed.length - 10} autres échecs
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Drawer de visualisation */}
      <Drawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        title={`Profil de ${selectedUser?.fullName || selectedUser?.email || selectedUser?.phone}`}
        size="lg"
        loading={drawerLoading}
      >
        {userDetails && userWallet && (
          <div className="space-y-4 sm:space-y-6">
            {/* Informations personnelles */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <User className="w-4 sm:w-5 h-4 sm:h-5" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-gray-900 text-sm sm:text-base">{userDetails.fullName || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 text-sm sm:text-base">{userDetails.email}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900 text-sm sm:text-base">{userDetails.phone || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Statut</label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[userDetails.status || 'active']}`}>
                    {userDetails.status || 'active'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Code d'invitation</label>
                  <p className="text-gray-900 font-mono text-sm sm:text-base">{userDetails?.invitationCode || 'Non défini'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Inscription</label>
                  <p className="text-gray-900 text-sm sm:text-base">{formatDate(userDetails?.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Soldes financiers */}
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <Wallet className="w-4 sm:w-5 h-4 sm:h-5" />
                Soldes financiers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-blue-900">Solde Disponible</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                    {formatAmount(userWallet.available)} CDF
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Pour investissements/retraits</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium text-green-900">Solde Investi</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                    {formatAmount(userWallet.invested)} CDF
                  </p>
                  <p className="text-xs text-green-700 mt-1">Actuellement en action</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" />
                    <span className="text-xs sm:text-sm font-medium text-purple-900">Total Dépôts</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                    {formatAmount(userWallet.totalDeposited)} CDF
                  </p>
                </div>
                <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" />
                    <span className="text-xs sm:text-sm font-medium text-amber-900">Gains Parrainage</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
                    {formatAmount(userWallet.referralEarnings)} CDF
                  </p>
                </div>
              </div>
              
              {/* NOUVEAU: Informations sur les gains journaliers */}
              {userWallet.lastDailyGainAt && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Dernier gain journalier</p>
                      <p className="text-sm text-gray-900">{formatDate(userWallet.lastDailyGainAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Total gains journaliers</p>
                      <p className="text-sm font-bold text-green-600">{formatAmount(userWallet.totalDailyGains)} CDF</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Historique des modifications de solde */}
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1 sm:gap-2">
                  <History className="w-4 sm:w-5 h-4 sm:h-5" />
                  Historique des modifications de solde
                </h3>
                <button
                  onClick={() => loadBalanceHistory(selectedUser.id)}
                  disabled={balanceHistoryLoading}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 sm:w-4 h-3 sm:h-4 ${balanceHistoryLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
              
              {balanceHistory.length > 0 ? (
                <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
                  {balanceHistory
                    .sort((a, b) => {
                      const dateA = a.timestamp?.toDate?.() || new Date(a.date || 0);
                      const dateB = b.timestamp?.toDate?.() || new Date(b.date || 0);
                      return dateB - dateA;
                    })
                    .map((entry, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${
                          entry.type === 'add' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {entry.type === 'add' ? (
                              <PlusCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <MinusCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`font-semibold ${
                              entry.type === 'add' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {entry.type === 'add' ? '+' : '-'}{formatAmount(entry.amount)} CDF
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {entry.balanceLabel || 'Solde Disponible'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatHistoryDate(entry.timestamp || entry.date)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Ancien solde:</span>{' '}
                            <span className="font-medium">{formatAmount(entry.previousBalance)} CDF</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Nouveau solde:</span>{' '}
                            <span className="font-medium">{formatAmount(entry.newBalance)} CDF</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-gray-600">Administrateur:</span>{' '}
                            <span className="font-medium">{entry.adminName || 'Système'}</span>
                          </div>
                          {entry.reason && (
                            <div className="sm:col-span-2">
                              <span className="text-gray-600">Motif:</span>{' '}
                              <span className="font-medium">{entry.reason}</span>
                            </div>
                          )}
                          {entry.notes && (
                            <div className="sm:col-span-2">
                              <span className="text-gray-600">Notes:</span>{' '}
                              <span className="text-gray-700">{entry.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Aucune modification de solde enregistrée</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Drawer d'édition */}
      <Drawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        title={`Modifier ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
        size="md"
      >
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={editForm.displayName}
              onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="Nom de l'utilisateur"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="email@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="+243 XX XXX XX XX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="user">Utilisateur</option>
              <option value="moderator">Modérateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveEdit}
              disabled={actionLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
            >
              {actionLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </Drawer>

      {/* Drawer de modification du solde */}
      <Drawer
        isOpen={balanceDrawerOpen}
        onClose={() => setBalanceDrawerOpen(false)}
        title={`Modifier le solde de ${selectedUser?.displayName || selectedUser?.email || selectedUser?.phone}`}
        size="md"
      >
        {selectedUser && userWallet && ( 
          <div className="space-y-4 sm:space-y-6 mb-20">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de solde à modifier
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBalanceForm({...balanceForm, balanceType: 'wallet'})}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    balanceForm.balanceType === 'wallet'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Disponible</span>
                  <span className="text-xs mt-1">{formatAmount(userWallet.available)} CDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceForm({...balanceForm, balanceType: 'action'})}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    balanceForm.balanceType === 'action'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Investi</span>
                  <span className="text-xs mt-1">{formatAmount(userWallet.invested)} CDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceForm({...balanceForm, balanceType: 'referralEarnings'})}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    balanceForm.balanceType === 'referralEarnings'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Parrainage</span>
                  <span className="text-xs mt-1">{formatAmount(userWallet.referralEarnings)} CDF</span>
                </button>
              </div>
            </div>

            <div className={`rounded-lg sm:rounded-xl p-4 border ${
              balanceForm.balanceType === 'wallet' ? 'bg-blue-50 border-blue-200' :
              balanceForm.balanceType === 'action' ? 'bg-green-50 border-green-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  balanceForm.balanceType === 'wallet' ? 'text-blue-900' :
                  balanceForm.balanceType === 'action' ? 'text-green-900' :
                  'text-amber-900'
                }`}>
                  {getBalanceLabel(balanceForm.balanceType)} actuel
                </span>
                <span className={`text-lg sm:text-xl font-bold ${
                  balanceForm.balanceType === 'wallet' ? 'text-blue-700' :
                  balanceForm.balanceType === 'action' ? 'text-green-700' :
                  'text-amber-700'
                }`}>
                  {formatAmount(getCurrentBalance(balanceForm.balanceType))} CDF
                </span>
              </div>
              <p className={`text-xs ${
                balanceForm.balanceType === 'wallet' ? 'text-blue-600' :
                balanceForm.balanceType === 'action' ? 'text-green-600' :
                'text-amber-600'
              }`}>
                {balanceForm.balanceType === 'wallet' 
                  ? 'Solde disponible pour investissements et retraits'
                  : balanceForm.balanceType === 'action'
                  ? 'Montant actuellement investi dans des actions'
                  : 'Gains cumulés provenant du parrainage'
                }
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'opération
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBalanceForm({...balanceForm, type: 'add'})}
                    className={`p-3 sm:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      balanceForm.type === 'add'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <PlusCircle className="w-6 h-6 mb-2" />
                    <span className="font-semibold">Ajouter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceForm({...balanceForm, type: 'remove'})}
                    className={`p-3 sm:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      balanceForm.type === 'remove'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                    }`}
                  >
                    <MinusCircle className="w-6 h-6 mb-2" />
                    <span className="font-semibold">Retirer</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (CDF)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-500">CDF</span>
                  </div>
                  <input
                    type="number"
                    value={balanceForm.amount}
                    onChange={(e) => setBalanceForm({...balanceForm, amount: e.target.value})}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="0"
                    min="1"
                    step="100"
                  />
                </div>
                {balanceForm.amount && !isNaN(parseFloat(balanceForm.amount)) && (
                  <div className={`mt-2 p-2 rounded ${
                    balanceForm.type === 'add'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <div className="flex justify-between text-sm">
                      <span>Nouveau solde:</span>
                      <span className="font-bold">
                        {formatAmount(
                          balanceForm.type === 'add'
                            ? getCurrentBalance(balanceForm.balanceType) + parseFloat(balanceForm.amount)
                            : getCurrentBalance(balanceForm.balanceType) - parseFloat(balanceForm.amount)
                        )} CDF
                      </span>
                    </div>
                    {balanceForm.type === 'remove' && 
                     balanceForm.balanceType === 'wallet' && 
                     parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType) && (
                      <p className="text-xs mt-1 font-medium">
                        ⚠️ Le montant à retirer dépasse le solde disponible
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif (optionnel mais recommandé)
                </label>
                <select
                  value={balanceForm.reason}
                  onChange={(e) => setBalanceForm({...balanceForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                >
                  <option value="">Sélectionner un motif</option>
                  <option value="correction">Correction de solde</option>
                  <option value="bonus">Bonus promotionnel</option>
                  <option value="compensation">Compensation</option>
                  <option value="erreur">Correction d'erreur</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes supplémentaires (optionnel)
                </label>
                <textarea
                  value={balanceForm.notes}
                  onChange={(e) => setBalanceForm({...balanceForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                  placeholder="Détails supplémentaires sur cette modification..."
                  rows="3"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">
                  Cette modification sera enregistrée avec:
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Date et heure actuelles</li>
                  <li>• Votre nom d'administrateur</li>
                  <li>• Le motif spécifié</li>
                  <li>• Les notes fournies</li>
                </ul>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={handleBalanceUpdate}
                  disabled={actionLoading || !balanceForm.amount || 
                    (balanceForm.type === 'remove' && 
                     balanceForm.balanceType === 'wallet' && 
                     parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType))}
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                    actionLoading || !balanceForm.amount || 
                    (balanceForm.type === 'remove' && parseFloat(balanceForm.amount) > userWallet.available)
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : balanceForm.type === 'add'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement en cours...
                    </span>
                  ) : (
                   `${balanceForm.type === 'add' ? 'Ajouter' : 'Retirer'} ${balanceForm.amount ? formatAmount(parseFloat(balanceForm.amount)) : '0'} CDF du ${getBalanceLabel(balanceForm.balanceType)}`
                  )}
                </button>
                
                {!balanceForm.amount && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Veuillez saisir un montant
                  </p>
                )}
                
                {balanceForm.type === 'remove' && 
                  balanceForm.balanceType === 'wallet' && 
                  balanceForm.amount && 
                  parseFloat(balanceForm.amount) > getCurrentBalance(balanceForm.balanceType) && (
                  <p className="text-xs text-red-600 text-center mt-2">
                    Le montant à retirer ne peut pas dépasser le solde disponible
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
     </div>
  );
}