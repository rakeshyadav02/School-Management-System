import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const user = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;