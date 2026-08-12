import React from 'react';
import { LayoutDashboard, BarChart3, FileText, Settings } from 'lucide-react';

export default function Sidebar({ currentTab, setTab }) {
  const menuItems = [
    { id: 'reconciliation', label: 'Reconciliation', icon: <LayoutDashboard size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'narrative', label: 'AI Summary', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Swasthi™</h1>
        <p className="text-xs text-gray-500 mt-1">EOD Analytics Agent</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentTab === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}