import React from "react";

const Badge = ({ children, status = "Pending", className = "" }) => {
  const statusStyles = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    "Manager Approved": "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-orange-100 text-orange-700 border-orange-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
    "Annual Leave": "bg-zinc-100 text-zinc-700 border-zinc-200",
    "Sick Leave": "bg-pink-50 text-pink-600 border-pink-100",
    "Personal Leave": "bg-gray-100 text-gray-600 border-gray-200",
    "Casual Leave": "bg-purple-50 text-purple-600 border-purple-100",
  };

  const style = statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${style} ${className}`}>
      {children || status}
    </span>
  );
};

export default Badge;
