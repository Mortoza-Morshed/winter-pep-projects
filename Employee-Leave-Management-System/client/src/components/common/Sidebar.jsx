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
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-full fixed inset-y-0 left-0 z-20">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <LayoutGrid size={22} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">LeaveFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {currentMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-100">
            {user?.name?.charAt(0) || <UserIcon size={20} />}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={18} />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
