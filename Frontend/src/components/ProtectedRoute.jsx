import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, initialized } = useAuth();
  const location = useLocation();

  // Wait until auth is initialized (localStorage read) before redirecting.
  if (!initialized) return null; // or a spinner component
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;