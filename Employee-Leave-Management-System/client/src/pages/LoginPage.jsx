import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      toast.success("Successfully logged in!");
      // Redirect based on role
      if (result.role === "Admin") navigate("/admin");
      else if (result.role === "Manager") navigate("/approvals");
      else navigate("/dashboard");
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
            <span className="text-2xl font-black tracking-widest uppercase">ELMS Portal</span>
          </div>

          <h1 className="text-6xl font-black mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            Employee Leave <br /> Management System
          </h1>
          <p className="text-blue-100/90 text-xl max-w-md leading-relaxed font-medium">
            The ultimate platform for teams to manage time off, track availability, and streamline
            HR workflows.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="text-xs font-black text-blue-200 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Quick Note
            </p>
            <p className="text-white text-xl font-bold leading-snug">
              "Transparency in leave management builds trust and promotes team health."
            </p>
          </div>
          <p className="mt-8 text-blue-200/60 text-sm font-bold tracking-widest uppercase text-center max-w-md">
            © 2026 ELMS Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle background glow for mobile */}
        <div className="lg:hidden absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100 to-transparent opacity-50 pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10">
          <div className="mb-12 lg:hidden flex justify-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <LayoutGrid className="text-white" size={28} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">ELMS Portal</span>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-lg">
              Sign in to manage your leaves and team schedule.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-violet-600 focus:ring-blue-500 border-gray-300 rounded-md cursor-pointer transition-colors"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm font-bold text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-bold text-violet-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-lg font-black rounded-2xl shadow-xl shadow-blue-200 hover:-translate-y-0.5 transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center mt-10">
              <p className="text-base text-gray-600 font-medium">
                New to the system?{" "}
                <Link
                  to="/register"
                  className="font-black text-violet-600 hover:text-blue-800 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-0.5"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
