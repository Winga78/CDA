import axios from "axios";
import { PostUser } from "../models/PostUser";

const API_BASE_URL = "/api/post-user";

const voteService = axios.create({
  baseURL: API_BASE_URL,
});

voteService.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createVote = async (postUser: PostUser): Promise<PostUser> => {
  try {
    const response = await voteService.post<PostUser>("/", postUser);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors du vote :", error.message);
    throw new Error("Impossible de voter. Veuillez réessayer.");
  }
};

export const getVoteCount = async (postId: string): Promise<number> => {
  try {
    const response = await voteService.get(`/votes/${postId}`);
    return response.data.count;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des votes :", error.message);
    throw new Error("Impossible d'afficher les votes. Veuillez réessayer.");
  }
};

export const deleteVote = async (
  postId: string,
  participantId: string
): Promise<PostUser> => {
  try {
    const response = await voteService.delete(`/vote/${postId}/${participantId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression du vote :", error.message);
    throw new Error("Impossible de supprimer le vote. Veuillez réessayer.");
  }
};

export const checkIfVoted = async (
  postId: string,
  participantId: string
): Promise<PostUser> => {
  try {
    const response = await voteService.get<PostUser>(`/vote/${postId}/${participantId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la vérification du vote :", error.message);
    throw new Error("Impossible de vérifier le vote. Veuillez réessayer.");
  }
};

export const getVoteNotifications = async (): Promise<any> => {
  try {
    const response = await voteService.get("/notification/posts/details");
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw new Error("Impossible de récupérer les notifications. Veuillez réessayer.");
  }
};
