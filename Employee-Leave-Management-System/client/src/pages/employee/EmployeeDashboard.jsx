import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Calendar,
  ExternalLink,
  ArrowRight,
  Palmtree,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import toast from "react-hot-toast";

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    leaveBalance: 18,
    pendingLeaves: 0,
    approvedLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get("/leaves/stats"),
          api.get("/leaves/my"),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data);
        }
        if (historyRes.data.success) {
          setRecentLeaves(historyRes.data.leaves.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        toast.error("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-white rounded-2xl p-12 items-center justify-center animate-pulse">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Welcome Back!</h1>
        <p className="text-gray-500 font-medium text-lg">
          Here's what's happening with your leave schedule.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-blue-100 font-bold uppercase tracking-widest text-xs">
              Available Balance
            </span>
            <Calendar className="text-blue-200" size={24} />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <h2 className="text-5xl font-black">{stats.leaveBalance}</h2>
            <span className="text-blue-200 font-bold">Days</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Pending Requests
            </span>
            <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-gray-900">{stats.pendingLeaves}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Approved Leaves
            </span>
            <div className="bg-green-50 p-2 rounded-xl text-green-500">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-gray-900">{stats.approvedLeaves}</h2>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leave History */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-black text-gray-900">Recent Applications</h2>
            <a
              href="/leave-history"
              className="text-zinc-700 text-sm font-bold flex items-center gap-1 hover:text-blue-800 transition-colors"
            >
              View Full History <ArrowRight size={14} />
            </a>
          </div>
          <div className="overflow-x-auto flex-1 p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-900 text-[15px]">{leave.leaveType}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5 font-medium">
                          {leave.reason}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-gray-700">
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          to {new Date(leave.toDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-black text-zinc-700 bg-blue-50/30">
                        {leave.numberOfDays}d
                      </td>
                      <td className="px-6 py-5">
                        <Badge status={leave.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-16 text-center text-gray-400 font-medium bg-gray-50/30 rounded-2xl m-4"
                    >
                      No recent leave requests found. Ready for a break?
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Content: Holidays & info */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-500 shrink-0 mt-1">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 mb-1">Planning Ahead</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Apply for Annual leaves at least{" "}
                <span className="text-gray-900 font-bold">2 weeks</span> in advance for smoother
                100% approval rates from your manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
