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
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome Back!</h1>
        <p className="text-gray-500 font-medium">
          Here's what's happening with your leave schedule.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Leave Balance"
          value={`${stats.leaveBalance} Days`}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingLeaves}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approvedLeaves}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leave History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Recent Leave History</h2>
            <a
              href="/leave-history"
              className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight size={14} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{leave.leaveType}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[150px]">
                          {leave.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-700">
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          to {new Date(leave.toDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        {leave.numberOfDays}d
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={leave.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">
                      No recent leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Content: Holidays & info */}
        <div className="space-y-6">
          {/* Holiday Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <Palmtree size={24} />
              </div>
              <h3 className="text-lg font-bold">Upcoming Holiday</h3>
            </div>
            <div className="mb-6">
              <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                March 26, 2026
              </span>
              <p className="text-xl font-black mt-2">Independence Day</p>
              <p className="text-blue-100/80 text-sm mt-1 leading-relaxed">
                Celebrate our nation's freedom. A day of pride and reflection across the country.
              </p>
            </div>
            <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              View Calendar <ExternalLink size={16} />
            </button>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <AlertCircle size={20} />
              <h3 className="font-black">Quick Tip</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Apply for Annual leaves at least{" "}
              <span className="text-gray-900 font-bold">2 weeks</span> in advance for smoother
              approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
