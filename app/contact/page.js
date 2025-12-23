import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Head from 'next/head';
import Image from 'next/image';
import { FaBullhorn, FaLaptopCode, FaMobileAlt, FaRocket, FaSearch, FaUsers, FaWordpress } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>À propos - Dev Agency | Agence de développement web et mobile</title>
        <meta
          name="description"
          content="Dev Agency est une agence digitale spécialisée dans la création de sites web, le développement d'applications web et mobiles. Nous accompagnons les entreprises dans leur transformation numérique."
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <a href="/">
                  <span className="flex items-center space-x-2 mb-4">
                    <IoMdArrowRoundBack className="text-2xl text-white" />
                    <span className="text-white text-3xl">Accueil</span>
                  </span>
                </a>
                <h1 className="text-4xl font-bold mb-6">Bienvenue chez Dev Agency</h1>
                <p className="text-xl mb-8">
                  Depuis 2021, nous propulsons la croissance digitale des entreprises en créant des solutions sur mesure : sites web modernes, applications performantes et interfaces intuitives.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center  bg-opacity-20 rounded-lg px-4 py-2">
                    <FaLaptopCode className="mr-2 text-orange-600" />
                    <span>+10 projets réalisés</span>
                  </div>
                  <div className="flex items-center  bg-opacity-20 rounded-lg px-4 py-2">
                    <FaUsers className="mr-2 text-orange-600" />
                    <span>Clients satisfaits à 85%</span>
                  </div>
                </div>
              </div>
              <div className="relative h-80 md:h-96">
                <Image
                  src="/6.jpg"
                  alt="Équipe Dev Agency au travail"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-xl"
                  priority
                />
                <div className="absolute -bottom-6 -left-6 bg-orange-800 w-24 h-24 rounded-full opacity-100"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc Présentation */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-700 p-6 flex items-center">
              <FaRocket className="text-orange-600 text-3xl mr-4" />
              <h2 className="text-2xl font-bold text-white">Qui sommes-nous ?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Notre vision</h3>
                <p>
                  Dev Agency accompagne les entreprises, startups et entrepreneurs dans leur digitalisation en concevant des solutions modernes, évolutives et optimisées pour le référencement.
                </p>

                <h3 className="text-xl font-semibold text-gray-800">Nos domaines d'expertise</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaLaptopCode className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Création de sites web performants et responsives</span>
                  </li>
                  <li className="flex items-start">
                    <FaMobileAlt className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Développement d’applications  web et mobiles sur mesure</span>
                  </li>

                  <li className='flex items-start'>
                     < FaWordpress className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
    <span>Création de Site WordPress</span>
                  </li>
                  <li className='flex items-start'>
                  <FaSearch className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Optimisation de votre site pour Google.(SEO)</span>
                  </li>
                  <li className='flex items-start'>
                  <FaBullhorn className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Campagnes sponsorisées sur Google & Réseaux sociaux.(SEM)</span>
                  </li>

                  
                   
                </ul>
              </div>
              <div className="relative h-64 md:h-full">
                <Image
                  src="/7.jpg"
                  alt="Développement web chez Dev Agency"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <ContactForm />


        {/* Bloc Équipe */}
        <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 p-6 flex items-center">
              <FaUsers className="text-orange-500 text-3xl mr-4" />
              <h2 className="text-2xl font-bold text-white">Une équipe de passionnés</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="relative h-64 md:h-full">
                <Image
                  src="/4.jpg"
                  alt="Collaboration au sein de Dev Agency"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Compétence et innovation</h3>
                <p>
                  Nos développeurs, designers et chefs de projet travaillent en synergie pour livrer des produits à forte valeur ajoutée, optimisés pour le SEO, l’expérience utilisateur et les performances techniques.
                </p>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Notre stack technique</h4>
                  <div className="flex flex-wrap gap-2 text-orange-600">
                    <span className="bg-white px-3 py-1  rounded-full text-sm shadow">Next.js</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">React Native</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">Laravel</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">Firebase</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">Wordpress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nos valeurs */}
        <div className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">Nos valeurs fondamentales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaRocket className="text-3xl mb-4 text-orange-500" />,
                  title: 'Innovation',
                  text: 'Nous utilisons les dernières technologies pour vous garantir un avantage concurrentiel.',
                },
                {
                  icon: <FaUsers className="text-3xl mb-4 text-orange-500" />,
                  title: 'Écoute',
                  text: 'Votre projet est unique, notre accompagnement aussi.',
                },
                {
                  icon: <FaLaptopCode className="text-3xl mb-4 text-orange-500" />,
                  title: 'Qualité',
                  text: 'Chaque ligne de code est pensée pour la performance et la pérennité.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center p-6 bg-gray-700 rounded-lg shadow-md">
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
