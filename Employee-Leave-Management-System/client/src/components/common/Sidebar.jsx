import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  CheckSquare,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  User as UserIcon,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = {
    Employee: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: CalendarPlus, label: "Apply Leave", path: "/apply-leave" },
      { icon: History, label: "Leave History", path: "/leave-history" },
    ],
    Manager: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: CheckSquare, label: "Leave Approvals", path: "/approvals" },
      { icon: History, label: "Team History", path: "/team-history" },
    ],
    Admin: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "User Management", path: "/admin/users" },
      { icon: CheckSquare, label: "All Requests", path: "/approvals" },
      { icon: FileBarChart, label: "Reports", path: "/reports" },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <aside className="w-64 glass border-r border-white/40 flex flex-col h-full fixed inset-y-0 left-0 z-20 m-4 rounded-2xl shadow-xl hidden lg:flex">
      {/* Logo */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <LayoutGrid size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
            LeaveFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 mb-4">
          Main Menu
        </div>
        {currentMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50 translate-x-1"
                  : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 mx-4 mb-4 bg-white/50 rounded-2xl border border-white/60 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
            {user?.name?.charAt(0) || <UserIcon size={20} />}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-black text-gray-900 truncate tracking-tight">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-blue-600 truncate uppercase tracking-widest mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-500 bg-white hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 border border-gray-100 hover:border-red-100 shadow-sm group/logout"
        >
          <LogOut
            size={16}
            strokeWidth={2.5}
            className="group-hover/logout:-translate-x-1 transition-transform"
          />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
