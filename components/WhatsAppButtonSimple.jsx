// components/WhatsAppButtonSimple.tsx
"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function WhatsAppButtonSimple() {
  const phoneNumber = "+243XXXXXXXXX"; // Votre numéro
  const message = "Bonjour, je souhaite obtenir plus d'informations.";
  
  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white  rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 group relative mb-35"
      >

        <Image src="/whatsapp.png"  width={60} height={60} placeholder="blur" blurDataURL="data:image/png;base64,..." alt="whatsapp"/>
        {/* <MessageCircle className="w-6 h-6" /> */}
        
        {/* Tooltip */}
        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Contactez-nous sur WhatsApp
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      </motion.button>

      {/* Notification dot */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
    </motion.div>
  );
}