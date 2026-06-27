import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-black text-sm text-gray-400">
    Loading...
  </div>
);

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, tailor, loading } = useContext(AuthContext);

  if (loading) {
    return <PageLoader />;
  }

  const isAuthenticated = !!user || !!tailor;
  const currentRole = user ? "user" : tailor ? "tailor" : null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    return currentRole === "tailor" ? (
      <Navigate to="/tailordahboard" replace />
    ) : (
      <Navigate to="/deshboard" replace />
    );
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, tailor, loading } = useContext(AuthContext);

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to="/deshboard" replace />;
  }

  if (tailor) {
    return <Navigate to="/tailordahboard" replace />;
  }

  return children;
};
