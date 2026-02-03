"use client"
import Link from "next/link";
import { 
  User, 
  Phone, 
  Award, 
  Wallet, 
  TrendingUp,
  Settings,
  FileText,
  Download,
  Building,
  Headphones,
  Users,
  LogOut,
  ChevronRight,
  Loader2 // Ajouté pour l'indicateur de chargement
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useState, useEffect } from "react"; // Ajouté
import { db } from "@/lib/firebase"; // Ajouté
import { doc, getDoc } from "firebase/firestore"; // Ajouté

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  
  // États pour les données Firebase
  const [walletData, setWalletData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const whatsappNumber = "+1 (450) 914-1073";
  
    // Nettoyer le numéro pour l'URL WhatsApp
    const cleanedNumber = whatsappNumber.replace(/\s|\(|\)|-/g, '')
  // Charger les données depuis Firebase
  useEffect(() => {
    if (!authUser?.uid) return;
    
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Charger les données utilisateur
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserData({
            id: userDocSnap.id,
            ...userData,
            // Données par défaut si non présentes
            phone: userData.phone || authUser.phone || 'Non spécifié',
            fullName: userData.fullName || userData.displayName || authUser.displayName || 'Utilisateur',
            status: userData.status || 'active',
            totalWithdrawal: userData.totalWithdrawn || 0
          });
        }
        
        // 2. Charger le wallet
        const walletDocRef = doc(db, 'wallets', authUser.uid);
        const walletDocSnap = await getDoc(walletDocRef);
        
        if (walletDocSnap.exists()) {
          const walletData = walletDocSnap.data();
          setWalletData({
            id: walletDocSnap.id,
            ...walletData,
            balances: {
              wallet: walletData.balances?.wallet || { amount: 0, currency: 'CDF' },
              action: walletData.balances?.action || { amount: 0, currency: 'CDF' },
              totalDeposited: walletData.balances?.totalDeposited || { amount: 0, currency: 'CDF' }
            },
            stats: walletData.stats || {
              totalDeposited: 0,
              totalWithdrawn: 0,
              totalInvested: 0,
              totalEarned: 0,
              referralEarnings: 0
            }
          });
        } else {
          // Si pas de wallet, utiliser des valeurs par défaut
          setWalletData({
            balances: {
              wallet: { amount: 0, currency: 'CDF' },
              action: { amount: 0, currency: 'CDF' },
              totalDeposited: { amount: 0, currency: 'CDF' }
            },
            stats: {
              totalDeposited: 0,
              totalWithdrawn: 0,
              totalInvested: 0,
              totalEarned: 0,
              referralEarnings: 0
            }
          });
        }
        
      } catch (error) {
        console.error('Erreur chargement données profil:', error);
        setError('Impossible de charger les données du profil');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [authUser?.uid]);
  
  // Données utilisateur (avec fallback si chargement en cours)
  const user = {
    name: userData?.fullName || "Chargement...",
    phone: userData?.phone || authUser?.phone || "Chargement...",
    totalWithdrawal: walletData?.stats?.totalWithdrawn || "0.0",
    status: userData?.status === 'VIP' ? "VIP" : "Standard",
    walletBalance: walletData?.balances?.wallet?.amount || "0.0",
    actionBalance: walletData?.balances?.action?.amount || "0.0"
  };

  // Options du menu
  const menuOptions = [
    { id: 1, icon: Wallet, label: "Historique des revenus", href: "/revenue-history" },
    // { id: 2, icon: TrendingUp, label: "Niveaux d'investissement", href: "/dashboard" },
    { id: 3, icon: Download, label: "Télécharger l'application", href: "/install" },
    { id: 4, icon: Building, label: "A propos de nous", href: "/about-us" },
    { id: 5, icon: Headphones, label: "Service client", href:`https://wa.me/${cleanedNumber}` },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/auth/login`);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '0';
  
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Utilisation :
// formatAmount(32000.00); // → "32 000"
// formatAmount(52650.00); // → "52 650"
// formatAmount(1000);     // → "1 000"

  // Afficher l'indicateur de chargement
  if (loading && !walletData && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        {/* Votre header existant */}
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Section Informations Utilisateur */}
        <BackButton />
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start space-x-4">
            {/* Photo de profil */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              {/* Badge VIP */}
              {user.status === "VIP" && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  VIP
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="flex-1">
              <div className="mb-2">
                <div className="flex items-center text-gray-600 mb-1">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium">{user.phone}</span>
                </div>
                {/* <p className="text-sm text-gray-600">
                  Retrait total commandé : <span className="font-bold text-amber-600"> CDF {formatAmount(user.totalWithdrawal)}</span>
                </p> */}
              </div>
              
              {/* Statut */}
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full">
                <Award className="w-4 h-4 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-amber-700">{user.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Financière */}
        <div className="grid grid-cols-2 gap-2">
          {/* Portefeuille */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-[120px] W-[200px]">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center mb-3">
                <Wallet className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Solde disponible</h3>
              <p className="text-[22px] font-bold text-amber-600">{formatAmount(user.walletBalance)} <span className="text-xs"> CDF</span></p>
            </div>
          </div>

          {/* Solde en action */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-[120px]">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Solde investi</h3>
              <p className="text-[22px] font-bold text-blue-600">{formatAmount(user.actionBalance)} <span className="text-xs"> CDF</span></p>
            </div>
          </div>
        </div>

        {/* Centre d'Activité */}
        <div className="bg-white rounded-t-2xl border-t border-l border-r border-gray-200 shadow-sm">
          {/* En-tête de la section */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Centre d'activité</h2>
          </div>

          {/* Liste des options */}
          <div className="divide-y divide-gray-100">
            {menuOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <Link
                  key={option.id}
                  href={option.href}
                  className="flex items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-100">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      {option.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              );
            })}
            
            {/* Option Déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-6 py-4 transition-colors duration-200 hover:bg-red-50 text-left"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-red-100">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-medium text-red-700">
                  Se déconnecter
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        {/* Votre composant WebTabFooter ici */}
      </div>
    </div>
  );
}
