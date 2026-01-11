
export default function WebTabFooter() {


  const tabs = [
    { 
      id: "home", 
      label: "Accueil", 
      icon: "/icons/home.png",
      href: "/" 
    },
    { 
      id: "rides", 
      label: "Tâches", 
      icon: "/icons/task.png",
      href: "/tasks" 
    },
    { 
      id: "chat", 
      label: "Team", 
      icon: "/icons/team.png",
      href: "/team" 
    },
    { 
      id: "profile", 
      label: "Moi", 
      icon: "/icons/user.png",
      href: "/profile" 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 rounded-tl-2xl rounded-tr-2xl">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.href}
            className="py-3 flex flex-col items-center hover:bg-amber-50 transition-colors duration-200"
          >
            {/* Icône */}
            <img
              src={tab.icon}
              alt={tab.label}
              className="w-6 h-6 mb-1 filter brightness-0 saturate-100 invert-50 sepia-100 saturate-1000 hue-rotate-0 brightness-105"
            />
            
            {/* Texte */}
            <span className="text-xs text-amber-600 font-medium">
              {tab.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}