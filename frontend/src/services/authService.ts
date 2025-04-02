import axios from "axios";
import {User} from "../models/User"

const API_BASE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || '/api/auth';

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
    console.error("Erreur lors de l'inscription :", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await authService.post(`/auth/login`, { email, password });
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

export const getProfile= async() : Promise<User | undefined> =>{
  try {
      const response = await authService.get(`/auth/profile`);
     return response.data
    } catch (error : any) {
      console.error("Erreur lors de la récupération du profile :", error.message);
    }
}


export const updateUser= async(user : User) =>{
  try {
      const response = await authService.patch(`/users/`,{
         user
      });
     return response.data
    } catch (error:any) {
      console.error("Erreur lors de la mise à jour du profile :", error);
    }
}


export const deleteUser= async() : Promise<User | undefined> =>{
  try {
      const response = await authService.delete(`/users/`);
     return response.data
    } catch (error) {
      console.error("Erreur lors de la suppression du profile :", error);
    }
}

export const getUser= async(id: string) : Promise<User | undefined>=>{
  try {
      const response = await authService.get(`/users/${id}`);
     return response.data
    } catch (error : any) {
      console.error("Erreur lors de la récupération du profile :", error.message);
    }
}

export const getUserByEmail = async(email : string) : Promise<User | undefined> => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await authService.get(`/users/other/${encodedEmail}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil :", error.message);
  }
}
