// app/install/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Download, Share, Plus, X, Smartphone, ArrowDownToLine } from "lucide-react";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Détection iOS / iPadOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window).navigator.standalone === true;
    setIsIOS(isIOSDevice);

    // Détection si déjà installé (mode standalone)
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
                      (window).navigator.standalone === true;
    setIsStandalone(standalone);

    // Écoute l'événement natif d'installation PWA (Chrome, Edge, Samsung Internet, etc.)
    const handler = (e) => {
      e.preventDefault(); // On empêche le prompt automatique
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Nettoyage
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Déclenche le prompt natif
    deferredPrompt.prompt();

    // Attend la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Installation : ${outcome}`);

    // Reset après utilisation (ne peut être utilisé qu'une fois)
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "SHOPMARK - Votre Marketplace Premium",
        text: "Découvrez SHOPMARK, téléchargez l'application gratuitement !",
        url: window.location.href,
      }).catch(err => console.log("Erreur partage :", err));
    }
  };

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Smartphone className="w-20 h-20 text-amber-600 mb-6" />
        <h1 className="text-2xl font-bold mb-4">SHOPMARK est déjà installée !</h1>
        <p className="text-gray-600 mb-8">
          Vous utilisez déjà l'application en mode plein écran.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-amber-600 text-white px-8 py-4 rounded-xl font-medium"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Download className="w-24 h-24 text-amber-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Installez SHOPMARK
          </h1>
          <p className="text-gray-600">
            Accédez à votre marketplace premium encore plus rapidement depuis votre écran d'accueil !
          </p>
        </div>

        {/* Bouton d'installation natif (Android/Chrome/Windows) */}
        {/* {showInstallButton && !isIOS && ( */}
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-5 rounded-2xl font-bold text-lg shadow-lg mb-8 flex items-center justify-center gap-3 hover:brightness-105 transition"
          >
            <ArrowDownToLine className="w-6 h-6" />
            Installer l'application maintenant
          </button>
        {/* )} */}

        {/* Instructions pour iPhone/iPad (Safari) */}
        {isIOS && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-amber-600" />
              Comment installer sur iPhone ?
            </h2>
            <ol className="space-y-4 text-gray-700 text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                Appuyez sur le bouton <Share className="w-5 h-5 mx-1" /> Partager
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                Faites défiler et choisissez <Plus className="w-5 h-5 mx-1" /> <strong>Ajouter à l'écran d'accueil</strong>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                Appuyez sur <strong>Ajouter</strong>
              </li>
            </ol>
          </div>
        )}

        {/* Bouton de partage (utile sur tous les appareils) */}
        {navigator.share && (
          <button
            onClick={handleShare}
            className="w-full bg-gray-800 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-900 transition mb-6"
          >
            <Share className="w-5 h-5" />
            Partager le lien d'installation
          </button>
        )}

        {/* Lien alternatif */}
        <div className="text-center text-sm text-gray-500">
          Ou accédez directement à l'application : <br />
          <a href="/" className="text-amber-600 font-medium underline">
            https://shopmark.fr
          </a>
        </div>
      </div>
    </div>
  );
}