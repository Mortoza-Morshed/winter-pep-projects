import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Send, Info } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: "Annual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsLoading(false);
    }
  };

  const daysCount = calculateDays(formData.fromDate, formData.toDate);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Apply for Leave</h1>
          <p className="text-gray-500 font-medium text-sm">
            Fill out the form below to submit your leave request.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Leave Type</label>
              <select
                id="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Casual Leave">Casual Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="From Date"
                type="date"
                id="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                icon={Calendar}
                required
              />
              <Input
                label="To Date"
                type="date"
                id="toDate"
                value={formData.toDate}
                onChange={handleChange}
                icon={Calendar}
                required
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-2">
                Reason for Leave
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <textarea
                  id="reason"
                  rows="4"
                  placeholder="Briefly explain the reason for your leave..."
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="flex pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application <Send size={18} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Summary / Stats Card */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-4 font-black">
              <Info size={20} />
              <h3>Application Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-blue-100 pb-2">
                <span className="text-blue-600/70 font-medium">Leave Type:</span>
                <span className="text-blue-900 font-bold">{formData.leaveType}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-blue-100 pb-2">
                <span className="text-blue-600/70 font-medium">Duration:</span>
                <span className="text-blue-900 font-bold text-lg">{daysCount} Days</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/60 rounded-xl">
              <p className="text-xs text-blue-600/80 leading-relaxed font-bold">
                Your current balance is <span className="text-blue-700">18 days</span>. This request
                will deduct from your balance upon approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
