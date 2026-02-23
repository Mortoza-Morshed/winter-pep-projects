import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    totalLeaveRequests: 0,
    pendingLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersStatsRes, leavesRes] = await Promise.all([
          api.get("/users/stats"),
          api.get("/leaves/all"),
        ]);

        let leaveRequests = [];
        let pendingCount = 0;

        if (leavesRes.data.success) {
          leaveRequests = leavesRes.data.leaves;
          pendingCount = leaveRequests.filter((l) => l.status === "Pending").length;
          setRecentLeaves(leaveRequests.slice(0, 5)); // Get top 5 most recent
        }

        if (usersStatsRes.data.success) {
          setStats({
            totalUsers: usersStatsRes.data.totalUsers,
            activeEmployees: usersStatsRes.data.activeEmployees,
            totalLeaveRequests: leaveRequests.length,
            pendingLeaves: pendingCount,
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
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
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium">
          Overview of system usage, employee accounts, and leave requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={Briefcase}
          color="green"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalLeaveRequests}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingLeaves}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leave History across the company */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Recent Company Requests</h2>
            <Link
              to="/approvals"
              className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                    Leave Details
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
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 text-xs">
                            {leave.employee?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">
                              {leave.employee?.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                              {leave.employee?.employeeId || "EMP-000"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-700 text-sm">{leave.leaveType}</div>
                        <div className="text-xs text-gray-400">
                          {leave.numberOfDays} Days ({new Date(leave.fromDate).toLocaleDateString()}
                          )
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={leave.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-medium">
                      No recent leave requests found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Content: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Database Connection</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                  Optimal
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Active Sessions</span>
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                  24 Users
                </span>
              </div>
            </div>
          </div>

          <Link to="/admin/users" className="block">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-bold">Manage Directory</h3>
              </div>
              <p className="text-blue-100/80 text-sm mt-1 mb-4 leading-relaxed">
                Add, remove, or modify employee accounts and system roles.
              </p>
              <div className="flex items-center text-sm font-black text-white gap-2 group-hover:gap-3 transition-all">
                Open Directory <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
