import React from 'react';
import { LayoutDashboard, Package, ChefHat, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'inventory', label: 'Estoque (Custos)', icon: Package },
    { id: 'recipes', label: 'Precificação e Receitas', icon: ChefHat },
    { id: 'advisor', label: 'Consultor IA', icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-stone-900 text-stone-50 h-screen flex flex-col fixed left-0 top-0 shadow-xl z-20 hidden md:flex">
      <div className="p-6 border-b border-stone-800">
        <h1 className="text-2xl font-bold text-amber-500 tracking-tight">ChocoNati</h1>
        <p className="text-xs text-stone-400 mt-1">Sistema de Gestão</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md transform scale-105'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-stone-800">
        <div className="text-xs text-stone-500 text-center">
          &copy; 2024 ChocoNati
        </div>
      </div>
    </div>
  );
};

export const MobileNav: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard },
        { id: 'inventory', icon: Package },
        { id: 'recipes', icon: ChefHat },
        { id: 'advisor', icon: Sparkles },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 z-50 flex justify-around p-3 pb-6">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-3 rounded-full transition-colors ${
                            isActive ? 'bg-amber-600 text-white' : 'text-stone-400'
                        }`}
                    >
                        <Icon size={24} />
                    </button>
                )
            })}
        </div>
    )
}