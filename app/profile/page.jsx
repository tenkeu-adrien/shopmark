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


  const {user:use} = useAuth();

  console.log("User from AuthContext:", use);

  // Options du menu
  const menuOptions = [
    { id: 1, icon: Settings, label: "Paramètres", href: "/settings" },
    { id: 2, icon: FileText, label: "Registre des recharges", href: "/recharge-history" },
    { id: 3, icon: Download, label: "Télécharger l'application", href: "/download-app" },
    { id: 4, icon: Building, label: "Informations de l'entreprise", href: "/company-info" },
    { id: 5, icon: Headphones, label: "Service client", href: "/support" },
    { id: 6, icon: Users, label: "Invitations", href: "/invitations" },
    { id: 7, icon: LogOut, label: "Se déconnecter", href: "/auth/login", isLogout: true }
  ];

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
                  <span className="font-medium">{use.phone}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Retrait total commandé : <span className="font-bold text-amber-600">${user.totalWithdrawal}</span>
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

          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Centre d'activité</h2>
          </div>
        <div className="bg-white rounded-t-2xl border-t border-l border-r border-gray-200 shadow-sm ">
          {/* En-tête de la section */}
        

          {/* Liste des options */}
          <div className="divide-y divide-gray-100 h-[1000px]">
            {menuOptions.map((option) => {
              const Icon = option.icon;
              const isLogout = option.isLogout || false;
              
              return (
                <Link
                  key={option.id}
                  href={option.href}
                  className={`flex items-center justify-between px-6 py-4 transition-colors duration-200 ${
                    isLogout 
                      ? "hover:bg-red-50" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isLogout 
                        ? "bg-red-100" 
                        : "bg-gray-100"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isLogout 
                          ? "text-red-600" 
                          : "text-gray-600"
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      isLogout 
                        ? "text-red-700" 
                        : "text-gray-700"
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${
                    isLogout 
                      ? "text-red-400" 
                      : "text-gray-400"
                  }`} />
                </Link>
              );
            })}
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