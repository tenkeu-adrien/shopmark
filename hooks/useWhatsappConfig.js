import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function useWhatsappConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configRef = doc(db, 'admin_config', 'whatsapp_settings');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        setConfig(configSnap.data());
      } else {
        // Configuration par défaut
        setConfig({
          phoneNumber: "+243XXXXXXXXX",
          message: "Bonjour, je souhaite obtenir plus d'informations.",
          groupLink: "https://chat.whatsapp.com/Ia3LZeKx2BI9kBhQogzQi8"
        });
      }
    } catch (error) {
      console.error('Erreur chargement config WhatsApp:', error);
      // Configuration par défaut en cas d'erreur
      setConfig({
        phoneNumber: "+243XXXXXXXXX",
        message: "Bonjour, je souhaite obtenir plus d'informations.",
        groupLink: "https://chat.whatsapp.com/Ia3LZeKx2BI9kBhQogzQi8"
      });
    } finally {
      setLoading(false);
    }
  };

  return { config, loading };
}