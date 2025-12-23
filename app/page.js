"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  CreditCard,
  Users,
  Banknote,
  HelpCircle,
  ChevronRight,
  Trophy,
  Star,
  Zap,
  Crown,
  Target,
  TrendingUp,
  Info,
  UserPlus,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WebTabFooter from "@/components/WebTabFooter";
import WhatsAppButtonSimple from "@/components/WhatsAppButtonSimple";
import TelegramAppButtone from "@/components/TelegramAppButton";
import HeroSlider from "@/components/HeroSlider";
import Image from "next/image";

export default function CriteoWelcomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    { id: 1, alt: "Illustration financière 1" },
    { id: 2, alt: "Illustration financière 2" },
    { id: 3, alt: "Illustration financière 3" },
    { id: 4, alt: "Illustration financière 4" },
  ];

  const cards = [
    {
      id: 1,
      title: "Interne – Découverte",
      validity: 140,
      dailyGains: 0,
      deposit: 0,
      icon: <Target className="w-6 h-6 text-amber-600" />,
      buttonIcon: <ChevronRight className="w-4 h-4" />,
    },
    {
      id: 2,
      title: "Niveau Manager",
      validity: 120,
      dailyGains: 250,
      deposit: 1000,
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      buttonIcon: <ChevronRight className="w-4 h-4" />,
    },
    {
      id: 3,
      title: "VIP 7 – Niveau Président",
      validity: 90,
      dailyGains: 5000,
      deposit: 50000,
      icon: <Crown className="w-6 h-6 text-amber-600" />,
      buttonIcon: <ChevronRight className="w-4 h-4" />,
    },
    {
      id: 4,
      title: "VIP 8 – Niveau Suprême",
      validity: 60,
      dailyGains: 10000,
      deposit: 100000,
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      buttonIcon: <ChevronRight className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Conteneur principal */}
      <div className="containerr mx-auto px-4 py-8 w-full">
        
        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-1xl md:text-sm font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            Centre d'accueil SHOPMARK
          </h1>
          <p className="text-gray-400 text-sm">Gestion premium de vos investissements</p>
        </motion.div>

        {/* Section visuelle animée */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-48 mb-16 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 border border-amber-900/30"
        >
          <AnimatePresence mode="wait">
            {images.map(
              (image, index) =>
                index === currentImageIndex && (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                      <div className="relative z-20 text-center">
                        <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-amber-300">
                          Performance Élite
                        </h3>
                        <p className="text-gray-300 mt-2">
                          Solutions d'investissement premium
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentImageIndex
                    ? "bg-amber-500 w-8"
                    : "bg-gray-600 hover:bg-gray-500"
                )}
              />
            ))}
          </div>
        </motion.div> */}
  <HeroSlider />
        {/* Actions principales */}
     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 h-30"
>
  {/* Bouton Dépôt */}
  <a
    href="/DepotPage"
    className="group bg-white text-gray-900 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:bg-amber-50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-95"
  >
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-colors" />
      <Wallet className="w-8 h-8 text-amber-600 relative z-10" />
    </div>
    <span className="text-[10px] font-semibold mb-2">Recharge en espèces</span>
    <p className="text-gray-600 text-[15px]">Ajoutez des fonds à votre compte</p>
  </a>

  {/* Bouton Retrait */}
  <a
    // onClick={() => router.push('/retrait')}
    href="/RetraitPage"
    className="group bg-white text-gray-900 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:bg-amber-50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-95 p-4"
  >
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-colors" />
      <CreditCard className="w-10 h-10 text-amber-600 relative z-10" />
    </div>
    <span className="text-[10px] font-semibold mb-2">Retrait en espèces</span>
    <p className="text-gray-600 text-[10px]">Retirez vos gains facilement</p>
  </a>
</motion.div>

        {/* Actions secondaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: UserPlus, label: "Invitation", color: "text-blue-500" },
            { icon: Banknote, label: "Banque", color: "text-emerald-500" },
            { icon: BookOpen, label: "Tutoriel", color: "text-purple-500" },
            { icon: Info, label: "Infos", color: "text-cyan-500" },
          ].map((action, index) => (
            <button
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg border border-gray-700/50 hover:border-amber-500/30"
            >
              <action.icon className={`w-6 h-6 ${action.color} mb-3`} />
              <span className="font-medium text-[8px">{action.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Section titres informatifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex-1">
            <h2 className="text-[12px] font-bold text-amber-300 flex items-center gap-3">
              <Star className="w-4 h-4" />
              Niveau d'adhésion
            </h2>
            <p className="text-gray-400 mt-2">Visualisez et gérez votre statut premium</p>
          </div>
          <div className="flex-1 text-right">
            <h2 className="text-[12px] font-bold text-amber-300 flex items-center justify-end gap-3">
              Dernière performance
              <TrendingUp className="w-6 h-6" />
            </h2>
            <p className="text-gray-400 mt-2 text-[9px]">Suivez vos résultats en temps réel</p>
          </div>
        </motion.div>

        {/* Liste de cards */}
    {/* Liste de cards */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.7 }}
  className="space-y-6 mb-16"
>
  {/* Niveau 1 - N1 */}
  {/* Niveau 1 - N1 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.8 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N1
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">1.050 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">30.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">31.500 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite - Icône en haut, bouton en bas */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
        <Image src="/n3.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        {/* Bouton Participer en bas */}
        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  
  {/* Barre de progression décorative */}
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 2 - N2 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.9 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N2
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">3.250 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">90.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">97.500 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
          <Image src="/n1.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 3 - N3 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.0 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N3
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">6.100 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">170.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">183.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
          <Image src="/n6.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 4 - N4 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.1 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N4
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">8.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">245.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">240.000 CDF </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
          <Image src="/n5.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 5 - N5 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.2 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N5
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">20.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">500.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">600.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
         <Image src="/n1.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 6 - N6 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.3 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N6
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">25.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">650.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">750.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
          <Image src="/n5.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 7 - N7 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.4 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N7
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">30.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :
              <strong className="text-gray-900">800.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :
              <strong className="text-emerald-600">900.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
           <Image src="/n4.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 8 - N8 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.5 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N8
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">40.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">1.000.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">1.200.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
           <Image src="/n2.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 9 - N9 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.6 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N9
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">65.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">1.500.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">1.950.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
          <Image src="/n1.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

{/* Niveau 10 - N10 */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 1.7 }}
  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
>
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Contenu gauche */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-full border border-amber-300 shadow-inner px-5 py-2.5">
            <h3 className="text-[12px] font-bold text-gray-900 text-center tracking-wide">
              N10
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Période de validité :{" "}
              <strong className="text-gray-900">365 jours</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Gains quotidiens :{" "}
              <strong className="text-gray-900">90.000 CDF</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-700">
              Montant du dépôt :{" "}
              <strong className="text-gray-900">2.000.000 CDF</strong>
            </span>
          </div>

          {/* Ajout: Revenu mensuel */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700">
              Revenu mensuel :{" "}
              <strong className="text-emerald-600">2.700.000 CDF</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex flex-col items-center justify-between h-full min-h-[120px] gap-4">
          <Image src="/n3.jpeg" alt="image"  width={150} height={400}  className="rounded-sm w-[190px]  h-[100px]" />

        <button className="text-[10px] group bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
          Participer à la tâche
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
</motion.div>

</motion.div>




        {/* Footer */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8"
        >
          <p>© 2024 Centre d'accueil Criteo. Tous droits réservés.</p>
          <p className="mt-2">Interface premium - Version 2.0</p>
        </motion.div> */}
        <WhatsAppButtonSimple />
        <TelegramAppButtone />
      </div>
    </div>
  );
}