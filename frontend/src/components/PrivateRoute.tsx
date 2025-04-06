import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ReactNode } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
