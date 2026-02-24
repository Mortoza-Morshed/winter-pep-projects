import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  CheckSquare,
  Users,
  FileBarChart,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

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

  const currentMenu = menuItems[user?.role] || [];

  return (
    <aside className="w-64 glass border-r border-white/40 flex flex-col h-full fixed inset-y-0 left-0 z-20 m-4 rounded-2xl shadow-xl hidden lg:flex">
      {/* Logo */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-2 rounded-xl text-white shadow-lg shadow-violet-200">
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
                  ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-200/50 translate-x-1"
                  : "text-gray-500 hover:bg-violet-50/60 hover:text-violet-900"
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
    </aside>
  );
};

export default Sidebar;
