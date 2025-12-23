

// export const metadata: Metadata = {
//   title: "Développement Web | Dev Agency",
//   description:
//     "Création de sites web vitrines, e-commerce et plateformes personnalisées avec les technologies les plus modernes."
// };

import Footer from "@/components/Footer";
import HeroWithNavbar from "@/components/HeroSection";

export default function DeveloppementWebPage() {
  let title = " Agence SEM – Google Ads & Publicité en ligne"
  let content= "Attirez des clients avec des campagnes Google Ads optimisées pour les conversions."
  let  image ="/sem.jpg"
  return (
    <>
      <HeroWithNavbar content={content} image={image} title={title}/>
    <main className="px-4 md:px-16 py-12 max-w-5xl mx-auto">
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