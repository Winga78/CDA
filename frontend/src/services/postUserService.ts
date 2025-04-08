import axios from "axios";
import {PostUser} from "../models/PostUser";

const API_BASE_URL = import.meta.env.VITE_PROJECT_USER_POST_SERVICE_URL || '/api/post-user';
export const api_project_post_user_url = import.meta.env.PROJECT_USER_POST_DOCKER_URL || "http://192.168.58.161:3003";

const voteService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials : true
});

voteService.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createVote = async (postUser : PostUser): Promise<PostUser> => {
    try {
      const response = await voteService.post<PostUser>(`/post-user/`, postUser);
      return response.data;
    } catch (error :any) {
      console.error("Erreur lors du vote :", error.message);
      throw new Error("Impossible de voter. Veuillez réessayer.");
    }
};


export const getVote = async (post_id: string) => {
    try {
      const response = await voteService.get(`/post-user/votes/${post_id}`);
      return response.data.count;
    } catch (error: any) {
      console.error("Erreur lors du vote :", error.message);
      throw new Error("Impossible d'afficher les votes. Veuillez réessayer.");
    }
};

export const DeleteVote = async (post_id : string, participant_id : string): Promise<PostUser> => {
    try {
      const response = await voteService.delete(`/post-user/vote/${post_id}/${participant_id}`);
      return response.data;
    } catch (error :any) {
      console.error("Erreur lors du vote :", error.message);
      throw new Error("Impossible de supprimer les votes. Veuillez réessayer.");
    }
};

export const checkIfVoted = async (post_id : string, participant_id : string): Promise<PostUser> => {
  try {
    const response = await voteService.get<PostUser>(`/post-user/vote/${post_id}/${participant_id}`);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors du vote :", error.message);
    throw new Error("Impossible de récupérer le status des votes. Veuillez réessayer.");
  }
};

export const notificationPost= async()=>{
  try{
    const response = await voteService.get(`/post-user/notification/posts/details`);
    return response.data
  }catch(error : any){
    console.error("Erreur lors de la récupération des votes :", error.message);
    throw new Error("Impossible de récupérer des notifications. Veuillez réessayer.");
  }
}