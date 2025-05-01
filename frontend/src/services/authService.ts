import axios from "axios";
import { User } from "../models/User";

const API_AUTH_BASE_URL = "/api/auth";
const API_USER_BASE_URL = "/api/users";

const authService = axios.create({
  baseURL: API_AUTH_BASE_URL,
});

const userService = axios.create({
  baseURL: API_USER_BASE_URL,
});

const attachToken = (config: any) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authService.interceptors.request.use(attachToken);
userService.interceptors.request.use(attachToken);

export const login = async (email: string, password: string) => {
  try {
    const response = await authService.post("/login", { email, password });
    return response.data.access_token;
  } catch (error: any) {
    console.error("Erreur lors de la connexion :", error);
    throw new Error("Impossible de se connecter. Veuillez réessayer.");
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await authService.get("/profile");
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil :", error.message);
    throw new Error("Impossible de récupérer le profil. Veuillez réessayer.");
  }
};

export const signUp = async (userData: User): Promise<User> => {
  try {
    const response = await userService.post("/", userData);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'inscription :", error.message);
    throw new Error("Impossible de s'inscrire. Veuillez réessayer.");
  }
};

export const updateUser = async (user: any) => {
  try {
    const response = await userService.patch("/", user);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil :", error.message);
    throw new Error("Impossible de mettre à jour le profil. Veuillez réessayer.");
  }
};

export const deleteUser = async (): Promise<User> => {
  try {
    const response = await userService.delete("/");
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression du profil :", error.message);
    throw new Error("Impossible de supprimer le profil. Veuillez réessayer.");
  }
};

export const getUser = async (id: string): Promise<User> => {
  try {
    const response = await userService.get(`/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil :", error.message);
    throw new Error("Impossible de récupérer le profil. Veuillez réessayer.");
  }
};

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const response = await userService.get(`/other/${email}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil par email :", error.message);
    throw new Error("Impossible de récupérer le profil. Veuillez réessayer.");
  }
};