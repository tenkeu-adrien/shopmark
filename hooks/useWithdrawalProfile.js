import { useState, useEffect } from 'react';
import { withdrawalProfileService } from '@/lib/withdrawalProfileService';

export const useWithdrawalProfile = (userId, userInfo) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('user'); // 'profile' ou 'user'

  // Charger le profil au démarrage
  useEffect(() => {
    if (userId && userInfo) {
      loadProfile();
    }
  }, [userId, userInfo]);

  const loadProfile = async () => {
    if (!userId || !userInfo) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await withdrawalProfileService.getDefaultWithdrawalInfo(userId, userInfo);
      
      if (result.success) {
        setProfile(result.data);
        setSource(result.source);
      } else {
        setError(result.error);
        // En cas d'erreur, utiliser les infos utilisateur
        setProfile({
          phoneNumber: userInfo.phone || '',
          recipientName: userInfo.name || '',
          provider: 'orange' ,
          cryptoAddress: ''
        });
        setSource('user');
      }
    } catch (err) {
      setError(err.message);
      setProfile({
        phoneNumber: userInfo.phone || '',
        recipientName: userInfo.name || '',
        provider: 'orange' ,
        cryptoAddress: ''
      });
      setSource('user');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData) => {
    if (!userId) {
      throw new Error('Utilisateur non connecté');
    }
    
    setLoading(true);
    
    try {
      // Validation des données
      const validation = withdrawalProfileService.validateProfileData(profileData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const result = await withdrawalProfileService.saveProfile(userId, profileData);
      
      if (result.success) {
        setProfile(profileData);
        setSource('profile');
        return {
          success: true,
          message: 'Profil sauvegardé avec succès'
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    if (!userId) {
      throw new Error('Utilisateur non connecté');
    }
    
    setLoading(true);
    
    try {
      const result = await withdrawalProfileService.updateProfile(userId, updateData);
      
      if (result.success) {
        setProfile(prev => ({ ...prev, ...updateData }));
        return {
          success: true,
          message: 'Profil mis à jour avec succès'
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!userId) {
      throw new Error('Utilisateur non connecté');
    }
    
    setLoading(true);
    
    try {
      const result = await withdrawalProfileService.deleteProfile(userId);
      
      if (result.success) {
        setProfile({
          phoneNumber: userInfo.phone || '',
          recipientName: userInfo.name || '',
          provider: 'orange'
        });
        setSource('user');
        return {
          success: true,
          message: 'Profil supprimé avec succès'
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    source,
    saveProfile,
    updateProfile,
    deleteProfile,
    refresh: loadProfile,
    hasProfile: source === 'profile'
  };
};