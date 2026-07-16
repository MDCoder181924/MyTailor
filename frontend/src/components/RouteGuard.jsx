import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-black text-sm text-gray-400">
    Loading...
  </div>
);

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, tailor, admin, loading } = useContext(AuthContext);

  if (loading) {
    return <PageLoader />;
  }

  const isAuthenticated = !!user || !!tailor || !!admin;
  const currentRole = user ? "user" : tailor ? "tailor" : admin ? "admin" : null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    if (currentRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return currentRole === "tailor" ? (
      <Navigate to="/tailordahboard" replace />
    ) : (
      <Navigate to="/deshboard" replace />
    );
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, tailor, admin, loading } = useContext(AuthContext);

  if (loading) {
    return <PageLoader />;
  }

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user) {
    return <Navigate to="/deshboard" replace />;
  }

  if (tailor) {
    return <Navigate to="/tailordahboard" replace />;
  }

  return children;
};
