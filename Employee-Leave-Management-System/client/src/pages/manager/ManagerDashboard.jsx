import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Receipt,
  Clock,
  CheckCircle,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesRes, claimsRes] = await Promise.all([
          api.get("/leaves/all"),
          api.get("/reimbursements/all"),
        ]);
        setLeaves(leavesRes.data.leaves || []);
        setClaims(claimsRes.data.claims || []);
      } catch (err) {
        console.error("Manager dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const approvedLeaves = leaves.filter((l) => l.status === "Approved");
  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const totalClaimAmount = claims
    .filter((c) => c.status === "Approved")
    .reduce((s, c) => s + c.amount, 0);

  const recentLeaves = [...leaves].slice(0, 5);
  const recentClaims = [...claims].slice(0, 5);

  const statCards = [
    {
      label: "Pending Leave Requests",
      value: pendingLeaves.length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: "/approvals",
      linkLabel: "Review",
    },
    {
      label: "Approved Leaves",
      value: approvedLeaves.length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/approvals",
      linkLabel: "View All",
    },
    {
      label: "Pending Expense Claims",
      value: pendingClaims.length,
      icon: Receipt,
      color: "text-zinc-600",
      bg: "bg-zinc-100",
      link: "/reimbursements/review",
      linkLabel: "Review",
    },
    {
      label: "Total Reimbursed",
      value: `$${totalClaimAmount.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-slate-700",
      bg: "bg-slate-100",
      link: "/reimbursements/review",
      linkLabel: "View All",
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 font-medium text-lg">Here's what needs your attention today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className={`${s.bg} p-2.5 rounded-xl w-fit mb-3`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm font-bold text-gray-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
            <Link
              to={s.link}
              className="mt-4 text-xs font-black text-zinc-500 hover:text-zinc-800 flex items-center gap-1 transition-colors"
            >
              {s.linkLabel} <ArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>

      {/* Two-column split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-zinc-500" />
              <h2 className="text-base font-black text-gray-900">Recent Leave Requests</h2>
            </div>
            <Link
              to="/approvals"
              className="text-xs font-black text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentLeaves.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 font-bold text-sm">
              No leave requests yet
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLeaves.map((l) => (
                <div
                  key={l._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 font-black text-sm">
                      {l.employee?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{l.employee?.name}</p>
                      <p className="text-xs text-gray-400 font-medium">
                        {l.leaveType} · {l.numberOfDays}d
                      </p>
                    </div>
                  </div>
                  <Badge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Expense Claims */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-zinc-500" />
              <h2 className="text-base font-black text-gray-900">Recent Expense Claims</h2>
            </div>
            <Link
              to="/reimbursements/review"
              className="text-xs font-black text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentClaims.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 font-bold text-sm">
              No claims submitted yet
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentClaims.map((c) => (
                <div
                  key={c._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 font-black text-sm">
                      {c.employee?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{c.employee?.name}</p>
                      <p className="text-xs text-gray-400 font-medium">
                        {c.category} · ${parseFloat(c.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Badge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
