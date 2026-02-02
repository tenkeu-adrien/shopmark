"use client";

import { Copy, Users, DollarSign, ChevronRight, Crown, UserCheck, Landmark, TrendingUp, List } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import teamService from "@/services/teamService";
// import useTeamStore from "@/lib/teamStore";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import BackButton from "@/components/BackButton";



export default function TeamSection() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [teamData, setTeamData] = useState({
    invitationCode: "",
    invitationLink: "",
    teamMembers: { level1: 0, level2: 0, level3: 0, total: 0 },
    totalRevenue: 0,
    commissionEarned: 0,
    levels: []
  });
  const [loading, setLoading] = useState(true);
  const url ="https://shopmark.fr";
//  
//  "http://localhost:3000"
  console.log("teamData dans TeamSection.jsx:", teamData);

  // Charger les données de l'équipe
  useEffect(() => {
    if (!user?.uid) return;
const loadTeamData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des stats équipe avec cache...');
      
      const data = await teamService.getTeamStats(user.uid);
      
      setTeamData({
        invitationCode: data.invitationCode,
        invitationLink: data.invitationLink,
        teamMembers: data.teamMembers,
        totalRevenue: data.totalRevenue,
        commissionEarned: data.commissionEarned,
        levels: data.levels
      });
      
    } catch (error) {
      console.error('Erreur chargement données équipe:', error);
    } finally {
      setLoading(false);
    }
  };

    loadTeamData();
  }, [user?.uid]);


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données de l'équipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête avec bouton "Voir mes filleuls" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">

          <BackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon équipe de parrainage</h1>
            <p className="text-gray-600 mt-1">Gérez votre réseau et suivez vos commissions</p>
          </div>
          
          <Link 
            href="/mes-filleuls"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <List className="w-5 h-5" />
            <span className="font-semibold">Voir mes filleuls</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* 1. Carte - Code d'invitation */}
        <div className="bg-gradient-to-r from-orange-50 to-cyan-50 rounded-2xl p-5 md:p-6 mb-8 shadow-sm border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Code d&apos;invitation :
                </h3>
                <div className="flex items-center gap-3">
                  <code className="text-xl font-bold text-orange-600 bg-white px-4 py-2 rounded-lg border border-blue-200">
                    {teamData.invitationCode}
                  </code>
                  <button
                    onClick={() => copyToClipboard(teamData.invitationCode)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Copier le code"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700 font-medium mb-2">Lien d&apos;invitation :</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 flex-1 overflow-hidden">
                    <p className="text-gray-600 truncate text-sm">{teamData.invitationLink}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(teamData.invitationLink)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copier le lien
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => copyToClipboard(`${teamData.invitationCode}\n${teamData.invitationLink}`)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : ''
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
                  </>
                )}
              </button>
              
            </div>
          </div>
        </div>

        {/* 2. Statistiques - Résumé équipe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Carte 1: Membres totaux */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Membres totaux</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-gray-900">{teamData.teamMembers.total}</span>
                  <span className="text-gray-500">personnes</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-blue-600">{teamData.teamMembers.level1}</p>
                  <p className="text-xs text-gray-500">Niveau 1</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-600">{teamData.teamMembers.level2}</p>
                  <p className="text-sm text-gray-500">Niveau 2</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-600">{teamData.teamMembers.level3}</p>
                  <p className="text-sm text-gray-500">Niveau 3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carte 2: Revenu parrainage */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Landmark className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Revenu parrainage</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[10px] font-bold text-gray-900">
                    {formatCurrency(teamData.commissionEarned)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Commission totale perçue
              </p>
            </div>
          </div>
        </div>

        {/* 3. Titre - Détails de l'équipe */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Détails de l&apos;équipe</h2>
            <p className="text-gray-600 mt-1">Statistiques détaillées par niveau de commission</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Profondeur maximale: 3 niveaux</p>
          </div>
        </div>

        {/* 4. Cartes niveaux de commission */}
        <div className="space-y-4 mb-16">
          {teamData.levels.map((level) => (
            <div 
              key={level.level} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Partie haute - Fond coloré */}
              <div className={`bg-gradient-to-r ${level.color} px-5 py-4`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className="text-white font-bold">{level.level}</span>
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
                      <h3 className="font-bold text-gray-900">{level.level}</h3>
                      <p className="text-sm text-gray-500">
                        Commission: {level.commissionRate}% sur chaque premier investissement
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Revenu de ce niveau</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(level.revenue)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {level.validUsers > 0 ? `Sur ${level.validUsers} membre(s)` : 'Aucun investissement'}
                    </p>
                  </div>
                </div>

                {/* Ligne 2 : Utilisateurs valides */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Membres à ce niveau</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">{level.validUsers} personne(s)</span>
                    {level.validUsers > 0 && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    )}
                  </div>
                </div>

                {/* Information supplémentaire avec calcul explicite */}
                {level.validUsers > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 mb-1 font-medium">
                      💡 Calcul détaillé :
                    </p>
                    <p className="text-xs text-blue-600">
                      {level.commissionRate}% × {level.validUsers} membre(s) ayant investi
                      {level.revenue > 0 ? ` = ${formatCurrency(level.revenue)}` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note d'information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-28">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Comment fonctionne le parrainage ?</p>
              <p className="text-sm text-gray-600 mb-2">
                Votre réseau est limité à 3 niveaux de profondeur :
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Niveau 1 (Menbre A)</strong> : 3% de commission sur le premier investissement de chaque filleul direct</li>
                <li>• <strong>Niveau 2 (Menbre B)</strong> : 2% de commission sur le premier investissement des filleuls de vos filleuls</li>
                <li>• <strong>Niveau 3 (Menbre C)</strong> : 1% de commission sur le premier investissement des filleuls de niveau 3</li>
              </ul>
              <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800 font-medium">
                  📊 Affichage corrigé : Les revenus affichés correspondent maintenant au calcul réel 
                  (montant investi × taux de commission) et non plus à une estimation.
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Les commissions sont versées automatiquement sur votre portefeuille 
                dès qu'un membre parrainé effectue son premier investissement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}











































































