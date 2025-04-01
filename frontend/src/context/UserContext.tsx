// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// type User = {
//   id: string;
//   firstname: string;
//   lastname: string;
//   email: string;
// };

// type UserContextType = {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       try {
//         const decoded: any = jwtDecode(token);
//         setUser({
//           id: decoded.id,
//           email: decoded.email,
//           firstname: decoded.firstname,
//           lastname: decoded.lastname,
//         });
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error("Token invalide :", error);
//         logout();
//       }
//     }
//   }, []);

//   const login = (token: string) => {
//     localStorage.setItem("authToken", token);
//     const decoded: any = jwtDecode(token);
//     setUser({
//       id: decoded.id,
//       email: decoded.email,
//       firstname: decoded.firstname,
//       lastname: decoded.lastname,
//     });
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <UserContext.Provider value={{ user, isAuthenticated, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };