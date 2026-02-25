import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Check,
  X,
  MessageSquare,
  Calendar,
  SearchX,
} from "lucide-react";
import api from "../../services/api";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { useNotifications } from "../../context/NotificationsContext";

const LeaveApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/leaves/all");
        if (response.data.success) {
          setRequests(response.data.leaves);
        }
      } catch (error) {
        console.error("Failed to fetch requests", error);
        toast.error("Could not load leave requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    const target = requests.find((r) => r._id === id);
    try {
      const response = await api.put(`/leaves/${id}/${action}`);
      if (response.data.success) {
        const status = action === "approve" ? "Approved" : "Rejected";
        toast.success(`Request ${action}d successfully`);
        setRequests(requests.map((req) => (req._id === id ? { ...req, status } : req)));
        addNotification({
          title: `Leave ${status}`,
          message: `${target?.employee?.name ?? "Employee"}'s ${target?.leaveType ?? "leave"} request has been ${status.toLowerCase()}.`,
          type: action === "approve" ? "approve" : "reject",
        });
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "All History") return true;
    return req.status === activeTab;
  });

  const stats = {
    pending: requests.filter((r) => r.status === "Pending").length,
    onLeave: requests.filter((r) => r.status === "Approved").length, // Simulating for display
  };

  if (loading) {
    return (
      <div className="flex bg-white rounded-2xl p-12 items-center justify-center animate-pulse font-black text-gray-400">
        Loading Approvals...
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Leave Approvals</h1>
          <p className="text-gray-500 font-medium text-lg">
            Review and manage pending employee leave requests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-orange-100 font-bold uppercase tracking-widest text-xs">
              Action Required
            </span>
            <MessageSquare className="text-orange-200" size={24} />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <h2 className="text-5xl font-black">{stats.pending}</h2>
            <span className="text-orange-200 font-bold">Requests</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-zinc-800 rounded-3xl p-6 text-white shadow-xl shadow-zinc-300/40 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-zinc-300 font-bold uppercase tracking-widest text-xs">
              Employees Away
            </span>
            <Calendar className="text-zinc-400" size={24} />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <h2 className="text-5xl font-black">{stats.onLeave}</h2>
            <span className="text-zinc-400 font-bold">Today</span>
          </div>
        </div>
      </div>

      {/* Tabs & Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">
        {/* Modern Tabs */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-max">
            {["Pending", "Approved", "Rejected", "All History"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-white text-zinc-700 shadow-sm ring-1 ring-gray-200 shadow-blue-100/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                {tab}
                {tab === "Pending" && stats.pending > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs ${activeTab === tab ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-600"}`}
                  >
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table Data Grid */}
        <div className="overflow-x-auto flex-1 bg-white">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Employee
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Leave Details
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 text-center">
                  Duration
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-zinc-700 font-black text-lg border border-indigo-100/50 shadow-sm group-hover:scale-105 transition-transform">
                          {req.employee?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-[15px]">
                            {req.employee?.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {req.employee?.employeeId || "EMP-000"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="font-bold text-gray-800 text-sm">{req.leaveType}</div>
                        <div
                          className="text-xs text-gray-500 font-medium truncate max-w-[250px]"
                          title={req.reason}
                        >
                          {req.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-black text-zinc-700 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                        {req.numberOfDays} Day{req.numberOfDays !== 1 ? "s" : ""}
                      </div>
                      <div className="text-[11px] text-gray-400 font-bold mt-1.5">
                        {new Date(req.fromDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(req.toDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100 rounded-xl transition-all shadow-sm"
                            onClick={() => handleAction(req._id, "reject")}
                            title="Reject Request"
                          >
                            <X size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white border border-green-100 rounded-xl transition-all shadow-sm"
                            onClick={() => handleAction(req._id, "approve")}
                            title="Approve Request"
                          >
                            <Check size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <div className="bg-gray-50 p-4 rounded-full">
                        <SearchX size={40} strokeWidth={1.5} className="text-gray-400" />
                      </div>
                      <p className="font-black uppercase tracking-widest text-sm text-gray-400">
                        No requests found in this category
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovals;
