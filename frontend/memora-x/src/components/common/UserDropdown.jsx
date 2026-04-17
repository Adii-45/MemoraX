import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-neutral-900 transition-colors duration-200 cursor-pointer group"
        aria-haspopup="true"
        aria-expanded={open}
        id="user-dropdown-trigger"
      >
        {/* Avatar */}
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name || user.username}
            className="w-9 h-9 rounded-xl object-cover border border-neutral-700 group-hover:border-neutral-600 transition-colors"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#1E3EDC] flex items-center justify-center text-white text-sm font-bold transition-all duration-200">
            {getInitials(user?.name || user?.username)}
          </div>
        )}

        {/* Name */}
        <span className="hidden sm:block text-sm font-semibold text-white max-w-[120px] truncate">
          {user?.name || user?.username || "User"}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`hidden sm:block text-neutral-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-2 w-52 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50 transition-all duration-200 ease-out origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
        role="menu"
        id="user-dropdown-menu"
      >
        {/* User info header */}
        <div className="px-4 py-3 border-b border-neutral-800/60">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name || user?.username || "User"}
          </p>
          <p className="text-xs text-neutral-500 truncate mt-0.5">
            {user?.email || ""}
          </p>
        </div>

        {/* Menu items */}
        <div className="py-1.5">
          <button
            onClick={() => handleNavigate("/profile")}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors duration-150"
            role="menuitem"
            id="dropdown-profile-settings"
          >
            <Settings size={16} className="opacity-80" />
            Profile Settings
          </button>

          <div className="mx-3 my-1 border-t border-neutral-800/50" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
            role="menuitem"
            id="dropdown-logout"
          >
            <LogOut size={16} className="opacity-80" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
