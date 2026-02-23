import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/common/Layout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ApplyLeave from "../pages/employee/ApplyLeave";
import LeaveHistory from "../pages/employee/LeaveHistory";
import LeaveApprovals from "../pages/manager/LeaveApprovals";
import UserManagement from "../pages/admin/UserManagement";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Reports from "../pages/admin/Reports";

const LayoutRoutes = () => (
  <Layout>
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute role="Employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="apply-leave"
        element={
          <ProtectedRoute role="Employee">
            <ApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="leave-history"
        element={
          <ProtectedRoute role="Employee">
            <LeaveHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="approvals"
        element={
          <ProtectedRoute>
            <LeaveApprovals />
          </ProtectedRoute>
        }
      />

      <Route
        path="admin"
        element={
          <ProtectedRoute role="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/users"
        element={
          <ProtectedRoute role="Admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="reports"
        element={
          <ProtectedRoute role="Admin">
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Fallback for unfinished features linked in Sidebar */}
      <Route path="team-history" element={<Navigate to="/approvals" />} />
    </Routes>
  </Layout>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <LayoutRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
