"use client";
import { motion } from "framer-motion";
import { FaPalette, FaGoogle, FaHandsHelping, FaBullhorn } from "react-icons/fa";

const features = [
  {
    icon: <FaPalette className="text-3xl text-orange-500" />,
    title: "Identité visuelle cohérente",
    description:
      "Nous adaptons votre logo et vos couleurs à votre activité, pour un rendu harmonieux et professionnel, fidèle à votre image de marque.",
  },
  {
    icon: <FaGoogle className="text-3xl text-orange-500" />,
    title: "Visibilité sur Google",
    description:
      "Référencement naturel (SEO) optimisé dès le départ + configuration de votre fiche Google Business pour améliorer votre présence locale.",
  },
  {
    icon: <FaHandsHelping className="text-3xl text-orange-500" />,
    title: "Accompagnement personnalisé",
    description:
      "Support technique inclus pendant 3 mois après la mise en ligne. Nous restons à vos côtés pour les ajustements et la maintenance.",
  },
  {
    icon: <FaBullhorn className="text-3xl text-orange-500" />,
    title: "Campagnes sponsorisées",
    description:
      "1er mois de gestion offert pour vos publicités Google Ads ou réseaux sociaux. Attirez du trafic qualifié dès les premiers jours.",
  },
];

export default function CustomSolution() {
  return (
    <section className="py-20 px-6 bg-orange-500 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          La solution sur-mesure avec <span className="text">Dev Agency</span>
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-orange-600">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
