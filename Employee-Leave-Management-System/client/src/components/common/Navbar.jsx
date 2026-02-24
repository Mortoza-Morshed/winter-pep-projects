import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronRight,
  LogOut,
  User,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";

const typeConfig = {
  approve: {
    icon: <CheckCircle size={15} className="text-green-500 flex-shrink-0" />,
    dot: "bg-green-400",
  },
  reject: { icon: <XCircle size={15} className="text-red-500 flex-shrink-0" />, dot: "bg-red-400" },
  info: { icon: <Info size={15} className="text-blue-500 flex-shrink-0" />, dot: "bg-blue-400" },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const bellRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname.substring(1);
    if (!path) return "Dashboard";
    return path
      .split("/")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "))
      .join(" › ");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-24 fixed top-0 left-0 right-0 lg:left-[252px] z-10 px-4 lg:px-5 py-3 pointer-events-none">
      <div className="h-full glass rounded-2xl flex items-center justify-between px-5 sm:px-7 pointer-events-auto">
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md hidden sm:inline ${
                user?.role === "Admin"
                  ? "bg-zinc-100 text-zinc-500"
                  : user?.role === "Manager"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {user?.role === "Admin"
                ? "Admin Console"
                : user?.role === "Manager"
                  ? "Manager Hub"
                  : "My Portal"}
            </span>
          </div>
          <span className="text-gray-900 font-bold tracking-tight text-xl truncate leading-tight">
            {getBreadcrumb()}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          {user?.role === "Employee" && (
            <Link
              to="/apply-leave"
              className="hidden sm:flex bg-gradient-to-r from-slate-800 to-zinc-900 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-zinc-300/40 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 items-center gap-1.5"
            >
              + Apply Leave
            </Link>
          )}

          <div className="h-7 w-px bg-gray-200" />

          {/* Notification Bell */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => {
                setShowNotifications((v) => !v);
                setShowProfile(false);
                if (!showNotifications) markAllRead();
              }}
              className="relative p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500 hover:text-zinc-800 hover:bg-zinc-50 hover:border-zinc-200 transition-all"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center px-0.5 shadow-sm animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 z-50 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                  <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Bell size={14} className="text-blue-500" />
                    Notifications
                    {notifications.length > 0 && (
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                        {notifications.length}
                      </span>
                    )}
                  </h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-[340px] overflow-y-auto no-scrollbar divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-12">
                      <div className="bg-green-50 text-green-500 p-3.5 rounded-full">
                        <Bell size={22} />
                      </div>
                      <p className="text-sm text-gray-400 font-bold">All caught up! ✨</p>
                      <p className="text-xs text-gray-300 font-medium">No new notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const cfg = typeConfig[n.type] ?? typeConfig.info;
                      return (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/70 transition-colors"
                        >
                          {/* Unread dot indicator */}
                          <div className="mt-1 flex-shrink-0 relative">
                            {cfg.icon}
                            {!n.read && (
                              <span
                                className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${cfg.dot} border border-white`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 leading-snug">
                              {n.title}
                            </p>
                            <p className="text-[12px] text-gray-500 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">
                              {timeAgo(n.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile((v) => !v);
                setShowNotifications(false);
              }}
              className={`p-1.5 rounded-xl border transition-all duration-200 ${
                showProfile
                  ? "bg-white border-blue-200 shadow-md shadow-blue-100/50"
                  : "border-transparent bg-gray-100/60 hover:bg-white hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center text-white font-black text-[13px] shadow-sm select-none">
                  {initials ?? <User size={14} />}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 z-50 overflow-hidden animate-fade-in">
                {/* Header with gradient */}
                <div className="px-5 py-4 bg-gradient-to-br from-slate-800 to-zinc-900 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)",
                    }}
                  />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-black text-base border border-white/20 shadow-inner select-none">
                      {initials ?? <User size={16} />}
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-white truncate max-w-[140px] leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest leading-tight mt-0.5">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  {/* Online indicator */}
                  <div className="mt-3 relative z-10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm" />
                    <span className="text-[10px] text-blue-100 font-bold">Active now</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover/item:bg-red-100 flex items-center justify-center transition-colors">
                      <LogOut
                        size={15}
                        strokeWidth={2.5}
                        className="group-hover/item:-translate-x-0.5 transition-transform"
                      />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
