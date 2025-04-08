import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isTokenValid = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && isTokenValid(token)) {
      try {
        const decoded: any = jwtDecode(token);
        setUserState({
          id: decoded.id,
          email: decoded.email,
          firstname: decoded.firstname,
          lastname: decoded.lastname,
          avatar: decoded.avatar,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token invalide :", error);
        logout();
      }
    } else {
      logout();
    }
    setIsLoading(false); // Le chargement est terminé
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    const decoded: any = jwtDecode(token);
    setUserState({
      id: decoded.id,
      email: decoded.email,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      avatar: decoded.avatar,
    });
    setIsAuthenticated(true);
    setIsLoading(false); // S'assurer que l'état de chargement est à jour
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUserState(null);
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
