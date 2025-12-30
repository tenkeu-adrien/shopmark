// app/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Importe ton hook useAuth depuis le context

export default function HomePage() {
  const { user, loading } = useAuth(); // Suppose que ton AuthContext expose { user, loading }
  const router = useRouter();

  useEffect(() => {
    // Attends que le chargement soit fini pour éviter des redirections inutiles
    if (!loading) {
      if (user) {
        // Utilisateur connecté → redirige vers l'accueil
        router.replace('/accueil'); // ou '/dashboard' selon ton choix
      } else {
        // Pas connecté → redirige vers login
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Pendant le chargement ou en attente, affiche un spinner ou rien
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  // Le contenu ne s'affiche jamais vraiment car on redirige toujours
  return null;
}