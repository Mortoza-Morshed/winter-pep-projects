import React, { useState } from "react";
import { Receipt, DollarSign, Tag, CalendarDays, FileText, Send } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Travel", "Meals", "Equipment", "Medical", "Other"];

const ReimbursementForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.amount || !form.date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/reimbursements/submit", {
        ...form,
        amount: parseFloat(form.amount),
      });
      if (res.data.success) {
        toast.success("Reimbursement claim submitted!");
        addNotification({
          title: "Claim Submitted",
          message: `Your ${form.category} claim of $${parseFloat(form.amount).toFixed(2)} has been submitted for review.`,
          type: "info",
        });
        navigate(
          role === "Manager" ? "/manager/reimbursements/history" : "/reimbursements/history",
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 bg-white transition-shadow";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
          Submit Expense Claim
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Fill in your expense details for reimbursement review.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="bg-zinc-100 p-2.5 rounded-xl">
              <Receipt size={22} className="text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">New Reimbursement</h2>
              <p className="text-xs text-gray-400 font-medium">All fields marked * are required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                <Tag size={14} className="inline mr-1.5 mb-0.5" />
                Expense Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Client dinner, Flight to conference"
                className={inputClass}
                required
              />
            </div>

            {/* Category + Amount row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  <Receipt size={14} className="inline mr-1.5 mb-0.5" />
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  <DollarSign size={14} className="inline mr-1.5 mb-0.5" />
                  Amount ($) *
                </label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                <CalendarDays size={14} className="inline mr-1.5 mb-0.5" />
                Date of Expense *
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={inputClass}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                <FileText size={14} className="inline mr-1.5 mb-0.5" />
                Description (optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Additional context about this expense…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3"
              >
                <Send size={16} />
                {loading ? "Submitting…" : "Submit Claim"}
              </Button>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    role === "Manager"
                      ? "/manager/reimbursements/history"
                      : "/reimbursements/history",
                  )
                }
                className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                View My Claims
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReimbursementForm;
