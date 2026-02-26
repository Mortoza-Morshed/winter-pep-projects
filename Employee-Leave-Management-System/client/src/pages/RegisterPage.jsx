import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Briefcase, Hash, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    employeeId: "",
    role: "Employee",
  });
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      toast.success("Registration successful! Redirecting...");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm";

  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Dark branding */}
      <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-slate-900 via-zinc-900 to-zinc-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 opacity-15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-blue-700 opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shadow-lg">
              <LayoutGrid className="text-white" size={28} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-widest uppercase text-white">Luna</span>
          </div>
          <h1 className="text-5xl font-black mb-5 leading-[1.1] tracking-tight text-white">
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              Professional Network
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed font-medium">
            Manage your work-life balance with our transparent leave management system.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase">
            © 2026 Luna Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — White form */}
      <div className="w-full lg:flex-1 flex items-center justify-center p-8 sm:p-12 bg-gray-50 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.05),_transparent_60%)] pointer-events-none" />

        <div className="w-full max-w-[480px] relative z-10 py-6">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex justify-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-slate-800 to-zinc-900 p-2.5 rounded-xl shadow-lg">
                <LayoutGrid className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">Luna</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Get started with your company account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Department</label>
                <div className="relative">
                  <Briefcase
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="department"
                    placeholder="IT / HR"
                    value={formData.department}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Employee ID</label>
                <div className="relative">
                  <Hash
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="employeeId"
                    placeholder="EMP-001"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Account Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-slate-800 to-zinc-900 hover:from-zinc-800 hover:to-slate-900 disabled:opacity-60 text-white text-base font-black rounded-xl shadow-lg shadow-zinc-300/40 hover:-translate-y-0.5 transition-all"
            >
              {isLoading ? "Creating Account..." : "Register Now"}
            </button>

            <div className="text-center pt-3">
              <p className="text-sm text-gray-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-black text-zinc-800 hover:text-indigo-700 transition-colors border-b-2 border-transparent hover:border-indigo-500 pb-0.5"
                >
                  Login Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
