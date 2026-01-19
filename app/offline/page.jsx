// app/offline/page.tsx
"use client"
import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";

export const metadata = {
  title: "Hors ligne – ShopMark",
  description: "Vous êtes actuellement hors connexion internet",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Illustration container */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-blue-500/10 blur-2xl dark:bg-blue-500/5 animate-pulse-slow" />
              <div className="relative rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-8 shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10">
                <WifiOff className="h-20 w-20 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Vous êtes hors ligne
          </h1>

          <p className="mb-10 text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
            Il semble que la connexion internet ait décidé de prendre une petite pause…  
            Pas de panique, on est dans le même bateau !
          </p>

          <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-95"
            >
              <RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180" />
              Réessayer
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-750"
            >
              <Home className="h-5 w-5" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Astuces / état */}
          <div className="mx-auto max-w-md rounded-xl bg-white/60 p-6 text-left text-sm text-slate-600 shadow-sm backdrop-blur-sm dark:bg-slate-800/40 dark:text-slate-400">
            <p className="mb-3 font-medium">Quelques idées en attendant :</p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Vérifiez votre connexion Wi-Fi / données mobiles</li>
              <li>Activez/désactivez le mode avion quelques secondes</li>
              <li>Essayez de changer de réseau (4G → Wi-Fi ou inversement)</li>
            </ul>
          </div>

          <p className="mt-12 text-sm text-slate-500 dark:text-slate-600">
            ShopMark • On revient dès que le réseau veut bien coopérer ✦
          </p>
        </div>
      </div>
    </div>
  );
}