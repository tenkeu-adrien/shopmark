'use client';

import { AirVentIcon } from 'lucide-react';
import { useState } from 'react';

// Données de démonstration pour les retraits
const retraitsData = [
  { id: 1, libelle: 'Retrait commandé', date: '15 déc. 2024', montant: 15000 },
  { id: 2, libelle: 'Retrait commandé', date: '14 déc. 2024', montant: 8500 },
  { id: 3, libelle: 'Retrait commandé', date: '13 déc. 2024', montant: 23000 },
  { id: 4, libelle: 'Retrait commandé', date: '12 déc. 2024', montant: 12500 },
  { id: 5, libelle: 'Retrait commandé', date: '11 déc. 2024', montant: 18000 },
  { id: 6, libelle: 'Retrait commandé', date: '10 déc. 2024', montant: 9500 },
  { id: 7, libelle: 'Retrait commandé', date: '9 déc. 2024', montant: 21000 },
  { id: 8, libelle: 'Retrait commandé', date: '8 déc. 2024', montant: 14200 },
  { id: 9, libelle: 'Retrait commandé', date: '7 déc. 2024', montant: 16700 },
  { id: 10, libelle: 'Retrait commandé', date: '6 déc. 2024', montant: 18900 },
];

// Données de démonstration pour les investissements
const investissementsData = [
  { id: 1, libelle: 'Investissement', date: '15 déc. 2024', montant: 25000 },
  { id: 2, libelle: 'Investissement', date: '14 déc. 2024', montant: 18000 },
  { id: 3, libelle: 'Investissement', date: '13 déc. 2024', montant: 32000 },
  { id: 4, libelle: 'Investissement', date: '12 déc. 2024', montant: 15500 },
  { id: 5, libelle: 'Investissement', date: '11 déc. 2024', montant: 27500 },
  { id: 6, libelle: 'Investissement', date: '10 déc. 2024', montant: 14200 },
  { id: 7, libelle: 'Investissement', date: '9 déc. 2024', montant: 19800 },
  { id: 8, libelle: 'Investissement', date: '8 déc. 2024', montant: 22500 },
  { id: 9, libelle: 'Investissement', date: '7 déc. 2024', montant: 16700 },
  { id: 10, libelle: 'Investissement', date: '6 déc. 2024', montant: 31200 },
];

export default function TasksPage() {
  const [activeView, setActiveView] = useState('retraits');
  
  // Fonction pour formater les montants avec séparateurs de milliers
  const formatMontant = (montant) => {
    return montant.toLocaleString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header avec titre conditionnel */}
      <div className="mb-6">
          <h1 className="text-sm font-bold text-gray-800 mb-16">
            Historique {activeView}
          </h1>
        
        {/* Navigation par onglets */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('retraits')}
            className={`flex-1 py-1 rounded-full font-semibold transition-all  text-[10px] ${
              activeView === 'retraits'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 '
            }`}
          >
            Retrait commandé
          </button>
          
          <button
            onClick={() => setActiveView('investissements')}
            className={`flex-1 py-3 rounded-full font-semibold transition-all t-[10px] ${
              activeView === 'investissements'
                ? 'bg-amber-600 text-white '
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 text-[10px]'
            }`}
          >
            Investissements
          </button>
        </div>
      </div>

      {/* Liste des cartes */}
      <div className="space-y-4">
        {(activeView === 'retraits' ? retraitsData : investissementsData).map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              {/* Colonne gauche : Libellé + Date */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm">
                  {item.libelle}
                </span>
                <span className="text-[10px] text-gray-500 mt-1">
                  {item.date}
                </span>
              </div>
              
              {/* Colonne droite : Montant + Bouton */}
              <div className="flex flex-col items-end">
                <span className="font-bold text-red-600 text-lg">
             {activeView === 'retraits' ? `-${formatMontant(item.montant)} CDF` : `${formatMontant(item.montant)} CDF`}
                </span>
                <button
                  onClick={() => console.log(`Approuver ${item.libelle} ${item.id}`)}
                  className="mt-3 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Approuver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Espace pour le footer navigation */}
      <div className="h-20"></div>
    </div>
  );
}