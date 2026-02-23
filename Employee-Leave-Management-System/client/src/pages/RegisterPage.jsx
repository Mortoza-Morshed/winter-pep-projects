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
    <div className="flex min-h-screen">
      {/* Left Panel - Identical to Login for consistency */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-lg">
              <LayoutGrid className="text-blue-600" size={32} />
            </div>
            <span className="text-2xl font-bold tracking-tight">ELMS Portal</span>
          </div>

          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Join the <br /> Professional Network
          </h1>
          <p className="text-blue-100 text-xl max-w-md leading-relaxed">
            Manage your work-life balance with our transparent leave management system.
          </p>
        </div>

        <div className="relative z-10 text-blue-200 text-sm">
          © 2026 ELMS Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutGrid className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">ELMS Portal</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Get started with your company account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2.5 bg-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Register Now"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
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
