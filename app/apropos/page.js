import Footer from '@/components/Footer';
import Head from 'next/head';
import Image from 'next/image';
import { FaEnvelope, FaHeadset, FaExclamationTriangle } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>Contactez Dev Agency - Agence Digitale à votre écoute</title>
        <meta
          name="description"
          content="Besoin d'un site web, d'une application mobile ou d'une stratégie digitale sur mesure ? Contactez Dev Agency pour échanger avec notre équipe disponible et réactive."
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <a href="/">
                  <span className="flex items-center space-x-2 mb-4">
                    <IoMdArrowBack className="text-2xl text-orange-600" />
                    <span className="text-white text-3xl">Accueil</span>
                  </span>
                </a>
                <h1 className="text-4xl font-bold mb-6">Une idée, un projet digital ?</h1>
                <p className="text-xl mb-8">
                  Chez <strong>Dev Agency</strong>, nous accompagnons les entreprises et les entrepreneurs dans la création de solutions digitales efficaces. Que ce soit pour un site web, une application mobile ou une stratégie marketing, notre équipe est à votre écoute.
                </p>
                <div className="flex items-center bgj-white bg-opacity-20 rounded-lg px-4 py-2">
                  <FaEnvelope className="mr-2 text-orange-600" />
                  <a hreef="mailto:contact@devagencyweb.online" className='cursor-pointer' target='_blank'>contact@devagencyweb.online</a>
                </div>
              </div>

              <div className="relative h-80 md:h-96">
                <Image
                  src="/4.jpg"
                  alt="Agence web Douala"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                  priority
                />
                <div className="absolute -bottom-6 -right-6 bg-orange-900 w-24 h-24 rounded-full opacity-100"></div>
                <div className="absolute -top-6 -left-6 bg-black w-20 h-20 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections de contact */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact équipe */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 p-4 flex items-center">
              <FaHeadset className="text-orange-600 text-2xl mr-3" />
              <h2 className="text-xl font-bold text-white">Un accompagnement sur mesure</h2>
            </div>
            <div className="p-6">
              <div className="relative h-48 mb-6">
                <Image
                  src="/9.jpg"
                  alt="Développeur en contact avec client"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="mb-4">
                Vous avez une question sur un futur projet digital ? Notre équipe vous conseille gratuitement pour :
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>La création de votre site vitrine ou e-commerce</li>
                <li>Le développement d'application web ou mobile</li>
                <li>La refonte ou l'optimisation SEO de votre site</li>
                <li>Le lancement de campagnes Google Ads ou Facebook</li>
              </ul>
              <a
                href="mailto:contact@devagencyweb.online"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                Écrire à notre équipe
              </a>
            </div>
          </div>

          {/* Signaler un besoin ou un blocage */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-orange-500 p-4 flex items-center">
              <FaExclamationTriangle className="text-white text-2xl mr-3" />
              <h2 className="text-xl font-bold text-white">Un besoin urgent ou un blocage ?</h2>
            </div>
            <div className="p-6">
              <div className="relative h-48 mb-6">
                <Image
                  src="/8.jpg"
                  alt="Signaler un besoin ou une erreur"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="mb-4">
                Vous rencontrez un problème technique ou souhaitez une intervention rapide sur votre site ou application ? Écrivez-nous à <a href='mailto:contact@devagencyweb.online' className="text-xl text-orange-500 cursor pointer" target='_blank'>contact@devagencyweb.online</a>. Nous nous engageons à :
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>Analyser votre situation sous 24h</li>
                <li>Proposer une solution adaptée</li>
                <li>Mettre en place un suivi personnalisé</li>
                <li>Optimiser vos performances digitales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
