import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Redirect based on role
    if (user.role === "Admin") return <Navigate to="/admin" />;
    if (user.role === "Manager") return <Navigate to="/approvals" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
