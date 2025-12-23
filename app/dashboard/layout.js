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
  X
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
      badge: 24,
    },
    {
      name: 'Ressources',
      href: '/dashboard/ressources',
      icon: Package,
      current: pathname.startsWith('/dashboard/ressources'),
      badge: 12,
    },
    {
      name: 'Transactions',
      href: '/dashboard/transactions',
      icon: CreditCard,
      current: pathname.startsWith('/dashboard/transactions'),
      badge: 42,
    },
    {
      name: 'Statistiques',
      href: '/dashboard/statistiques',
      icon: BarChart3,
      current: pathname.startsWith('/dashboard/statistiques'),
    },
    {
      name: 'Paramètres',
      href: '/dashboard/parametres',
      icon: Settings,
      current: pathname.startsWith('/dashboard/parametres'),
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

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button - CORRIGÉ : retirer le top */}
      <div className="lg:hidden fixed z-50 left-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto lg:h-screen lg:sticky lg:top-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
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
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${item.current
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-1 text-xs font-semibold rounded-full
                    ${item.current 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Navigation secondaire */}
          <div className="p-4 border-t border-gray-200 shrink-0">
            {secondaryNavigation.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 text-left"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}

            {/* Status système */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Status API</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-xs font-medium text-gray-700">En ligne</span>
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                v1.2.3 • 24/7 Monitoring
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu principal - CORRIGÉ : structure améliorée */}
      <main className={`
        flex-1 min-h-screen transition-all duration-300
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="h-full p-4 md:p-6">
          {/* Header pour mobile */}
          <div className="lg:hidden mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          {/* Contenu des pages */}
          <div className="h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay pour mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}