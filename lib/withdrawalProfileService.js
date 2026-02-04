import { db } from '@/lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

class WithdrawalProfileService {
  constructor() {
    this.collectionName = 'withdrawal_profiles';
  }

  /**
   * Créer ou mettre à jour un profil de retrait
   */
  async saveProfile(userId, profileData) {
    try {
      const profileRef = doc(db, this.collectionName, userId);
      
      const profile = {
        ...profileData,
        userId,
        updatedAt: serverTimestamp(),
        createdAt: profileData.createdAt || serverTimestamp()
      };

      await setDoc(profileRef, profile, { merge: true });
      
      return {
        success: true,
        profileId: userId,
        data: profile
      };
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Récupérer le profil de retrait d'un utilisateur
   */
  async getProfile(userId) {
    try {
      const profileRef = doc(db, this.collectionName, userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return {
          success: true,
          exists: true,
          data: profileSnap.data()
        };
      }
      
      return {
        success: true,
        exists: false,
        data: null
      };
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mettre à jour partiellement un profil
   */
  async updateProfile(userId, updateData) {
    try {
      const profileRef = doc(db, this.collectionName, userId);
      
      await updateDoc(profileRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Supprimer le profil de retrait
   */
  async deleteProfile(userId) {
    try {
      const profileRef = doc(db, this.collectionName, userId);
      await deleteDoc(profileRef);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Erreur suppression profil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les informations de retrait par défaut
   * Si profil existe → retourner le profil
   * Sinon → retourner les infos utilisateur
   */
  async getDefaultWithdrawalInfo(userId, userInfo) {
    try {
      const profileResult = await this.getProfile(userId);
      
      if (profileResult.success && profileResult.exists) {
        return {
          success: true,
          source: 'profile',
          data: {
            phoneNumber: profileResult.data.phoneNumber,
            recipientName: profileResult.data.recipientName,
            provider: profileResult.data.provider || 'orange',
             cryptoAddress: profileResult.data.cryptoAddress || ''
          }
        };
      }
      
      // Retourner les infos utilisateur par défaut
      return {
        success: true,
        source: 'user',
        data: {
          phoneNumber: userInfo.phone || '',
          recipientName: userInfo.name || '',
          provider: 'orange' ,
           cryptoAddress: ''
        }
      };
    } catch (error) {
      console.error('Erreur info retrait par défaut:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Valider les données du profil
   */
validateProfileData(profileData) {
  const errors = [];
  
  // Si c'est crypto, valider l'adresse BEP20
  if (profileData.provider === "crypto") {
    if (!profileData.cryptoAddress || !profileData.cryptoAddress.trim()) {
      errors.push('Adresse BEP20 requise pour les retraits crypto');
    } else if (!profileData.cryptoAddress.startsWith("0x") || profileData.cryptoAddress.length !== 42) {
      errors.push('Adresse BEP20 invalide (doit commencer par 0x et faire 42 caractères)');
    }
  } else {
    // Validation pour les méthodes mobiles
    const phoneRegex = /^\d{8,15}$/;
    if (!profileData.phoneNumber || !phoneRegex.test(profileData.phoneNumber)) {
      errors.push('Numéro de téléphone invalide (8-15 chiffres, sans code pays)');
    }
    
    if (!profileData.recipientName || profileData.recipientName.trim().length < 2) {
      errors.push('Nom du bénéficiaire invalide (minimum 2 caractères)');
    }
  }
  
  // Validation du provider
  const validProviders = ['orange', 'airtel', 'mpesa', 'crypto'];
  if (!profileData.provider || !validProviders.includes(profileData.provider)) {
    errors.push('Moyen de retrait invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
}


export const withdrawalProfileService = new WithdrawalProfileService();