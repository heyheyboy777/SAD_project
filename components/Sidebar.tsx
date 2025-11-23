import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, Bell, BarChart3, DollarSign, Users, X, Calculator, History } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: '訂單管理', path: '/', icon: ClipboardList },
    { name: '進貨預測', path: '/prediction', icon: Calculator },
    { name: '歷史訂單分析', path: '/history', icon: History },
    { name: '管理通知寄送', path: '/notifications', icon: Bell },
    { name: '查看預期報告', path: '/forecast', icon: BarChart3 },
    { name: '價格調整', path: '/prices', icon: DollarSign },
    { name: '客戶管理', path: '/customers', icon: Users },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">功能選單</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;