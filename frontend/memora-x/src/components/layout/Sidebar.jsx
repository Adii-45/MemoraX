import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles logout by calling the logout function from the auth context and navigating to the login page.
   */
  /*******  633d171b-3626-49fa-8695-bb9271c5e784  *******/ const handleLogout =
    () => {
      logout();
      navigate("/login");
    };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed md:relative top-0 left-0 md:top-auto md:left-auto h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* {Logo and Close button for mobile} */}
        <div className="flex items-center h-16 px-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl
                    bg-gradient-to-br from-primary to-primary-dark
                    shadow-md shadow-primary/15"
            >
              <BrainCircuit
                className="text-white"
                size={20}
                strokeWidth={2.3}
              />
            </div>

            <h1 className="text-lg font-semibold tracking-tight">
              MEMORA-X
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/20"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="px-3 py-4 border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-200"
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
