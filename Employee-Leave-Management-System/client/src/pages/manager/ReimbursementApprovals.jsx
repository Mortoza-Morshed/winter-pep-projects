import React, { useState, useEffect } from "react";
import {
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Search,
  Download,
  Users,
} from "lucide-react";
import api from "../../services/api";
import Badge from "../../components/common/Badge";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportToCSV";
import { useNotifications } from "../../context/NotificationsContext";

const categoryColors = {
  Travel: "bg-blue-50 text-blue-700 border-blue-100",
  Meals: "bg-orange-50 text-orange-700 border-orange-100",
  Equipment: "bg-slate-100 text-slate-700 border-slate-200",
  Medical: "bg-red-50 text-red-700 border-red-100",
  Other: "bg-gray-100 text-gray-600 border-gray-200",
};

const TABS = ["Pending", "Approved", "Rejected", "All"];

const ReimbursementApprovals = () => {
  const { addNotification } = useNotifications();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchClaims = async () => {
    try {
      const res = await api.get("/reimbursements/all");
      setClaims(res.data.claims || []);
    } catch (err) {
      toast.error("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleAction = async (id, action, claim) => {
    setActionLoading(id + action);
    try {
      await api.put(`/reimbursements/${id}/${action}`);
      const label = action === "approve" ? "Approved" : "Rejected";
      toast.success(`Claim ${label.toLowerCase()} successfully!`);
      addNotification({
        title: `Claim ${label}`,
        message: `${claim.employee?.name}'s $${parseFloat(claim.amount).toFixed(2)} ${claim.category} claim has been ${label.toLowerCase()}.`,
        type: action === "approve" ? "approve" : "reject",
      });
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = claims.filter((c) => {
    const matchTab = activeTab === "All" || c.status === activeTab;
    const matchSearch =
      c.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPending = claims.filter((c) => c.status === "Pending").length;
  const totalApproved = claims.filter((c) => c.status === "Approved").length;
  const totalAmount = claims
    .filter((c) => c.status === "Approved")
    .reduce((s, c) => s + c.amount, 0);

  const statCards = [
    {
      label: "Pending Review",
      value: totalPending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Approved Claims",
      value: totalApproved,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Reimbursed",
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
    {
      label: "Total Submissions",
      value: claims.length,
      icon: Users,
      color: "text-zinc-600",
      bg: "bg-zinc-100",
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
          Reimbursement Claims
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Review and action employee expense reimbursements.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`${s.bg} p-2.5 rounded-xl w-fit mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-sm font-bold text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2 bg-zinc-100/70 p-1 rounded-xl w-full sm:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-white text-zinc-800 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
                {tab === "Pending" && totalPending > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {totalPending}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search claims…"
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-zinc-400 outline-none"
              />
            </div>
            <button
              onClick={() => {
                exportToCSV(filtered, "reimbursement_claims");
                addNotification({
                  title: "Exported",
                  message: `${filtered.length} reimbursement record(s) exported.`,
                  type: "info",
                });
              }}
              className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr>
                {["Employee", "Expense", "Category", "Amount", "Date", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest ${h === "Actions" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Receipt size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-bold text-sm">
                      No {activeTab !== "All" ? activeTab.toLowerCase() : ""} claims found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 font-black text-sm border border-zinc-200 shadow-sm group-hover:scale-105 transition-transform">
                          {c.employee?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{c.employee?.name}</p>
                          <p className="text-xs text-gray-400">{c.employee?.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                      {c.description && (
                        <p className="text-xs text-gray-400 max-w-[180px] truncate">
                          {c.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full border ${categoryColors[c.category] || categoryColors.Other}`}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      ${parseFloat(c.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(c.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === "Pending" ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleAction(c._id, "approve", c)}
                            disabled={actionLoading === c._id + "approve"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={13} />
                            {actionLoading === c._id + "approve" ? "…" : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(c._id, "reject", c)}
                            disabled={actionLoading === c._id + "reject"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-black border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={13} />
                            {actionLoading === c._id + "reject" ? "…" : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold">
                            {c.reviewedBy?.name ? `by ${c.reviewedBy.name}` : "—"}
                          </p>
                          {c.reviewedAt && (
                            <p className="text-[10px] text-gray-300 mt-0.5">
                              {new Date(c.reviewedAt).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReimbursementApprovals;
