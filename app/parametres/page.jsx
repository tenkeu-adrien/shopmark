"use client";

import { 
  Save,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Users,
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    siteName: 'Mon Application',
    siteUrl: 'https://monapp.com',
    adminEmail: 'admin@monapp.com',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    maintenance: false,
    registrationOpen: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
  });

  const [security, setSecurity] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
  });

  const [logo, setLogo] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Logique de sauvegarde
    alert('Paramètres sauvegardés !');
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres ?')) {
      // Logique de réinitialisation
      location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configurez votre application</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Réinitialiser
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Général */}
      <DashboardCard 
        title="Général" 
        icon={<Globe className="w-5 h-5" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du site
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email administrateur
            </label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - Dollar US</option>
              <option value="GBP">GBP - Livre Sterling</option>
              <option value="XOF">XOF - Franc CFA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              onChange={handleLogoUpload}
              accept="image/*"
            />
            <label 
              htmlFor="logo-upload"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              {logo ? 'Changer le logo' : 'Uploader un logo'}
            </label>
            {logo && (
              <img src={logo} alt="Logo" className="w-16 h-16 ml-4 rounded-lg" />
            )}
          </div>
        </div>
      </DashboardCard>

      {/* Fonctionnalités */}
      <DashboardCard 
        title="Fonctionnalités" 
        icon={<Users className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Mode maintenance</p>
              <p className="text-sm text-gray-600">Désactive l&apos;accès public</p>
            </div>
            <button
              onClick={() => handleSettingChange('maintenance', !settings.maintenance)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.maintenance ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.maintenance ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Inscriptions ouvertes</p>
              <p className="text-sm text-gray-600">Permettre de nouveaux inscrits</p>
            </div>
            <button
              onClick={() => handleSettingChange('registrationOpen', !settings.registrationOpen)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.registrationOpen ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.registrationOpen ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Notifications */}
      <DashboardCard 
        title="Notifications" 
        icon={<Bell className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notifications email</p>
              <p className="text-sm text-gray-600">Envoyer des emails aux utilisateurs</p>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notifications SMS</p>
              <p className="text-sm text-gray-600">Envoyer des SMS importants</p>
            </div>
            <button
              onClick={() => handleSettingChange('smsNotifications', !settings.smsNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
              <p className="text-sm text-gray-600">Sécurité supplémentaire pour les admins</p>
            </div>
            <button
              onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Sécurité */}
      <DashboardCard 
        title="Sécurité" 
        icon={<Shield className="w-5 h-5" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longueur minimale du mot de passe
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={security.passwordMinLength}
              onChange={(e) => handleSecurityChange('passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée de session (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tentatives de connexion max
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={security.maxLoginAttempts}
              onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="uppercase"
              checked={security.passwordRequireUppercase}
              onChange={(e) => handleSecurityChange('passwordRequireUppercase', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700">
              Exiger une majuscule dans le mot de passe
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="numbers"
              checked={security.passwordRequireNumbers}
              onChange={(e) => handleSecurityChange('passwordRequireNumbers', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="numbers" className="ml-2 text-sm text-gray-700">
              Exiger un chiffre dans le mot de passe
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="special"
              checked={security.passwordRequireSpecialChars}
              onChange={(e) => handleSecurityChange('passwordRequireSpecialChars', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="special" className="ml-2 text-sm text-gray-700">
              Exiger un caractère spécial dans le mot de passe
            </label>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liste blanche IP (une par ligne)
          </label>
          <textarea
            value={security.ipWhitelist.join('\n')}
            onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value.split('\n'))}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="192.168.1.1&#10;10.0.0.1"
          />
        </div>
      </DashboardCard>

      {/* Zone dangereuse */}
      <DashboardCard 
        title="Zone dangereuse" 
        className="border-red-200 bg-red-50"
      >
        <div className="space-y-4">
          <div>
            <p className="font-medium text-red-800">Supprimer toutes les données</p>
            <p className="text-sm text-red-600">Cette action est irréversible</p>
            <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Supprimer toutes les données
            </button>
          </div>
          <div>
            <p className="font-medium text-red-800">Réinitialiser l&apos;application</p>
            <p className="text-sm text-red-600">Remet l&apos;application à l&apos;état initial</p>
            <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Réinitialiser l&apos;application
            </button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}