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
    <div className="flex min-h-screen">
      {/* Left Panel - Brand / Intro */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
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
            Employee Leave <br /> Management System
          </h1>
          <p className="text-blue-100 text-xl max-w-md leading-relaxed">
            The ultimate platform for teams to manage time off, track availability, and streamline
            HR workflows.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-blue-500/30 backdrop-blur-md p-6 rounded-2xl border border-blue-400/30 max-w-sm">
            <p className="text-sm font-medium text-blue-100 mb-2 uppercase tracking-wider">
              Quick Note
            </p>
            <p className="text-white text-lg font-medium ring-offset-blue-600">
              "Transparency in leave management builds trust and promotes team health."
            </p>
          </div>
          <p className="mt-8 text-blue-200 text-sm">© 2026 ELMS Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutGrid className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">ELMS Portal</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to manage your leaves and team schedule.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500">
                  Register Here
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
