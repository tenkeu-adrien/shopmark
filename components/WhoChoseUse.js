"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const reasons = [
  {
    title: "Visibilité garantie",
    description: "Vos clients vous trouvent facilement sur Google et sur mobile grâce à une structure optimisée.",
  },
  {
    title: "Attirez plus de clients",
    description: "Un site qui convertit : attirez de nouveaux prospects et développez votre activité en ligne.",
  },
  {
    title: "Une image de marque solide",
    description: "Nous renforçons votre crédibilité grâce à un design professionnel et cohérent avec vos valeurs.",
  },
  {
    title: "Accompagnement complet",
    description: "On s’occupe de tout, de la maquette à la mise en ligne, avec pédagogie et sans jargon technique.",
  },
  {
    title: "100% adapté à vos besoins",
    description: "Chaque projet est unique. Nous développons une solution sur-mesure, évolutive et performante.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-6 bg-white text-gray-800 mt-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Partie gauche : contenu */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pourquoi choisir Dev Agency ?
          </h2>
          <ul className="space-y-5">
            {reasons.map((reason, idx) => (
              <li key={idx}>
                <h3 className="text-xl font-semibold text-orange-500">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contact#devis"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md"
            >
              Devis gratuit
            </motion.a>
          </div>
        </motion.div>

        {/* Partie droite : image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/5.jpg" // 👉 remplace par ton image locale
            alt="Agence web Douala"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
