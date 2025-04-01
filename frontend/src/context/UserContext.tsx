import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Ajout de l'état de chargement
  login: (token: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Commence à true

  const isTokenValid = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Vérifie si la date d'expiration est dépassée
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && isTokenValid(token)) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.email,
          firstname: decoded.firstname,
          lastname: decoded.lastname,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token invalide :", error);
        logout();
      }
    }else {
      logout();
    }
    setIsLoading(false); // Le chargement est terminé
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    const decoded: any = jwtDecode(token);
    setUser({
      id: decoded.id,
      email: decoded.email,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
    });
    setIsAuthenticated(true);
    setIsLoading(false); // S'assurer que l'état de chargement est à jour
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};