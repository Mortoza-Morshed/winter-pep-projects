import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Send, Info } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: "Annual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const { role } = useAuth();

  React.useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/leaves/stats");
        if (res.data.success) {
          setBalance(res.data.leaveBalance);
        }
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };
    fetchBalance();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Reset time portions to midnight to compare just the dates
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < startDate) return 0;

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numberOfDays = calculateDays(formData.fromDate, formData.toDate);

    if (numberOfDays <= 0) {
      toast.error("Invalid date range selected");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/leaves/apply", {
        ...formData,
        numberOfDays,
      });

      if (response.data.success) {
        toast.success("Leave application submitted successfully!");
        navigate(role === "Manager" ? "/manager-dashboard" : "/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsLoading(false);
    }
  };

  const daysCount = calculateDays(formData.fromDate, formData.toDate);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
            Request Time Off
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Submit your leave application for manager approval.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 mb-6">
            Application Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Type of Leave <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-4 text-[15px] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-400">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="date"
                    id="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-12 pr-4 py-4 text-[15px] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Return Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="date"
                    id="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-12 pr-4 py-4 text-[15px] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-bold text-gray-700">
                Reason / Note for Manager <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-5 text-gray-400" size={20} />
                <textarea
                  id="reason"
                  rows="4"
                  placeholder="Details regarding your time off..."
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-12 pr-5 py-4 text-[15px] font-medium text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none shadow-sm leading-relaxed"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <p className="text-xs text-gray-400 font-medium text-right mt-2">
                Briefly explain your absence.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 text-base rounded-2xl shadow-blue-200 shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processing Application..."
                ) : (
                  <>
                    Submit Request <Send size={20} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Summary / Stats Card - Sticky on desktop */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden group text-white">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity duration-700"></div>

            <div className="flex items-center gap-3 text-blue-300 mb-8 border-b border-white/10 pb-4 relative z-10">
              <Info size={24} />
              <h3 className="font-black text-xl">Summary</h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs block mb-1">
                  Leave Category
                </span>
                <span className="text-white font-black text-lg">{formData.leaveType}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs block mb-1">
                    Start Date
                  </span>
                  <span className="text-white font-bold">
                    {formData.fromDate
                      ? new Date(formData.fromDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "--/--/----"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs block mb-1">
                    Return Date
                  </span>
                  <span className="text-white font-bold">
                    {formData.toDate
                      ? new Date(formData.toDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "--/--/----"}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs block">
                    Total Duration
                  </span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    {daysCount} Day{daysCount !== 1 && "s"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/5 relative z-10">
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Your current balance is <span className="text-white font-bold">{balance} days</span>
                . This request will reduce your balance to{" "}
                <span className="text-blue-300 font-bold">
                  {Math.max(0, balance - daysCount)} days
                </span>{" "}
                upon manager approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
