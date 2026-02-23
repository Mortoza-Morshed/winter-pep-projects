import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  SearchX,
} from "lucide-react";
import api from "../../services/api";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportToCSV";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/leaves/my");
        if (response.data.success) {
          setLeaves(response.data.leaves);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
        toast.error("Could not load leave history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || leave.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center animate-pulse font-black text-gray-400 uppercase tracking-widest">
        Loading History...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Leave History</h1>
          <p className="text-gray-500 font-medium text-sm">
            Review all your previous and pending leave requests.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm bg-white border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none"
            onClick={() => exportToCSV(filteredLeaves, "my_leave_history")}
          >
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by reason or type..."
            className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-bold min-w-fit">
            <Filter size={16} /> Filter:
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 md:w-40 bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Leave Type
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Duration
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Reason
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Applied On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900">{leave.leaveType}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(leave.fromDate).toLocaleDateString()} -{" "}
                        {new Date(leave.toDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-blue-600 font-black mt-1 uppercase mt-0.5">
                        {leave.numberOfDays} Days Total
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm text-gray-600 font-medium line-clamp-2">
                        {leave.reason}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge status={leave.status} />
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-400">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <SearchX size={48} strokeWidth={1} />
                      <p className="font-black uppercase tracking-widest text-sm">
                        No results found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-bold">
            Showing 1 to {filteredLeaves.length} of {filteredLeaves.length} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="p-2 border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
              disabled
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 border-blue-600 bg-blue-600 text-white text-sm font-bold shadow-sm shadow-blue-100"
            >
              1
            </Button>
            <Button
              variant="outline"
              className="p-2 border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
              disabled
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;
