'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Lock, Gift, Check, AlertCircle, Eye, EyeOff, Mail, User, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

// Liste des codes pays pour afficher le drapeau correspondant (optionnel)
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
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+1', country: 'États-Unis/Canada', flag: '🇺🇸' },
  // Tu peux en ajouter d'autres si besoin
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [countryCode, setCountryCode] = useState('+243'); // Code pays saisissable manuellement
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState('');
 const [phone, setPhone] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, login, signup } = useAuth();

  // Trouver le drapeau correspondant au code pays saisi
  const selectedCountry = countryCodes.find(c => c.code === countryCode.trim());
  const displayFlag = selectedCountry ? selectedCountry.flag : '🌍';

  // Gestion du code d'invitation depuis URL
  useEffect(() => {
    const pathSegments = pathname.split('/');
    if (pathSegments[1] === 'invite' && pathSegments[2]) {
      const codeFromUrl = pathSegments[2];
      setIsLogin(false);
      setInvitationCode(codeFromUrl);
    }

    const codeFromParams = searchParams?.get('code');
    if (codeFromParams) {
      setIsLogin(false);
      setInvitationCode(codeFromParams);
    }
  }, [pathname, searchParams]);

  // Redirection si déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Nettoyage du code pays et du téléphone
    const cleanedCountryCode = countryCode.trim();
    const cleanedPhone = phone.replace(/\s/g, '');

    if (!cleanedCountryCode.startsWith('+')) {
      setError('Le code pays doit commencer par + (ex: +243)');
      setIsLoading(false);
      return;
    }

    const fullPhoneNumber = cleanedCountryCode + cleanedPhone;

    if (isLogin) {
      if (!cleanedPhone || !password) {
        setError('Veuillez remplir tous les champs');
        setIsLoading(false);
        return;
      }

      try {
        const result = await login(fullPhoneNumber, password);
        if (result.success) {
          router.push('/accueil');
        } else {
          setError('Numéro de téléphone ou mot de passe incorrect');
        }
      } catch (err) {
        setError('Erreur lors de la connexion');
      }
    } else {
      // Inscription
      if (!fullName.trim()) {
        setError('Veuillez entrer votre nom complet');
        setIsLoading(false);
        return;
      }
      if (!email.trim()) {
        setError('Veuillez entrer votre adresse email');
        setIsLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Veuillez entrer une adresse email valide');
        setIsLoading(false);
        return;
      }
      if (!cleanedPhone || !password || !confirmPassword) {
        setError('Veuillez remplir tous les champs obligatoires');
        setIsLoading(false);
        return;
      }
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
        let validatedInvitationCode = invitationCode.trim();
        if (!validatedInvitationCode) {
          const pathSegments = window.location.pathname.split('/');
          if (pathSegments[1] === 'invite' && pathSegments[2]) {
            validatedInvitationCode = pathSegments[2];
          }
        }

        const result = await signup(
          fullPhoneNumber,
          password,
          validatedInvitationCode,
          fullName.trim(),
          email.trim()
        );

        if (result.success) {
          setError('✅ Inscription réussie !');
          setTimeout(() => router.push('/'), 1500);
        } else {
          setError(result.error || 'Erreur lors de l\'inscription');
        }
      } catch (err) {
        setError('Erreur lors de l\'inscription');
        console.error(err);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <Image src="/criteo.jpeg" alt="Logo" width={80} height={80} className="mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Votre marketplace premium</p>

          {invitationCode && !isLogin && (
            <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-300 flex items-center justify-center gap-2">
                <Gift className="h-4 w-4" />
                <span>Code d'invitation: <strong>{invitationCode}</strong></span>
              </p>
              <p className="text-xs text-amber-500/80 mt-1">Vous rejoignez avec une invitation</p>
            </div>
          )}
        </div>

        <div className="flex border-b border-gray-800">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            disabled={isLoading}
            className={`flex-1 py-4 text-lg font-semibold transition-all relative ${
              isLogin ? 'text-amber-500' : 'text-gray-400 hover:text-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Connexion
            {isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            disabled={isLoading}
            className={`flex-1 py-4 text-lg font-semibold transition-all relative ${
              !isLogin ? 'text-amber-500' : 'text-gray-400 hover:text-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            S'inscrire
            {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>}
          </button>
        </div>

        {error && (
          <div className={`flex items-center gap-2 p-4 rounded-xl ${
            error.startsWith('✅') 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {error.startsWith('✅') ? (
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            )}
            <p className={`text-sm ${error.startsWith('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {error}
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Nom complet */}
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required={!isLogin}
                  disabled={isLoading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
            </div>
          )}

          {/* Numéro de téléphone avec code pays manuel */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Numéro de téléphone
            </label>
            <div className="flex gap-3">
              {/* Champ code pays manuel */}
              <div className="relative flex-shrink-0">
                {/* <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-500" />
                </div> */}
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={isLoading}
                  className="w-32 pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                  placeholder="+243"
                />
                <span className="absolute inset-y-0 left-14 flex items-center text-xl">
                  {displayFlag}
                </span>
              </div>

              {/* Champ numéro */}
              <input
                type="tel"
                required
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 block w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                placeholder="Ex: 81 234 5678"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Ex: +243 pour RD Congo, +33 pour France...</p>
          </div>

          {/* Email (inscription uniquement) */}
          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required={!isLogin}
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                  placeholder="exemple@domaine.com"
                />
              </div>
            </div>
          )}

          {/* Mot de passe */}
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
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!isLogin && <p className="text-xs text-gray-500 mt-2">Minimum 6 caractères</p>}
          </div>

          {/* Confirmation mot de passe */}
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
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code d'invitation */}
          {!isLogin && (
            <div>
              <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-300 mb-2">
                Code d'invitation
                <span className="text-amber-500 text-sm ml-1">
                  {invitationCode ? '(pré-rempli)' : ''}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Gift className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="invitationCode"
                  type="text"
                  disabled={isLoading || !!invitationCode}
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className={`block w-full pl-12 pr-4 py-4 bg-gray-800 border ${
                    invitationCode ? 'border-amber-500/50' : 'border-gray-700'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                  placeholder="Entrez un code d'invitation"
                  readOnly={!!invitationCode}
                />
                {invitationCode && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Check className="h-5 w-5 text-amber-500" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              disabled={isLoading}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-300">
              Mémoriser mes identifiants
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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

          {isLogin && (
            <div className="text-center pt-2">
              <Link href="#" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
          )}
        </form>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">© 2026 SHOPMARK - Tous droits réservés</p>
          <p className="text-xs text-gray-600 mt-2">Accès par invitation uniquement</p>
        </div>
      </div>
    </div>
  );
}