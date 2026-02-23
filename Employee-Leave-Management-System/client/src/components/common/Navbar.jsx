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
    <header className="h-16 bg-white border-b border-gray-200 fixed inset-x-0 top-0 left-60 z-10">
      <div className="h-full px-8 flex items-center justify-between relative">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm font-medium">
          <span className="text-gray-400">Portal</span>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <span className="text-gray-900 font-bold">{getBreadcrumb()}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 px-4 z-50">
                <h4 className="text-sm font-black text-gray-900 mb-3 border-b border-gray-50 pb-2">
                  Notifications
                </h4>
                <div className="text-sm text-gray-500 font-medium text-center py-4">
                  No new notifications.
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-gray-200"></div>

          <div className="hidden sm:flex items-center gap-3">
            {user?.role === "Employee" && (
              <Link
                to="/apply-leave"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                + Apply Leave
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
