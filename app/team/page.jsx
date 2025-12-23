"use client";

import { Copy, Users, DollarSign, ChevronRight, Crown, UserCheck, Landmark } from "lucide-react";
import { useState } from "react";

export default function TeamSection() {
  const [copied, setCopied] = useState(false);
  
  // Données simulées
  const invitationCode = "INVITE-XYZ789";
  const invitationLink = "https://votresite.com/invite/XYZ789";
  const teamMembers = 0;
  const totalRevenue = 0;
  
  // Données des niveaux
  const teamLevels = [
    {
      level: 1,
      commissionRate: 10,
      validUsers: 0,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    },
    {
      level: 2,
      commissionRate: 15,
      validUsers: 0,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    },
    {
      level: 3,
      commissionRate: 20,
      validUsers: 0,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    },
    {
      level: 4,
      commissionRate: 25,
      validUsers: 0,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    },
    {
      level: 5,
      commissionRate: 30,
      validUsers: 0,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    },
    {
      level: 6,
      commissionRate: 35,
      validUsers: 0,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    },
    {
      level: 7,
      commissionRate: 40,
      validUsers: 1,
      revenue: 0,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-orange-500"
    }
  ];

  const copyToClipboard = () => {
    const textToCopy = `Code: ${invitationCode}\nLien: ${invitationLink}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF', // ou 'XOF' selon la zone
    minimumFractionDigits: 0,
  }).format(amount);
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête de la page */}
        {/* <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Équipe</h1>
          <p className="text-gray-600 mt-2">Gérez votre réseau et consultez vos statistiques</p>
        </div> */}

        {/* 1. Carte - Code d'invitation */}
        <div className="bg-gradient-to-r from-orange-50 to-cyan-50 rounded-2xl p-5 md:p-6 mb-8 shadow-sm border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Code d&apos;invitation :
                </h3>
                <div className="flex items-center gap-3  text-[3px]">
                  <code className="text-xl font-bold text-orange-600 bg-white px-4 py-2 rounded-lg border border-blue-200 text-[10px]">
                    {invitationCode}
                  </code>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700 font-medium mb-2">Lien d&apos;invitation :</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 flex-1 overflow-hidden">
                    <p className="text-gray-600 truncate text-[10px]">{invitationLink}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={copyToClipboard}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                copied 
                  ? 'bg-orange-500 text-white text-[10px]' 
                  : 'bg-orange-400 text-white hover:bg-orange-500 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Partagez ce code ou ce lien pour inviter de nouveaux membres dans votre équipe
          </p>
        </div>

        {/* 2. Statistiques - Résumé équipe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Carte 1: Membres */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Membres de l&apos;équipe</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">{teamMembers}</span>
                  <span className="text-gray-500">personnes</span>
                </div>
              </div>
            </div>
            {/* <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="text-green-500 font-medium">+3</span> nouveaux ce mois-ci
              </p>
            </div> */}
          </div>

          {/* Carte 2: Revenu total */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Landmark  className="w-6 h-6 text-green-600"  />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Revenu total</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(totalRevenue)}
                    {/* {totalRevenue} CDF */}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="text-green-500 font-medium">+15%</span> par rapport au mois dernier
              </p>
            </div> */}
          </div>
        </div>

        {/* 3. Titre - Détails de l'équipe */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Détails de l&apos;équipe</h2>
            <p className="text-gray-600 mt-1">Statistiques détaillées par niveau</p>
          </div>
          <div className="flex items-center text-gray-400">
            <ChevronRight className="w-5 h-5" />
            <ChevronRight className="w-5 h-5 -ml-3" />
          </div>
        </div>

        {/* 4. Cartes niveaux */}
        <div className="space-y-4">
          {teamLevels.map((level) => (
            <div 
              key={level.level} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Partie haute - Fond coloré */}
              <div className={`bg-gradient-to-r ${level.color} px-5 py-4`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className="text-white font-bold">LV{level.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm">Taux de commission</p>
                    <p className="text-white text-xl font-bold">{level.commissionRate}%</p>
                  </div>
                </div>
              </div>

              {/* Partie basse - Fond blanc */}
              <div className="p-5">
                {/* Ligne 1 : Niveau avec icône */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`bg-gray-50 p-2 rounded-lg ${level.iconColor}`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Niveau {level.level}</h3>
                      <p className="text-sm text-gray-500">Commission: {level.commissionRate}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Revenu du niveau</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(level.revenue)}</p>
                  </div>
                </div>

                {/* Ligne 2 : Utilisateurs valides */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Utilisateurs valides</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">{level.validUsers} personnes</span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>

                {/* Barre de progression (optionnelle) */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{Math.round((level.validUsers / teamMembers) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${level.color}`}
                      style={{ width: `${Math.min(100, (level.validUsers / teamMembers) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note d'information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Comment fonctionnent les niveaux ?</p>
              <p className="text-sm text-gray-600">
                Chaque niveau représente un rang dans votre équipe. Plus vous montez de niveau, 
                plus votre taux de commission augmente. Les statistiques sont mises à jour quotidiennement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}