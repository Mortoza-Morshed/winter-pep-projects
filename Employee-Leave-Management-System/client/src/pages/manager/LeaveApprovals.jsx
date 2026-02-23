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
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const LeaveApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");

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
    try {
      const response = await api.put(`/leaves/${id}/${action}`);
      if (response.data.success) {
        toast.success(`Request ${action}d successfully`);
        // Update local state
        setRequests(
          requests.map((req) =>
            req._id === id
              ? { ...req, status: action === "approve" ? "Approved" : "Rejected" }
              : req,
          ),
        );
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Leave Approvals</h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Review and manage pending employee leave requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          icon={MessageSquare}
          color="orange"
        />
        <StatCard title="On Leave Today" value={stats.onLeave} icon={Calendar} color="blue" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-50 p-2 gap-2 bg-gray-50/50">
          {["Pending", "Approved", "Rejected", "All History"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}{" "}
              {tab === "Pending" && stats.pending > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-lg text-[10px]">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/20">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Employee
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Leave Details
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                  Duration
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                          {req.employee?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{req.employee?.name}</div>
                          <div className="text-xs text-gray-400 font-bold uppercase">
                            {req.employee?.employeeId || "EMP-000"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <Badge status={req.leaveType} className="w-fit mb-1" />
                        <div className="text-xs text-gray-500 font-medium line-clamp-1">
                          {req.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-sm font-bold text-gray-900">{req.numberOfDays} Days</div>
                      <div className="text-[10px] text-gray-400 font-bold">
                        {new Date(req.fromDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge status={req.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      {req.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                            onClick={() => handleAction(req._id, "reject")}
                          >
                            <X size={18} />
                          </Button>
                          <Button
                            variant="primary"
                            className="p-2 shadow-blue-100"
                            onClick={() => handleAction(req._id, "approve")}
                          >
                            <Check size={18} />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider italic">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <SearchX size={48} strokeWidth={1} />
                      <p className="font-black uppercase tracking-widest text-sm">
                        No requests found
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
