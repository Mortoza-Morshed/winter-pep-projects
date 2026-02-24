import React, { useState, useEffect, useMemo } from "react";
import { FileBarChart, Download, CalendarDays, PieChart, TrendingUp, Activity } from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportToCSV";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [allLeaves, setAllLeaves] = useState([]);
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
            const approvedLeaves = leaves.filter((l) => l.status === "Approved");
            const totalDays = approvedLeaves.reduce((acc, curr) => acc + curr.numberOfDays, 0);
            const rate = ((approvedLeaves.length / leaves.length) * 100).toFixed(0);

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

  // Derived Chart Data
  const typeChartData = useMemo(() => {
    if (!allLeaves || allLeaves.length === 0) return null;
    const typeCounts = allLeaves.reduce((acc, curr) => {
      acc[curr.leaveType] = (acc[curr.leaveType] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          data: Object.values(typeCounts),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [allLeaves]);

  const statusChartData = useMemo(() => {
    if (!allLeaves || allLeaves.length === 0) return null;
    const statusCounts = allLeaves.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    // Fixed order + colors so bars always appear correctly
    const statuses = ["Approved", "Pending", "Rejected"];
    const colors = {
      Approved: { bg: "rgba(16, 185, 129, 0.85)", border: "rgba(16, 185, 129, 1)" },
      Pending: { bg: "rgba(245, 158, 11, 0.85)", border: "rgba(245, 158, 11, 1)" },
      Rejected: { bg: "rgba(239, 68, 68, 0.85)", border: "rgba(239, 68, 68, 1)" },
    };

    return {
      labels: statuses,
      datasets: [
        {
          label: "Requests",
          data: statuses.map((s) => statusCounts[s] || 0),
          backgroundColor: statuses.map((s) => colors[s].bg),
          borderColor: statuses.map((s) => colors[s].border),
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    };
  }, [allLeaves]);

  if (loading) {
    return (
      <div className="flex bg-white rounded-3xl p-12 items-center justify-center animate-pulse font-black text-gray-400">
        Loading Advanced Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1 lg:text-4xl tracking-tight">
            Performance & Analytics
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Deep insights into capacity and workforce trends.
          </p>
        </div>
        <Button
          onClick={() => exportToCSV(allLeaves, "company_leave_report")}
          className="flex items-center gap-2 px-6 shadow-blue-200 shadow-lg hover:-translate-y-0.5 transition-all text-sm py-3"
        >
          <Download size={18} /> Export CSV Report
        </Button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests Filed"
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
          title="Global Approval Rate"
          value={metrics.approvalRate}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Highest Demand Leave"
          value={metrics.mostCommonType}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Processing Status Pipeline - Spans 2 cols */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
            <Activity className="text-green-500" size={24} /> Processing Status Pipeline
          </h3>
          <div className="flex-1 min-h-[280px] w-full">
            {statusChartData ? (
              <Bar
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      padding: 12,
                      cornerRadius: 8,
                      titleFont: { family: "Outfit" },
                      bodyFont: { family: "Outfit" },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(0,0,0,0.04)" },
                      ticks: { font: { family: "Outfit" } },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { family: "Outfit", weight: "700" } },
                    },
                  },
                  barThickness: 60,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-medium bg-gray-50 rounded-2xl">
                Insufficient Data
              </div>
            )}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col p-6">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
            <PieChart className="text-purple-500" size={24} /> Type Breakdown
          </h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[280px]">
            {typeChartData ? (
              <Doughnut
                data={typeChartData}
                options={{
                  cutout: "65%",
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 20,
                        usePointStyle: true,
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
                }}
              />
            ) : (
              <div className="text-gray-400 font-medium bg-gray-50 px-4 py-2 rounded-lg">
                Insufficient Data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
