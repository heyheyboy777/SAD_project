import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, UserCircle } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine title based on route roughly, though pages handle their own mostly
  // This is just for the top bar
  
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      {/* Mobile-first Container Limit */}
      <div className="w-full max-w-md bg-[#EAEAEA] min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Top Bar */}
        <header className="px-6 py-5 flex justify-between items-center">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-300/50 rounded-xl transition-colors"
            >
                <LayoutGrid className="w-8 h-8 text-gray-800" />
            </button>
            
            {/* User Profile Icon / Placeholder */}
            <div className="p-2">
                 {/* Can add user avatar here if needed */}
            </div>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 overflow-y-auto no-scrollbar">
            <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;