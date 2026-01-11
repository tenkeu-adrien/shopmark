"use client";

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings,
  Bell,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Wallet // Ajout de l'icône Wallet
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
const {user} = useAuth()
const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        // Si pas d'utilisateur, rediriger vers login
        router.push('/auth/login');
        return;
      }

      try {
        // Ici, vous devrez récupérer le rôle depuis votre base de données
        // Par exemple, si vous stockez le rôle dans le document utilisateur
        // const userDoc = await getDoc(doc(db, 'users', user.uid));
        // const role = userDoc.data()?.role || 'user';
        
        // Pour l'exemple, je vais simuler la récupération
        // En pratique, remplacez ceci par votre logique de récupération
        const role = user.role || 'user'; // Supposons que user.role existe
        
        setUserRole(role);
        setIsAdmin(role === 'admin');
        
        if (role !== 'admin' && pathname.startsWith('/dashboard')) {
          // Si l'utilisateur n'est pas admin et tente d'accéder au dashboard
          router.push('/');
          return;
        }
        
      } catch (error) {
        console.error('Erreur vérification rôle:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user, pathname, router]);





  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
    },
    {
      name: 'Utilisateurs',
      href: '/dashboard/utilisateurs',
      icon: Users,
      current: pathname.startsWith('/dashboard/utilisateurs'),
    },
    {
      name: 'Transactions',
      href: '/dashboard/transactions',
      icon: CreditCard,
      current: pathname.startsWith('/dashboard/transactions'),
    },
    // Nouvelle section ajoutée
    {
      name: 'Portefeuilles',
      href: '/dashboard/portefeuilles',
      icon: Wallet, // Icône pour la section portefeuilles
      current: pathname.startsWith('/dashboard/portefeuilles'),
    },
  ];

  const secondaryNavigation = [
    { name: 'Notifications', icon: Bell, href: '#' },
    { name: 'Sécurité', icon: Shield, href: '#' },
    { 
      name: 'Déconnexion', 
      icon: LogOut, 
      onClick: () => router.push('/auth/login') 
    },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md border border-gray-200"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-full sm:w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg" />
              <span className="ml-3 text-xl font-bold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className={`transition-transform ${!sidebarOpen && 'rotate-180'}`} />
            </button>
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 px-2 sm:px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-3 text-sm font-medium rounded-lg
                  transition-colors duration-200 mx-1
                  ${item.current
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Status système */}
          <div className="p-3 mx-2 sm:mx-4 my-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Status API</span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-xs font-medium text-gray-700">En ligne</span>
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500 truncate">
              v1.2.3 • 24/7 Monitoring
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <main className={`
        lg:ml-64 transition-all duration-300
        ${mobileMenuOpen ? 'ml-0' : 'ml-0'}
        pt-16 lg:pt-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6
      `}>
        <div className="max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}