import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return isAuthenticated ?  <Navigate to="/accueil" replace /> : children;
};

export default PublicRoute;
