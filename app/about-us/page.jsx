"use client";
import React from 'react';
import { Calendar, Users, Target, Globe, Shield, Truck, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Apropos = () => {
  const services = [
    { icon: <Shield className="w-6 h-6" />, title: "Achat en ligne sécurisé", description: "Transactions protégées et garanties pour vos clients" },
    { icon: <Truck className="w-6 h-6" />, title: "Livraison rapide et fiable", description: "Logistique optimisée pour une distribution efficace" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Promotion sur les réseaux sociaux", description: "Stratégies social média pour maximiser votre portée" },
    { icon: <Award className="w-6 h-6" />, title: "Stratégies de visibilité", description: "Solutions pour la croissance et reconnaissance de marque" }
  ];
const router = useRouter();
  const milestones = [
    { year: "1950", event: "Création à Budapest, Hongrie" },
    { year: "1997", event: "Ouverture officielle dans plusieurs états" }
  ];
const whatsappNumber = "+1 (450) 914-1073";
  
    // Nettoyer le numéro pour l'URL WhatsApp
    const cleanedNumber = whatsappNumber.replace(/\s|\(|\)|-/g, '')
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">

   <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900"></h1>
              <p className="text-gray-600 text-sm mt-1"></p>
            </div>
            
            <div className="w-20"></div> {/* Spacer pour l'alignement */}
          </div>
        
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            À propos de <span className="text-blue-600">nous</span>
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une agence de marketing dynamique et innovante, connectant les entreprises à leurs clients depuis 1950
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Section principale */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Historique</h2>
                  <p className="text-gray-600">Fondée en Hongrie</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 text-lg">
                Nous sommes une agence de marketing dynamique et innovante, spécialisée dans la collaboration avec de grandes entreprises commerciales. Créée à Budapest en 1950, nous avons officiellement étendu notre présence à plusieurs états en 1997.
              </p>
              
              <div className="flex items-center mt-8 p-4 bg-blue-50 rounded-xl">
                <div className="mr-4">
                  <div className="bg-white p-3 rounded-lg shadow">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notre Mission</h3>
                  <p className="text-gray-700">
                    Valoriser et propulser vos produits grâce à des stratégies marketing efficaces, tant en ligne que hors ligne.
                  </p>
                </div>
              </div>
            </div>

            {/* Jalon historique */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">Notre Parcours</h3>
              </div>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-white text-blue-600 font-bold py-1 px-4 rounded-lg mr-4 min-w-20 text-center">
                      {milestone.year}
                    </div>
                    <p className="pt-1">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section services et équipe */}
          <div>
            {/* Services */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center mb-8">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Nos Services</h2>
                  <p className="text-gray-600">Solutions complètes pour votre succès</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
                    <div className="text-blue-600 mb-4">{service.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direction et équipe */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Direction & Équipe</h3>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">DJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Dániel Jellinek</h4>
                  <p className="text-gray-300">Directeur Général</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-300 mb-4">
                  Avec une équipe expérimentée et passionnée, nous connectons les entreprises à leurs clients, partout et à tout moment.
                </p>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-lg font-semibold text-center">
                    Faites confiance à notre expertise pour faire briller votre marque !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

  
        {/* CTA */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à propulser votre marque ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Rejoignez les grandes entreprises qui nous font confiance pour leurs stratégies marketing.
          </p>
          <a href={`https://wa.me/${cleanedNumber}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105">
            Contactez-nous
          </a>
        </div>

        {/* Section Image */}
        <div className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Marque en Action</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Découvrez comment nous transformons les stratégies marketing en résultats concrets
            </p>
          </div>
          
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/shopmark.jpeg"
              alt="Shopmark - Notre agence de marketing en action"
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-105"
              priority
            />
            
            {/* Overlay avec texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Shopmark Excellence</h3>
                <p className="text-lg opacity-90">Innovation, créativité et résultats depuis 1950</p>
              </div>
            </div>
          </div>
          
          {/* Légende */}
          <div className="text-center mt-6">
            <p className="text-gray-600 italic">
              Notre siège à Budapest et nos bureaux internationaux - où la magie marketing opère
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apropos;