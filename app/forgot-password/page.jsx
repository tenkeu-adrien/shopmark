'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock, Lock, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Nouveau mot de passe
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Effet pour le compte à rebours
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          action:'request'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code');
      }

      setSuccess('✅ Code de réinitialisation envoyé à votre email');
      setStep(2);
      setCountdown(180); // 5 minutes
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode || resetCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: resetCode,
          action: 'verify' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Code invalide ou expiré');
      }

      setSuccess('✅ Code validé ! Vous pouvez maintenant définir un nouveau mot de passe');
      setStep(3);
      setCountdown(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: resetCode,
          newPassword,
          action: 'reset' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation');
      }

      setSuccess('✅ Mot de passe réinitialisé avec succès ! Redirection...');
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      setError(`Veuillez attendre ${countdown} secondes avant de renvoyer un code`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          action: 'resend' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code');
      }

      setSuccess('✅ Nouveau code envoyé à votre email');
      setCountdown(180);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <Image 
            src="/criteo.jpeg" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 1 && 'Réinitialisation du mot de passe'}
            {step === 2 && 'Vérification du code'}
            {step === 3 && 'Nouveau mot de passe'}
          </h2>
          <p className="text-gray-400">
            {step === 1 && 'Entrez votre email pour recevoir un code de vérification'}
            {step === 2 && 'Entrez le code à 6 chiffres reçu par email'}
            {step === 3 && 'Définissez votre nouveau mot de passe'}
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step >= num 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-gray-800 text-gray-400'
                }
              `}>
                {num}
              </div>
              {num < 3 && (
                <div className={`
                  w-12 h-1 mx-2
                  ${step > num ? 'bg-amber-500' : 'bg-gray-800'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Messages d'erreur/succès */}
        {(error || success) && (
          <div className={`
            flex items-start gap-3 p-4 rounded-xl border
            ${error 
              ? 'bg-red-500/10 border-red-500/20' 
              : 'bg-green-500/10 border-green-500/20'
            }
          `}>
            {error ? (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${error ? 'text-red-500' : 'text-green-500'}`}>
              {error || success}
            </p>
          </div>
        )}

        {/* Étape 1 : Email */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                  placeholder="exemple@domaine.com"
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleSendCode}
              disabled={isLoading || !email}
              className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  VÉRIFICATION...
                </>
              ) : (
                'ENVOYER LE CODE DE VÉRIFICATION'
              )}
            </button>
          </div>
        )}

        {/* Étape 2 : Code de vérification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-300">Code envoyé à</span>
                </div>
                <span className="text-sm font-medium text-amber-500">{email}</span>
              </div>
              <p className="text-xs text-gray-500">
                Le code est valable pendant 3 minutes. Vérifiez votre boîte de réception et vos spams.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code à 6 chiffres
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setResetCode(value);
                  }}
                  disabled={isLoading}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>
            </div>

            {/* Compte à rebours */}
            {countdown > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-gray-400">Code valable pendant :</span>
                <span className="font-mono font-bold text-amber-500">
                  {formatCountdown(countdown)}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleResendCode}
                disabled={isLoading || countdown > 0}
                className="flex-1 py-4 px-4 bg-gray-800 text-gray-300 font-semibold text-sm rounded-full hover:bg-gray-700 border border-gray-700 transition-all disabled:opacity-50"
              >
                RENVOYER LE CODE
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || resetCode.length !== 6}
                className="flex-1 py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? 'VÉRIFICATION...' : 'VÉRIFIER LE CODE'}
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : Nouveau mot de passe */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-300">Identité vérifiée</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="Minimum 6 caractères"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? 'CACHER' : 'AFFICHER'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="Retapez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? 'CACHER' : 'AFFICHER'}
                </button>
                {confirmPassword && newPassword === confirmPassword && (
                  <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'RÉINITIALISATION...' : 'RÉINITIALISER LE MOT DE PASSE'}
            </button>
          </div>
        )}

        <div className="text-center pt-6">
          <Link 
            href="/auth/login" 
            className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
          >
            Retour à la page de connexion
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">© 2026 SHOPMARK - Sécurité renforcée</p>
          <p className="text-xs text-gray-600 mt-2">Les codes de réinitialisation sont à usage unique</p>
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock, Lock, Shield } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Nouveau mot de passe
//   const [email, setEmail] = useState('');
//   const [resetCode, setResetCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [countdown, setCountdown] = useState(0);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
//   // Effet pour le compte à rebours
//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const handleSendCode = async () => {
//     if (!validateEmail(email)) {
//       setError('Veuillez entrer une adresse email valide');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch('/api/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email, 
//           action:'request'
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Erreur lors de l\'envoi du code');
//       }

//       setSuccess('✅ Code de réinitialisation envoyé à votre email');
//       setStep(2);
//       setCountdown(300); // 5 minutes
      
//       // Effacer le message de succès après 5 secondes
//       setTimeout(() => setSuccess(''), 5000);
//     } catch (err) {
//       setError(err.message || 'Erreur lors de l\'envoi du code');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyCode = async () => {
//     if (!resetCode || resetCode.length !== 6) {
//       setError('Le code doit contenir 6 chiffres');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email, 
//           code: resetCode,
//           action: 'verify' 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Code invalide ou expiré');
//       }

//       setSuccess('✅ Code validé ! Vous pouvez maintenant définir un nouveau mot de passe');
//       setStep(3);
//       setCountdown(0);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!newPassword || !confirmPassword) {
//       setError('Veuillez remplir tous les champs');
//       return;
//     }

//     if (newPassword.length < 6) {
//       setError('Le mot de passe doit contenir au moins 6 caractères');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('Les mots de passe ne correspondent pas');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email, 
//           code: resetCode,
//           newPassword,
//           action: 'reset' 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Erreur lors de la réinitialisation');
//       }

//       setSuccess('✅ Mot de passe réinitialisé avec succès ! Redirection...');
      
//       // Redirection après 2 secondes
//       setTimeout(() => {
//         router.push('/auth');
//       }, 2000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     if (countdown > 0) {
//       setError(`Veuillez attendre ${countdown} secondes avant de renvoyer un code`);
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/auth/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email, 
//           action: 'resend' 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Erreur lors de l\'envoi du code');
//       }

//       setSuccess('✅ Nouveau code envoyé à votre email');
//       setCountdown(300);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatCountdown = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <button
//             onClick={() => router.back()}
//             className="absolute top-8 left-8 p-2 text-gray-400 hover:text-white transition-colors"
//           >
//             <ArrowLeft className="h-6 w-6" />
//           </button>

//           <Image 
//             src="/criteo.jpeg" 
//             alt="Logo" 
//             width={80} 
//             height={80} 
//             className="mx-auto mb-4" 
//           />
//           <h2 className="text-2xl font-bold text-white mb-2">
//             {step === 1 && 'Réinitialisation du mot de passe'}
//             {step === 2 && 'Vérification du code'}
//             {step === 3 && 'Nouveau mot de passe'}
//           </h2>
//           <p className="text-gray-400">
//             {step === 1 && 'Entrez votre email pour recevoir un code de vérification'}
//             {step === 2 && 'Entrez le code à 6 chiffres reçu par email'}
//             {step === 3 && 'Définissez votre nouveau mot de passe'}
//           </p>
//         </div>

//         {/* Indicateur de progression */}
//         <div className="flex items-center justify-center gap-2 mb-8">
//           {[1, 2, 3].map((num) => (
//             <div key={num} className="flex items-center">
//               <div className={`
//                 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
//                 ${step >= num 
//                   ? 'bg-amber-500 text-black' 
//                   : 'bg-gray-800 text-gray-400'
//                 }
//               `}>
//                 {num}
//               </div>
//               {num < 3 && (
//                 <div className={`
//                   w-12 h-1 mx-2
//                   ${step > num ? 'bg-amber-500' : 'bg-gray-800'}
//                 `} />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Messages d'erreur/succès */}
//         {(error || success) && (
//           <div className={`
//             flex items-start gap-3 p-4 rounded-xl border
//             ${error 
//               ? 'bg-red-500/10 border-red-500/20' 
//               : 'bg-green-500/10 border-green-500/20'
//             }
//           `}>
//             {error ? (
//               <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//             ) : (
//               <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//             )}
//             <p className={`text-sm ${error ? 'text-red-500' : 'text-green-500'}`}>
//               {error || success}
//             </p>
//           </div>
//         )}

//         {/* Étape 1 : Email */}
//         {step === 1 && (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Adresse email
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={isLoading}
//                   className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
//                   placeholder="exemple@domaine.com"
//                   autoFocus
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleSendCode}
//               disabled={isLoading || !email}
//               className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                   VÉRIFICATION...
//                 </>
//               ) : (
//                 'ENVOYER LE CODE DE VÉRIFICATION'
//               )}
//             </button>
//           </div>
//         )}

//         {/* Étape 2 : Code de vérification */}
//         {step === 2 && (
//           <div className="space-y-6">
//             <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-amber-500" />
//                   <span className="text-sm text-gray-300">Code envoyé à</span>
//                 </div>
//                 <span className="text-sm font-medium text-amber-500">{email}</span>
//               </div>
//               <p className="text-xs text-gray-500">
//                 Le code est valable pendant 5 minutes. Vérifiez votre boîte de réception et vos spams.
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Code à 6 chiffres
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Shield className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   value={resetCode}
//                   onChange={(e) => {
//                     const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                     setResetCode(value);
//                   }}
//                   disabled={isLoading}
//                   className="block w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 text-center text-2xl tracking-widest font-mono"
//                   placeholder="000000"
//                   maxLength={6}
//                   autoFocus
//                 />
//               </div>
//             </div>

//             {/* Compte à rebours */}
//             {countdown > 0 && (
//               <div className="flex items-center justify-center gap-2 text-sm">
//                 <Clock className="h-4 w-4 text-amber-500" />
//                 <span className="text-gray-400">Code valable pendant :</span>
//                 <span className="font-mono font-bold text-amber-500">
//                   {formatCountdown(countdown)}
//                 </span>
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 onClick={handleResendCode}
//                 disabled={isLoading || countdown > 0}
//                 className="flex-1 py-4 px-4 bg-gray-800 text-gray-300 font-semibold text-sm rounded-full hover:bg-gray-700 border border-gray-700 transition-all disabled:opacity-50"
//               >
//                 RENVOYER LE CODE
//               </button>
//               <button
//                 onClick={handleVerifyCode}
//                 disabled={isLoading || resetCode.length !== 6}
//                 className="flex-1 py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100"
//               >
//                 {isLoading ? 'VÉRIFICATION...' : 'VÉRIFIER LE CODE'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Étape 3 : Nouveau mot de passe */}
//         {step === 3 && (
//           <div className="space-y-6">
//             <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <div>
//                   <p className="text-sm text-gray-300">Identité vérifiée</p>
//                   <p className="text-xs text-gray-500">{email}</p>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Nouveau mot de passe
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   disabled={isLoading}
//                   className="block w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
//                   placeholder="Minimum 6 caractères"
//                   autoFocus
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
//                 >
//                   {showPassword ? 'CACHER' : 'AFFICHER'}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Confirmer le mot de passe
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   disabled={isLoading}
//                   className="block w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
//                   placeholder="Retapez votre mot de passe"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
//                 >
//                   {showConfirmPassword ? 'CACHER' : 'AFFICHER'}
//                 </button>
//                 {confirmPassword && newPassword === confirmPassword && (
//                   <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={handleResetPassword}
//               disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
//               className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm rounded-full hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100"
//             >
//               {isLoading ? 'RÉINITIALISATION...' : 'RÉINITIALISER LE MOT DE PASSE'}
//             </button>
//           </div>
//         )}

//         <div className="text-center pt-6">
//           <Link 
//             href="/auth/login" 
//             className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
//           >
//             Retour à la page de connexion
//           </Link>
//         </div>

//         <div className="pt-8 border-t border-gray-800 text-center">
//           <p className="text-sm text-gray-500">© 2026 SHOPMARK - Sécurité renforcée</p>
//           <p className="text-xs text-gray-600 mt-2">Les codes de réinitialisation sont à usage unique</p>
//         </div>
//       </div>
//     </div>
//   );
// }