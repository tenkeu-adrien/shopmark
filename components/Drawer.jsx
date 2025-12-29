// components/Drawer.js
"use client";

import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  loading = false 
}) {
  const sizeClasses = {
    sm: "w-full sm:w-96",
    md: "w-full sm:w-2/3 lg:w-1/2 xl:w-1/3",
    lg: "w-full sm:w-3/4 lg:w-2/3 xl:w-1/2",
    xl: "w-full sm:w-11/12 lg:w-5/6 xl:w-2/3"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 ${sizeClasses[size]} overflow-y-auto`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Chargement...</span>
                </div>
              ) : (
                children
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}