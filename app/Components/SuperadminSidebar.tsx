"use client";
import { useRouter, usePathname } from 'next/navigation';
import { BarChart3, Building, Activity, PieChart } from 'lucide-react';

const items = [
  { name: 'Dashboard', path: '/Superadmin/Dashboard', icon: BarChart3 },
  { name: 'Stock Overview', path: '/Superadmin/Overview', icon: Activity },
  { name: 'Stores', path: '/Superadmin/Stores', icon: Building },
  { name: 'Analytics', path: '/Superadmin/Analytics', icon: PieChart },
];

export default function SuperadminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="h-16 px-6 flex items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Inventory Pro</h1>
      </div>
      <nav className="p-4 space-y-1">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button 
              key={item.path} 
              onClick={() => router.push(item.path)} 
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}


