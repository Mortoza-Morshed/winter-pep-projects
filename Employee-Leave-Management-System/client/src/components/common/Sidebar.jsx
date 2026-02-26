import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  CheckSquare,
  Users,
  FileBarChart,
  LayoutGrid,
  Receipt,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuItems = {
    Employee: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: CalendarPlus, label: "Apply Leave", path: "/apply-leave" },
      { icon: History, label: "Leave History", path: "/leave-history" },
    ],
    Manager: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/manager-dashboard" },
      { icon: CheckSquare, label: "Leave Approvals", path: "/approvals" },
      { icon: CalendarPlus, label: "Apply Leave", path: "/manager/apply-leave" },
      { icon: History, label: "My Leaves", path: "/manager/leave-history" },
    ],
    Admin: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "User Management", path: "/admin/users" },
      { icon: CheckSquare, label: "Leave Approvals", path: "/admin/leave-approvals" },
      { icon: FileBarChart, label: "Reports", path: "/reports" },
    ],
  };

  const expenseItems = {
    Employee: [
      { icon: Receipt, label: "Submit Claim", path: "/reimbursements/submit" },
      { icon: History, label: "My Claims", path: "/reimbursements/history" },
    ],
    Manager: [
      { icon: CheckSquare, label: "Review Claims", path: "/reimbursements/review" },
      { icon: Receipt, label: "Submit Claim", path: "/manager/reimbursements/submit" },
      { icon: History, label: "My Claims", path: "/manager/reimbursements/history" },
    ],
    Admin: [{ icon: Receipt, label: "Review Claims", path: "/reimbursements/review" }],
  };

  const currentMenu = menuItems[user?.role] || [];
  const currentExpense = expenseItems[user?.role] || [];

  const renderNavLink = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-slate-800 to-zinc-900 text-white shadow-lg shadow-zinc-300/40 translate-x-1"
            : "text-gray-500 hover:bg-zinc-100/60 hover:text-zinc-900"
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
  );

  const sidebarContent = (
    <aside className="w-64 glass border-r border-white/40 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-slate-800 to-zinc-900 p-2 rounded-xl text-white shadow-lg shadow-zinc-300">
            <LayoutGrid size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
            Luna
          </span>
        </div>
        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 mb-3">
          Main Menu
        </div>
        {currentMenu.map(renderNavLink)}

        {currentExpense.length > 0 && (
          <>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 pt-5 pb-2">
              Expenses
            </div>
            {currentExpense.map(renderNavLink)}
          </>
        )}
      </nav>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: pinned sidebar ── */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-20 m-4 rounded-2xl shadow-xl w-[236px]">
        {sidebarContent}
      </div>

      {/* ── Mobile: backdrop + slide-in drawer ── */}
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
