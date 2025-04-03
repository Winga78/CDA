import axios from "axios";
import {PostUser} from "../models/PostUser";

const API_BASE_URL = import.meta.env.VITE_PROJECT_USER_POST_SERVICE_URL || '/api/post-user';

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
      console.error("Erreur lors du vote :", error.response?.data || error.message);
      throw error;
    }
};


export const getVote = async (post_id: string) => {
    try {
      const response = await voteService.get(`/post-user/${post_id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors du vote :", error.response?.data || error.message);
      throw error;
    }
};

export const DeleteVote = async (post_id : string, participant_id : string): Promise<PostUser> => {
    try {
      const response = await voteService.delete(`/post-user/${post_id}/${participant_id}`);
      return response.data;
    } catch (error :any) {
      console.error("Erreur lors du vote :", error.response?.data || error.message);
      throw error;
    }
};

export const checkIfVoted = async (post_id : string, participant_id : string): Promise<PostUser> => {
  try {
    const response = await voteService.get<PostUser>(`/post-user/${post_id}/${participant_id}`);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors du vote :", error.response?.data || error.message);
    throw error;
  }
};