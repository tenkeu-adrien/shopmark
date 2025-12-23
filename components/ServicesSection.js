// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";

// const services = [
//   {
//     title: "Développement Web",
//     description:
//       "Sites vitrines, e-commerce, plateformes sur-mesure : nous développons des interfaces rapides, modernes et performantes.",
//     href: "/services/developpement-web",
//   },
//   {
//     title: "Applications Mobiles",
//     description:
//       "Applications iOS et Android adaptées à vos besoins, avec une expérience utilisateur fluide et intuitive.",
//     href: "/services/applications-mobiles",
//   },
//   {
//     title: "Référencement Naturel (SEO)",
//     description:
//       "Optimisez votre visibilité sur Google avec des techniques SEO éprouvées et durables.",
//     href: "/services/seo",
//   },
//   {
//     title: "Publicité en Ligne (SEM)",
//     description:
//       "Attirez des clients rapidement grâce à des campagnes Google Ads et Facebook Ads ciblées.",
//     href: "/services/sem",
//   },
//   {
//     title: "Stratégie Marketing",
//     description:
//       "Définissons ensemble une stratégie digitale cohérente et efficace pour atteindre vos objectifs business.",
//     href: "/services/strategie-marketing",
//   },
// ];

// export default function ServicesSection() {
//   return (
//     <section className="bg-white py-20 px-6" id="services">
//       <div className="max-w-6xl mx-auto text-center mb-16">
//         <motion.h2
//           className="text-3xl md:text-4xl font-bold text-gray-900"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//         >
//           Nos Services
//         </motion.h2>
//         <motion.p
//           className="mt-4 text-gray-600 text-lg"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.1 }}
//         >
//           Des solutions digitales adaptées à chaque besoin pour booster votre activité.
//         </motion.p>
//       </div>

//       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
//         {services.map((service, index) => (
//           <motion.div
//             key={index}
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.98 }}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: index * 0.1 }}
//           >
//             <Link href={service.href}>
//               <div className="border border-gray-200 rounded-xl p-6 h-full shadow-sm hover:shadow-md transition cursor-pointer hover:border-orange-500">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                   {service.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm">{service.description}</p>
//               </div>
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }


// Composant ServicesSection.jsx avec icônes
// components/ServicesSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {  FaMobileAlt, FaSearch, FaBullhorn,  FaWordpress } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
const services = [
  {
    icon: <FaComputer className="text-4xl text-orange-500" />,
    title: "Développement Web",
    description: "Sites vitrines, e-commerce, plateformes sur-mesure.",
    link: "/services/developpement-web",
  },
  {
    icon: <FaMobileAlt className="text-4xl text-orange-500" />,
    title: "Développement Mobile",
    description: "Applications mobiles Android et iOS performantes.",
    link: "/services/developpement-mobile",
  },
  {
    icon: <FaSearch className="text-4xl text-orange-500" />,
    title: "SEO",
    description: "Optimisation de votre site pour Google.",
    link: "/services/seo",
  },
  {
    icon: <FaBullhorn className="text-4xl text-orange-500" />,
    title: "SEM",
    description: "Campagnes sponsorisées sur Google & Réseaux sociaux.",
    link: "/services/sem",
  },
  {
    icon: < FaWordpress className="text-4xl text-orange-500" />,
    title: "Création de Site WordPress",
    description: "Sites web professionnels, sur-mesure et optimisés pour vos besoins.",
    link: "/services/creation-site-wordpress",
  }
];

export default function ServicesSection() {
  return (
    <section className="py-16 px-4 md:px-10 bg-white" id="services">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nos Services
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="border p-6 rounded-2xl shadow hover:shadow-xl bg-white hover:bg-orange-50 transition-colors duration-300"
            >
              <Link href={service.link} className="flex flex-col items-center text-center space-y-4">
                <div>{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

