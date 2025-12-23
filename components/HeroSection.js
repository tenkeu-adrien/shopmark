"use client";
import { motion } from "framer-motion";



export default function HeroWithNavbar({title,content,image}) {

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url('${image}')`, // 👉 remplace par ton image locale ou URL
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Navbar */}
      {/* <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-black/70 backdrop-blur">
        <h1 className="text-2xl font-bold text-orange-500">Dev Agency</h1>
        <ul className="flex space-x-6">
          {navLinks.map((link) => (
            <motion.li
              key={link.href}
              whileHover={{ y: -2 }}
              className="relative group"
            >
              <Link
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-orange-500 font-semibold"
                    : "text-white"
                } transition-colors`}
              >
                {link.label}
              </Link>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </motion.li>
          ))}
        </ul>
      </nav> */}

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
{title}
</h2>
<p className="text-lg md:text-xl text-white/80 mb-8">
  {content} 
</p>

          <div className="flex justify-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/#contact"
              className="bg-orange-600 px-6 py-3 rounded-xl text-white shadow-lg"
            >
              Nous contacter
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contact#devis"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl shadow-lg"
            >
              Devis gratuit
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
