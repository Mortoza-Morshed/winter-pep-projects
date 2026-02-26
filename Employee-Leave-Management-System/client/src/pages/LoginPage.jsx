import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success("Successfully logged in!");
      if (result.role === "Admin") navigate("/admin");
      else if (result.role === "Manager") navigate("/manager-dashboard");
      else navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm";

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Dark branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-zinc-900 to-zinc-800 text-white p-12 flex-col justify-between relative overflow-hidden">
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
            Employee Leave <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              Management
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed font-medium">
            The ultimate platform for teams to manage time off, track availability, and streamline
            HR workflows.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 backdrop-blur-xl p-7 rounded-2xl border border-white/10 max-w-md">
            <p className="text-xs font-black text-indigo-400 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" /> Quick Note
            </p>
            <p className="text-zinc-300 text-lg font-bold leading-snug">
              "Transparency in leave management builds trust and promotes team health."
            </p>
          </div>
          <p className="mt-8 text-zinc-600 text-xs font-bold tracking-widest uppercase">
            © 2026 Luna Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — White form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-gray-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.05),_transparent_60%)] pointer-events-none" />

        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden flex justify-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-slate-800 to-zinc-900 p-2.5 rounded-xl shadow-lg">
                <LayoutGrid className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">Luna</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-base">
              Sign in to manage your leaves and team schedule.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-slate-800 to-zinc-900 hover:from-zinc-800 hover:to-slate-900 disabled:opacity-60 text-white text-base font-black rounded-xl shadow-lg shadow-zinc-300/40 hover:-translate-y-0.5 transition-all"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 font-medium">
                New to the system?{" "}
                <Link
                  to="/register"
                  className="font-black text-zinc-800 hover:text-indigo-700 transition-colors border-b-2 border-transparent hover:border-indigo-500 pb-0.5"
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
