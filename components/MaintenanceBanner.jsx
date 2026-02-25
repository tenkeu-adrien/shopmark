// Composant de maintenance
const MaintenanceBanner = ({ show }) => {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 border-2 border-amber-200"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {MAINTENANCE_MESSAGE.title}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {MAINTENANCE_MESSAGE.message}
          </p>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
            <p className="text-amber-800 text-sm">
              {MAINTENANCE_MESSAGE.details}
            </p>
            <p className="text-amber-700 text-xs mt-2 font-medium">
              ⏱️ {MAINTENANCE_MESSAGE.estimatedTime}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Retour au tableau de bord
            </button>
            
            <button
              onClick={() => window.open(`https://wa.me/${cleanedNumber}`, '_blank')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <span>📞</span>
              Support
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};