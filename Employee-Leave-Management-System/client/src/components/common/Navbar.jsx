import React, { useState } from "react";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Map entry point for breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname.substring(1);
    if (!path) return "Dashboard";
    return path
      .split("/")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace("-", " "))
      .join(" > ");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      toast("Global search feature coming soon!", {
        icon: "🔍",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setSearchQuery("");
    }
  };

  return (
    <header className="h-20 fixed inset-x-0 top-0 lg:left-64 z-10 px-4 lg:px-8 py-4 pointer-events-none">
      <div className="h-full glass rounded-2xl flex items-center justify-between px-4 sm:px-6 pointer-events-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm font-semibold truncate">
          <span className="text-gray-400 uppercase tracking-widest text-xs hidden sm:inline">
            Workspace
          </span>
          <ChevronRight size={14} className="mx-2 text-gray-300 hidden sm:inline" />
          <span className="text-gray-900 font-bold tracking-tight text-lg truncate">
            {getBreadcrumb()}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-gray-100/50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white w-64 transition-all font-medium shadow-inner"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 shadow-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all hover:border-blue-100"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 border border-white/40 py-4 px-4 z-50 animate-fade-in">
                <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-3 border-b border-gray-100 pb-3 flex justify-between items-center">
                  Notifications
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px]">
                    0 New
                  </span>
                </h4>
                <div className="text-sm text-gray-500 font-medium text-center py-6 flex flex-col items-center gap-2">
                  <div className="bg-green-50 text-green-500 p-2 rounded-full mb-1">
                    <Bell size={18} />
                  </div>
                  You're all caught up! ✨
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

          <div className="flex items-center gap-3">
            {user?.role === "Employee" && (
              <Link
                to="/apply-leave"
                className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-1.5"
              >
                Apply
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
