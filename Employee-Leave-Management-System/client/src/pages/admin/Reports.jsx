import React, { useState, useEffect } from "react";
import {
  FileBarChart,
  Download,
  CalendarDays,
  PieChart,
  TrendingDown,
  Activity,
} from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportToCSV";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [allLeaves, setAllLeaves] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [metrics, setMetrics] = useState({
    totalDaysTaken: 0,
    mostCommonType: "N/A",
    approvalRate: "0%",
    totalRequests: 0,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get("/leaves/all");
        if (response.data.success) {
          const leaves = response.data.leaves;
          setAllLeaves(leaves);

          if (leaves.length > 0) {
            // Calculate total days taken (only approved)
            const approvedLeaves = leaves.filter((l) => l.status === "Approved");
            const totalDays = approvedLeaves.reduce((acc, curr) => acc + curr.numberOfDays, 0);

            // Approval rate
            const rate = ((approvedLeaves.length / leaves.length) * 100).toFixed(0);

            // Most common type
            const typeCounts = leaves.reduce((acc, curr) => {
              acc[curr.leaveType] = (acc[curr.leaveType] || 0) + 1;
              return acc;
            }, {});
            const commonType = Object.keys(typeCounts).reduce((a, b) =>
              typeCounts[a] > typeCounts[b] ? a : b,
            );

            setMetrics({
              totalDaysTaken: totalDays,
              mostCommonType: commonType,
              approvalRate: `${rate}%`,
              totalRequests: leaves.length,
            });

            // Prepare Chart Data
            setChartData({
              labels: Object.keys(typeCounts),
              datasets: [
                {
                  label: "Leave Requests",
                  data: Object.values(typeCounts),
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.8)", // blue
                    "rgba(16, 185, 129, 0.8)", // green
                    "rgba(139, 92, 246, 0.8)", // purple
                    "rgba(245, 158, 11, 0.8)", // orange
                    "rgba(239, 68, 68, 0.8)", // red
                  ],
                  borderWidth: 0,
                },
              ],
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
        toast.error("Could not load reporting data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-white rounded-2xl p-12 items-center justify-center animate-pulse font-black text-gray-400">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Company Reports & Analytics</h1>
          <p className="text-gray-500 font-medium">
            Analyze leave patterns, capacity, and workforce trends.
          </p>
        </div>
        <Button
          onClick={() => exportToCSV(allLeaves, "company_leave_report")}
          className="flex items-center gap-2 px-6 shadow-blue-100"
        >
          <Download size={18} /> Export Full Report
        </Button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={metrics.totalRequests}
          icon={FileBarChart}
          color="blue"
        />
        <StatCard
          title="Approved Days Off"
          value={metrics.totalDaysTaken}
          icon={CalendarDays}
          color="purple"
        />
        <StatCard
          title="Approval Rate"
          value={metrics.approvalRate}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Top Leave Type"
          value={metrics.mostCommonType}
          icon={PieChart}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Approvals Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-black text-gray-900">Recently Approved</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {allLeaves
              .filter((l) => l.status === "Approved")
              .slice(0, 5)
              .map((leave) => (
                <div
                  key={leave._id}
                  className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-gray-900">{leave.employee?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500 font-medium">
                      {leave.leaveType} for {leave.numberOfDays} days
                    </p>
                  </div>
                  <div className="text-xs font-bold text-gray-400">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            {allLeaves.filter((l) => l.status === "Approved").length === 0 && (
              <div className="p-8 text-center text-gray-400 font-medium">
                No approved leaves yet.
              </div>
            )}
          </div>
        </div>

        {/* Insight Card with Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col pt-6 px-6 pb-8">
          <h3 className="text-lg font-black text-gray-900 mb-6">Leave Distribution Pipeline</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
            {chartData ? (
              <Doughnut
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { padding: 20, font: { weight: "bold" } },
                    },
                  },
                }}
              />
            ) : (
              <div className="text-gray-400 font-medium">Not enough data to graph</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
