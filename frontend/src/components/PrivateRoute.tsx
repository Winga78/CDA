import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ReactNode } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  console.log("Chargement:", isLoading, " | Authentifié:", isAuthenticated);

  if (isLoading) {
    return <div>Chargement...</div>; // Affichage temporaire pour éviter la redirection
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
