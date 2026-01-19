// components/offline-content.tsx
"use client";

import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function OfflineContent() {
  return (
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
  );
}