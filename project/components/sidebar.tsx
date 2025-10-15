'use client';

import { Home, BarChart3, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'forecast', label: 'New Forecast', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Supply Chain AI</h1>
        <p className="text-xs text-slate-400 mt-1">Material Demand Forecasting</p>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all',
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">POWERGRID Projects</p>
        <p className="text-xs text-slate-500 mt-1">Model v1.0</p>
      </div>
    </div>
  );
}
