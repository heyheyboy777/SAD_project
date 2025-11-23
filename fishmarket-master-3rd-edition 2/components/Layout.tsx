import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, UserCircle } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-slate-900 to-black">
      {/* Mobile-first Container Limit */}
      <div 
        className="w-full max-w-md min-h-screen shadow-2xl relative flex flex-col border-x border-white/5"
        style={{
            background: 'linear-gradient(180deg, #ecfeff 0%, #f1f5f9 30%, #f8fafc 100%)'
        }}
      >
        
        {/* Top Bar */}
        <header className="px-6 py-5 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-cyan-100/50 rounded-xl transition-colors"
            >
                <LayoutGrid className="w-8 h-8 text-cyan-900" />
            </button>
            
            {/* User Profile Icon / Placeholder */}
            <div className="p-2">
                 {/* Can add user avatar here if needed */}
                 <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs border border-cyan-200">
                    FM
                 </div>
            </div>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 overflow-y-auto no-scrollbar relative z-10">
            <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;