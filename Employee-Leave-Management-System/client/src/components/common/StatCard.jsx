import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  const colorStyles = {
    blue: "bg-violet-50 text-violet-600",
    violet: "bg-violet-50 text-violet-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-amber-50 text-amber-600",
    red: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorStyles[color] || colorStyles.blue}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-bold ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-bold text-gray-400 capitalize">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
