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
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function ProfilePage() {
  // Données utilisateur (à remplacer par vos données réelles)
  const user = {
    name: "John Doe",
    phone: "+243 81 234 5678",
    totalWithdrawal: "0.0",
    status: "VIP",
    walletBalance: "0.0",
    actionBalance: "0.0"
  };

  const { user: authUser, logout } = useAuth();
  const router = useRouter();
// console.log("user dans ProfilePage.jsx:", user);
//   console.log("User from AuthContext:", authUser);
const inviteCode = user?.uid ? user.uid.substring(0, 8).toUpperCase() : 'DEFAULT';
  // Options du menu
  console.log("inviteCode:", inviteCode);
  const menuOptions = [
    { id: 1, icon: Wallet, label: "Historique des revenus", href: "/revenue-history" },
    { id: 3, icon: Download, label: "Télécharger l'application", href: "/download-app" },
    { id: 4, icon: Building, label: "A propos de nous", href: "/about-us" },
    { id: 5, icon: Headphones, label: "Service client", href:"https://wa.me/447412830186" },
    // { id: 6, icon: Users, label: "Invitations", href: "/invitations" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/auth/login`); // Rediriger vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        {/* <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-600">
            ←
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">Profil</h1>
          <div className="w-6"></div>
        </div> */}
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Section Informations Utilisateur */}

         <BackButton />
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
                  <span className="font-medium">{authUser?.phone || user.phone}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Retrait total commandé : <span className="font-bold text-amber-600"> CDF {user.totalWithdrawal}</span>
                </p>
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
        <div className="grid grid-cols-2 gap-4">
          {/* Portefeuille */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-[120px]">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center mb-3">
                <Wallet className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 ">Recharge portefeuille</h3>
              <p className="text-xl font-bold text-amber-600">{user.walletBalance} CDF</p>
            </div>
          </div>

          {/* Solde en action */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-[120px]">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 ">Solde en action</h3>
              <p className="text-xl font-bold text-blue-600">{user.actionBalance} CDF</p>
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
            
            {/* Option Déconnexion avec gestionnaire onClick */}
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