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
  Activity,
} from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import toast from "react-hot-toast";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    totalLeaveRequests: 0,
    pendingLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [chartData, setChartData] = useState(null);
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

          // Generate Chart Data
          const typeCounts = leaveRequests.reduce((acc, curr) => {
            acc[curr.leaveType] = (acc[curr.leaveType] || 0) + 1;
            return acc;
          }, {});

          if (Object.keys(typeCounts).length > 0) {
            setChartData({
              labels: Object.keys(typeCounts),
              datasets: [
                {
                  data: Object.values(typeCounts),
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.9)", // blue
                    "rgba(16, 185, 129, 0.9)", // green
                    "rgba(139, 92, 246, 0.9)", // purple
                    "rgba(245, 158, 11, 0.9)", // orange
                    "rgba(239, 68, 68, 0.9)", // red
                  ],
                  borderWidth: 0,
                  hoverOffset: 4,
                },
              ],
            });
          }
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
        {/* Chart Section */}
        <div className="bg-white/80 rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 w-full flex flex-col items-center">
            <h3 className="text-lg font-black text-gray-900 mb-6 w-full text-left flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              Global Leave Distribution
            </h3>
            <div className="h-[240px] w-full flex items-center justify-center">
              {chartData ? (
                <Doughnut
                  data={chartData}
                  options={{
                    cutout: "75%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: { family: "Outfit", weight: "600" },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(17, 24, 39, 0.9)",
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { family: "Outfit" },
                        bodyFont: { family: "Outfit" },
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              ) : (
                <p className="text-sm font-semibold text-gray-400">Not enough data to graph.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Leave History across the company */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-lg font-black text-gray-900">Recent Company Requests</h2>
            <Link
              to="/approvals"
              className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:text-blue-700 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Leave Details
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm group-hover:scale-105 transition-transform">
                            {leave.employee?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">
                              {leave.employee?.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {leave.employee?.employeeId || "EMP-000"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-700 text-sm">{leave.leaveType}</div>
                        <div className="text-xs text-gray-400 font-medium mt-0.5">
                          <span className="text-gray-600">{leave.numberOfDays} Days</span> (
                          {new Date(leave.fromDate).toLocaleDateString()})
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
      </div>

      {/* Quick Links Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/users" className="block outline-none cursor-pointer">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                <Users size={28} className="text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-2 relative z-10">Manage Directory</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm relative z-10 font-medium">
              Add, remove, or modify employee accounts, system roles, and department access.
            </p>
          </div>
        </Link>

        <Link to="/reports" className="block outline-none cursor-pointer">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity duration-700"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <TrendingUp size={28} className="text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-sm">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-2 relative z-10">View Reports Analytics</h3>
            <p className="text-blue-100/80 text-sm leading-relaxed max-w-sm relative z-10 font-medium">
              Deep dive into company-wide statistics, export leave data, and track approval rates.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
