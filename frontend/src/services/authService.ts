import axios from "axios";
import {User} from "../models/User"

const API_BASE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || '/api/auth';
export const api_auth_url = import.meta.env.AUTH_DOCKER_URL || "http://192.168.58.161:3000";
const authService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials : true
});

authService.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (userData : User) : Promise<User>=> {
  try {
    const response = await authService.post<User>(`/users/`, userData);
    return response.data;
  } catch (error:any) {
    console.error("Erreur lors de l'inscription :", error.message);
    throw new Error("Impossible de s'inscrire. Veuillez réessayer.");
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await authService.post(`/auth/login`, { email, password });
    const token = response.data.access_token;
    return token;
  } catch (error : any) {
    console.error("Erreur lors de la connexion :", error.message);
    throw new Error("Impossible de se connecter. Veuillez réessayer.");
  }
};

export const getProfile= async() : Promise<User | undefined> =>{
  try {
      const response = await authService.get(`/auth/profile`);
     return response.data
    } catch (error : any) {
      console.error("Erreur lors de la récupération du profile :", error.message);
      throw new Error("Impossible de récupérer le profil. Veuillez réessayer.");
    }
}


export const updateUser= async(user: any) =>{
  try {
    console.log(user)
      const response = await authService.patch(`/users/`,
        user
      );
     return response.data
    } catch (error:any) {
      console.error("Erreur lors de la mise à jour du profile :", error);
      throw new Error("Impossible de mettre à jour le profil. Veuillez réessayer.");
    }
}


export const deleteUser= async() : Promise<User | undefined> =>{
  try {
      const response = await authService.delete(`/users/`);
     return response.data
    } catch (error) {
      console.error("Erreur lors de la suppression du profile :", error);
      throw new Error("Impossible de supprimer le profil. Veuillez réessayer.");
    }
}

export const getUser= async(id: string) : Promise<User | undefined>=>{
  try {
      const response = await authService.get(`/users/${id}`);
     return response.data
    } catch (error : any) {
      console.error("Erreur lors de la récupération du profile :", error.message);
      throw new Error("Impossible de récupérer le profil. Veuillez réessayer.");
    }
}

export const getUserByEmail = async(email : string) : Promise<User | undefined> => {
  try {
    const response = await authService.get(`/users/other/${email}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil :", error.message);
    throw new Error("Impossible de récupérer le profil. Veuillez réessayer.");
  }
}
