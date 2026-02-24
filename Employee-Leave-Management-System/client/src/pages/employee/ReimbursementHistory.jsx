import React, { useState, useEffect } from "react";
import {
  Receipt,
  Download,
  Search,
  PlusCircle,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../../services/api";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../../utils/exportToCSV";
import { useNotifications } from "../../context/NotificationsContext";

const categoryColors = {
  Travel: "bg-blue-50 text-blue-700 border-blue-100",
  Meals: "bg-orange-50 text-orange-700 border-orange-100",
  Equipment: "bg-slate-100 text-slate-700 border-slate-200",
  Medical: "bg-red-50 text-red-700 border-red-100",
  Other: "bg-gray-100 text-gray-600 border-gray-200",
};

const ReimbursementHistory = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalApprovedAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [claimsRes, statsRes] = await Promise.all([
          api.get("/reimbursements/my"),
          api.get("/reimbursements/stats"),
        ]);
        setClaims(claimsRes.data.claims || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = claims.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statCards = [
    {
      label: "Total Claims",
      value: stats.total,
      icon: Receipt,
      color: "text-zinc-600",
      bg: "bg-zinc-100",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Reimbursed",
      value: `$${(stats.totalApprovedAmount || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-slate-700",
      bg: "bg-slate-100",
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
            My Reimbursements
          </h1>
          <p className="text-gray-500 font-medium text-lg">Track your submitted expense claims.</p>
        </div>
        <Button
          onClick={() => navigate("/reimbursements/submit")}
          className="flex items-center gap-2 px-6 py-3 self-start"
        >
          <PlusCircle size={18} /> Submit New Claim
        </Button>
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

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:max-w-sm">
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
          <div className="flex gap-3 w-full sm:w-auto">
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filterStatus === s
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-zinc-300"
                }`}
              >
                {s}
              </button>
            ))}
            <Button
              variant="outline"
              className="px-4 py-2 border-gray-200 text-gray-600 bg-white flex items-center gap-2 text-sm"
              onClick={() => {
                exportToCSV(filtered, "my_reimbursements");
                addNotification({
                  title: "Exported",
                  message: `${filtered.length} reimbursement record(s) exported.`,
                  type: "info",
                });
              }}
            >
              <Download size={16} /> Export
            </Button>
          </div>
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr>
                {["Title", "Category", "Amount", "Date", "Status", "Submitted"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Receipt size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-bold text-sm">No claims found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                      {c.description && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
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
                    <td className="px-6 py-4 text-xs text-gray-400 font-bold">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
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

export default ReimbursementHistory;
