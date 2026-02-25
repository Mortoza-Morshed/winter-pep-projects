import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Briefcase, Hash, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Brand / Intro */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-indigo-500 opacity-20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
              <LayoutGrid className="text-white" size={32} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-widest uppercase">Recharge</span>
          </div>

          <h1 className="text-6xl font-black mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            Join the <br /> Professional Network
          </h1>
          <p className="text-blue-100/90 text-xl max-w-md leading-relaxed font-medium">
            Manage your work-life balance with our transparent leave management system.
          </p>
        </div>

        <div className="relative z-10">
          <p className="mt-8 text-blue-200/60 text-sm font-bold tracking-widest uppercase max-w-md">
            © 2026 ELMS Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden overflow-y-auto">
        {/* Subtle background glow for mobile */}
        <div className="lg:hidden absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100 to-transparent opacity-50 pointer-events-none"></div>

        <div className="w-full max-w-[460px] relative z-10 py-8">
          <div className="mb-10 lg:hidden flex justify-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <LayoutGrid className="text-white" size={28} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">ELMS Portal</span>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Get started with your company account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              id="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Department"
                id="department"
                placeholder="IT / HR"
                value={formData.department}
                onChange={handleChange}
                icon={Briefcase}
                required
              />
              <Input
                label="Employee ID"
                id="employeeId"
                placeholder="EMP-001"
                value={formData.employeeId}
                onChange={handleChange}
                icon={Hash}
                required
              />
            </div>

            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />

            <div className="space-y-2 pt-1">
              <label className="block text-sm font-bold text-gray-700">
                Account Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-4 text-[15px] font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
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

            <Button
              type="submit"
              className="w-full py-4 text-lg font-black rounded-2xl shadow-xl shadow-blue-200 hover:-translate-y-0.5 transition-all mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Register Now"}
            </Button>

            <div className="text-center mt-8">
              <p className="text-base text-gray-600 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-black text-zinc-700 hover:text-blue-800 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-0.5"
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
