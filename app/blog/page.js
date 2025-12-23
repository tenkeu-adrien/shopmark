

// export const metadata: Metadata = {
//   title: "Développement Web | Dev Agency",
//   description:
//     "Création de sites web vitrines, e-commerce et plateformes personnalisées avec les technologies les plus modernes."
// };

import Footer from "@/components/Footer";
import Image from "next/image";
import { FaLaptopCode } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaPenFancy } from 'react-icons/fa';

export default function DeveloppementWebPage() {
    return (
      <>
 <div className="relative h-[500px] w-full overflow-hidden">
      {/* Image de fond fixe avec overlay */}
      {/* <div className="fixed inset-0 -z-10">
        <Image
          src="/9.jpg" // Remplacez par votre image de blog
          alt="Agence web Douala"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div> */}

      {/* Contenu */}
      <div className="relative h-full flex items-center bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <a href="/" className="group">
                <span className="flex items-center space-x-2 mb-6 transition-all group-hover:translate-x-1">
                  <IoMdArrowRoundBack className="text-2xl text-white group-hover:text-orange-500 transition-colors" />
                  <span className="text-white text-xl md:text-2xl">Retour à l'accueil</span>
                </span>
              </a>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Le Blog Tech de Dev Agency
              </h1>
              
              <p className="text-xl mb-8 max-w-lg">
                Découvrez nos analyses, tutoriels et bonnes pratiques en développement web, design UX/UI et stratégie digitale.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center  bg-opacity-10 rounded-full px-6 py-3 backdrop-blur-sm">
                  <FaPenFancy className="mr-3 text-orange-400" />
                  <span>+10 articles experts</span>
                </div>
                <div className="flex items-center bg-opacity-10 rounded-full px-6 py-3 backdrop-blur-sm">
                  <FaLaptopCode className="mr-3 text-orange-400" />
                  <span>Conseils pratiques</span>
                </div>
              </div>
            </div>
            
            {/* Illustration côté droit (optionnel) */}
            <div className="hidden md:block relative h-80">
              <Image
                src="/blog.jpg"
                alt="Agence web Douala"
                layout="fill"
                objectFit="contain"
                className="animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </div>




      <main className="px-4 md:px-16 py-12 max-w-5xl mx-auto" >
        <h1 className="text-3xl md:text-5xl font-bold text-orange-600 mb-6">
          Développement Web
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Chez Dev Agency, nous transformons vos idées en réalités digitales. Que vous ayez besoin
          d'un site vitrine pour présenter vos activités ou d'une plateforme web complexe,
          notre équipe maîtrise les dernières technologies pour vous livrer un produit
          performant, rapide, et adapté à vos besoins.
        </p>
  
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Sites vitrines</h2>
            <p className="text-gray-600">
              Un site professionnel, responsive et adapté à votre image. Idéal pour
              les petites entreprises, artisans, consultants, etc.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Sites e-commerce</h2>
            <p className="text-gray-600">
              Vendez en ligne avec une boutique sur mesure, sécurisée, facile à gérer et optimisée
              pour la conversion.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Applications web sur mesure</h2>
            <p className="text-gray-600">
              Nous conçevons des applications puissantes et scalables pour vos besoins
              spécifiques : intranet, ERP, gestion de contenu, etc.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Technologies utilisées</h2>
            <p className="text-gray-600">
              React, Next.js, Tailwind CSS, Node.js, Firebase, et plus encore selon
              le projet.
            </p>
          </div>
        </section>
  
        <div className="mt-12">
          <a
            href="/contact"
            className="inline-block bg-orange-500 text-white font-medium px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            Demander un devis gratuit
          </a>
        </div>
      </main>
      <Footer />
      </>
    );
  }





 