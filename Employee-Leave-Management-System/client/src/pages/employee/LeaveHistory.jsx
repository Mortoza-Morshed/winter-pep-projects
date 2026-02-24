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
    <div className="space-y-6 h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Leave History</h1>
          <p className="text-gray-500 font-medium text-lg">
            Review all your previous and pending leave requests.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm bg-white border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none shadow-sm font-bold px-6 py-2.5 rounded-xl"
            onClick={() => exportToCSV(filteredLeaves, "my_leave_history")}
          >
            <Download size={18} /> Export Records
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">
        {/* Filters Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center bg-gray-50/50">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by reason or type..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-bold min-w-fit">
              <Filter size={18} /> Filter:
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 sm:w-48 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Declined</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto flex-1 bg-white">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Leave Details
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Timeframe
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Reason
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Current Status
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">
                  Filed On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100/50">
                          <Calendar className="text-indigo-500" size={20} />
                        </div>
                        <div className="font-bold text-gray-900 text-[15px]">{leave.leaveType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-700">
                        {new Date(leave.fromDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(leave.toDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[11px] text-violet-600 font-black uppercase tracking-widest mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded-md">
                        {leave.numberOfDays} Day{leave.numberOfDays !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p
                        className="text-sm text-gray-500 font-medium truncate"
                        title={leave.reason}
                      >
                        {leave.reason}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={leave.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-gray-400">
                        {new Date(leave.createdAt).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <SearchX size={48} strokeWidth={1.5} className="text-gray-200" />
                      <p className="font-black uppercase tracking-widest text-sm text-gray-400">
                        No records match your criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-bold">
            Showing <span className="text-gray-900">{filteredLeaves.length}</span> of{" "}
            {leaves.length} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="p-2 bg-white border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm"
              disabled
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 border-blue-600 bg-blue-600 text-white text-sm font-bold shadow-sm shadow-blue-200 hover:-translate-y-0.5 transition-transform rounded-lg"
            >
              1
            </Button>
            <Button
              variant="outline"
              className="p-2 bg-white border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm"
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
