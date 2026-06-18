import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth); // adjust to match your redux slice

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
};

export default PrivateRoute;
