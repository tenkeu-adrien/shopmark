'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ChevronDown, Gift, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Liste des 10 codes pays africains + RDC en premier
const countryCodes = [
  { code: '+243', country: 'RD Congo', flag: '🇨🇩' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+225', country: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzanie', flag: '🇹🇿' },
  { code: '+256', country: 'Ouganda', flag: '🇺🇬' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+212', country: 'Maroc', flag: '🇲🇦' },
  { code: '+27', country: 'Afrique du Sud', flag: '🇿🇦' },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // true = Connexion, false = Inscription
  const [selectedCode, setSelectedCode] = useState(countryCodes[0].code);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user, login, signup } = useAuth();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // IMPORTANT: Empêcher le rechargement de la page
    
    setError('');
    setIsLoading(true);

    // Valider le numéro de téléphone
    const fullPhoneNumber = selectedCode + phone.replace(/\s/g, '');
    
    // Validation basique
    if (isLogin) {
      if (phone && password) {
        try {
          const result = await login(fullPhoneNumber, password);
          
          if (result.success) {
            console.log('Connexion réussie:', result.user);
            router.push('/'); // Redirection vers la page d'accueil
          } else {
            setError('Numéro de téléphone ou mot de passe incorrect');
          }
        } catch (error) {
          setError('Erreur lors de la connexion');
          console.error('Erreur de connexion:', error);
        }
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } else {
      if (phone && password && confirmPassword) {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          setIsLoading(false);
          return;
        }

        try {
          const result = await signup(fullPhoneNumber, password, invitationCode);
          
          if (result.success) {
            console.log('Inscription réussie:', result.user);
            router.push('/'); // Redirection vers la page d'accueil
          } else {
            setError(result.error || 'Erreur lors de l\'inscription');
            console.log('Erreur d\'inscription:', result);
          }
        } catch (error) {
          setError('Erreur lors de l\'inscription');
          console.error('Erreur d\'inscription:', error);
        }
      } else {
        setError('Veuillez remplir tous les champs obligatoires');
      }
    }
    
    setIsLoading(false);
  };

  const selectedCountry = countryCodes.find(c => c.code === selectedCode);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8">
        {/* En-tête avec branding */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-amber-500 mb-2 tracking-tight">
            SHOPMARK
          </h1>
          <p className="text-gray-300 text-lg">Votre marketplace premium</p>
        </div>

        {/* Onglets Connexion/Inscription */}
        <div className="flex border-b border-gray-800">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            disabled={isLoading}
            className={`flex-1 py-4 text-lg font-semibold transition-all relative ${
              isLogin 
                ? 'text-amber-500' 
                : 'text-gray-400 hover:text-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Connexion
            {/* Indicateur visuel */}
            {isLogin && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            disabled={isLoading}
            className={`flex-1 py-4 text-lg font-semibold transition-all relative ${
              !isLogin 
                ? 'text-amber-500' 
                : 'text-gray-400 hover:text-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            S'inscrire
            {/* Indicateur visuel */}
            {!isLogin && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Champ téléphone avec sélecteur de code pays */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Numéro de téléphone
            </label>
            <div className="flex rounded-xl overflow-hidden border border-gray-700 focus-within:border-amber-500 transition-all">
              {/* Sélecteur de code pays */}
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher la propagation
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="flex items-center justify-between w-full px-4 py-4 bg-gray-800 text-white hover:bg-gray-700 transition-colors min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">
                      {selectedCountry?.flag}
                    </span>
                    <span className="font-medium">{selectedCode}</span>
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown des codes pays */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-20 max-h-64 overflow-y-auto">
                    {countryCodes.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setSelectedCode(item.code);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-white border-b border-gray-700 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-xl">{item.flag}</span>
                        <span className="flex-1 text-sm">{item.country}</span>
                        <span className="text-gray-400">{item.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input numéro */}
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 block w-full px-4 py-4 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ex: 81 234 5678"
              />
            </div>
          </div>

          {/* Champ mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Votre mot de passe"
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-2">Minimum 6 caractères</p>
            )}
          </div>

          {/* Champ confirmation mot de passe (uniquement pour inscription) */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirmez votre mot de passe"
                />
                {confirmPassword && password === confirmPassword && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Champ code d'invitation (uniquement pour inscription) */}
          {!isLogin && (
            <div>
              <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-300 mb-2">
                Code d'invitation <span className="text-gray-500 text-sm">(optionnel)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Gift className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="invitationCode"
                  name="invitationCode"
                  type="text"
                  disabled={isLoading}
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Entrez un code d'invitation"
                />
              </div>
            </div>
          )}

          {/* Case à cocher "Mémoriser mes identifiants" */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              disabled={isLoading}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-300">
              Mémoriser mes identifiants
            </label>
          </div>

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'CONNEXION...' : 'INSCRIPTION...'}
                </>
              ) : (
                isLogin ? 'SE CONNECTER' : 'CRÉER MON COMPTE'
              )}
            </button>
          </div>

          {/* Lien mot de passe oublié (uniquement pour connexion) */}
          {isLogin && (
            <div className="text-center pt-2">
              <a 
                href="#" 
                className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © 2024 SHOPMARK - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}