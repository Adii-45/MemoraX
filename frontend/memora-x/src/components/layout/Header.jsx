import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu } from 'lucide-react';
import UserDropdown from '../common/UserDropdown';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:block"></div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative inline-flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all duration-200 group">
            <Bell size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-neutral-950"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="pl-3 border-l border-neutral-800/60">
            <UserDropdown user={user} onLogout={logout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;