import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ isLoading }) => {
  const user = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
