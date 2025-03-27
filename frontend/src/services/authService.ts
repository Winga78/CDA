import axios from "axios";
import {User} from "../models/User"

const API_BASE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || '/api/auth';

const authService = axios.create({
  baseURL: API_BASE_URL,
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

export const login = async(email: string , password : string)=>{
    try {
        const response = await authService.post(`/auth/login`, {
          email ,
          password ,
        });
  
        const token = response.data.access_token;
        localStorage.setItem("authToken", token); // Stocker le token
        alert("Connexion réussie !");
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Échec de l'authentification.");
      }
}