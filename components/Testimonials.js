"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Fatou Ndiaye",
    message:
      "Un service professionnel du début à la fin. Mon site est rapide, beau, et mes clients me trouvent plus facilement en ligne.",
  },
  {
    name: "Jean Kouassi",
    message:
      "Dev Agency a compris nos besoins et nous a accompagnés avec rigueur. Résultat : plus de visibilité et plus de clients.",
  },
  {
    name: "Mariama Diallo",
    message:
      "J’ai adoré leur approche claire, sans jargon technique. Mon site est à mon image, je recommande à 100%.",
  },
  {
    name: "Mohamed Sylla",
    message:
      "Une équipe à l’écoute, rapide et efficace. Je suis très satisfait du travail accompli par Dev Agency.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Ce que disent <span className="text-orange-500">nos clients</span>
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-100 rounded-xl p-6 shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              <p className="italic text-gray-700 mb-4">“{testimonial.message}”</p>
              <p className="font-semibold text-orange-600">— {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
