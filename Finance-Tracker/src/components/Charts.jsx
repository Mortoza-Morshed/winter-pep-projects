import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "./Charts.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Charts = ({ transactions }) => {
  // Responsive breakpoint helpers (recalculated on each render; Chart.js
  // also re-renders on window resize because responsive:true is set)
  const isMobile = window.innerWidth <= 480;
  const isTablet = window.innerWidth <= 768;
  const legendFontSize = isMobile ? 10 : isTablet ? 11 : 12;
  const tooltipTitleSize = isMobile ? 12 : 14;
  const tooltipBodySize = isMobile ? 11 : 13;
  const tickFontSize = isMobile ? 9 : 11;
  const legendPadding = isMobile ? 8 : 15;

  // Prepare data for category spending (Doughnut Chart)
  const getCategoryData = () => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const categoryTotals = {};

    expenses.forEach((transaction) => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += parseFloat(transaction.amount);
      } else {
        categoryTotals[transaction.category] = parseFloat(transaction.amount);
      }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals).map((val) => parseFloat(val.toFixed(2)));

    return { labels, data };
  };

  // Prepare data for income vs expense (Bar Chart)
  const getMonthlyData = () => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        monthlyData[monthYear].income += parseFloat(transaction.amount);
      } else {
        monthlyData[monthYear].expense += parseFloat(transaction.amount);
      }
    });

    const sortedData = Object.values(monthlyData).slice(-6); // Last 6 months
    const labels = sortedData.map((d) => d.month);
    const incomeData = sortedData.map((d) => d.income);
    const expenseData = sortedData.map((d) => d.expense);

    return { labels, incomeData, expenseData };
  };

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();

  // Doughnut Chart Configuration
  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: "Spending",
        data: categoryData.data,
        backgroundColor: [
          "rgba(15, 118, 110, 0.8)", // Teal
          "rgba(8, 145, 178, 0.8)", // Cyan
          "rgba(5, 150, 105, 0.8)", // Green
          "rgba(2, 132, 199, 0.8)", // Blue
          "rgba(30, 58, 138, 0.8)", // Navy
          "rgba(13, 95, 88, 0.8)", // Dark teal
          "rgba(14, 116, 144, 0.8)", // Dark cyan
          "rgba(4, 120, 87, 0.8)", // Dark green
        ],
        borderColor: [
          "rgba(15, 118, 110, 1)",
          "rgba(8, 145, 178, 1)",
          "rgba(5, 150, 105, 1)",
          "rgba(2, 132, 199, 1)",
          "rgba(30, 58, 138, 1)",
          "rgba(13, 95, 88, 1)",
          "rgba(14, 116, 144, 1)",
          "rgba(4, 120, 87, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: legendPadding,
          font: {
            size: legendFontSize,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: tooltipTitleSize,
          weight: "bold",
        },
        bodyFont: {
          size: tooltipBodySize,
        },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  // Bar Chart Configuration
  const barData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Income",
        data: monthlyData.incomeData,
        backgroundColor: "rgba(5, 150, 105, 0.8)",
        borderColor: "rgba(5, 150, 105, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Expenses",
        data: monthlyData.expenseData,
        backgroundColor: "rgba(220, 38, 38, 0.8)",
        borderColor: "rgba(220, 38, 38, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: legendPadding,
          font: {
            size: legendFontSize,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: tooltipTitleSize,
          weight: "bold",
        },
        bodyFont: {
          size: tooltipBodySize,
        },
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: tickFontSize,
            family: "'Inter', sans-serif",
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: tickFontSize,
            family: "'Inter', sans-serif",
          },
          callback: function (value) {
            return isMobile
              ? "$" + (value >= 1000 ? (value / 1000).toFixed(1) + "k" : value)
              : "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3 className="chart-title">Spending by Category</h3>
        <div className="chart-wrapper">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Income vs Expenses</h3>
        <div className="chart-wrapper">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
