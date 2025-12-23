import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Tableau d'images (ajustez les chemins selon vos images)
  const images = [
    { 
      id: 1, 
      src: "/shopmark1.jpeg", 
      alt: "Investissement intelligent",
      title: "Performance Élite",
      subtitle: "Maximisez vos rendements"
    },
    { 
      id: 2, 
      src: "/shopmark2.jpeg", 
      alt: "Sécurité garantie",
      title: "Sécurité Totale",
      subtitle: "Vos investissements protégés"
    },
    { 
      id: 3, 
      src: "/shopmark3.jpeg", 
      alt: "Croissance rapide",
      title: "Croissance Rapide",
      subtitle: "Atteignez vos objectifs financiers"
    },
    { 
      id: 4, 
      src: "/shopmark4.jpeg", 
      alt: "Support expert",
      title: "Support Premium",
      subtitle: "Notre équipe à votre service"
    },
    { 
      id: 5, 
      src: "/shopmark5.jpeg", 
      alt: "Résultats prouvés",
      title: "Résultats Garantis",
      subtitle: "Des milliers de clients satisfaits"
    },
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change toutes les 4 secondes
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative h-64 md:h-80 lg:h-96 mb-16 rounded-2xl overflow-hidden border border-amber-900/30 shadow-2xl group"
    >
      <AnimatePresence mode="wait">
        {images.map(
          (image, index) =>
            index === currentImageIndex && (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Image de fond */}
                <div className="absolute inset-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
                
                {/* Overlay avec effet de profondeur */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                {/* Contenu */}
                <div className="relative z-20 h-full flex items-center justify-center p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center max-w-3xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full mb-6 backdrop-blur-sm border border-amber-500/30"
                    >
                      <Sparkles className="w-10 h-10 text-amber-300" />
                    </motion.div>
                    
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                      {image.title}
                    </h3>
                    
                    <p className="text-xl md:text-2xl text-gray-200 mb-6">
                      {image.subtitle}
                    </p>
                    
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-full mx-auto max-w-xs"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>
      
      {/* Indicateurs */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              index === currentImageIndex
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 w-8"
                : "bg-gray-400/50 hover:bg-gray-300 w-4"
            )}
          />
        ))}
      </div>
      
      {/* Compteur */}
      <div className="absolute top-4 right-4 z-30 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-white text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </span>
      </div>
      
      {/* Boutons de navigation */}
      <button
        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </motion.div>
  );
}