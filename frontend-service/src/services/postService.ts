import axios from "axios";
import { Post } from "../models/Post";
import { getUser } from "./authService";

const API_BASE_URL = "/api/posts";
const chatService = axios.create({
  baseURL: API_BASE_URL,
});

chatService.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = async (post: Post): Promise<Post> => {
  try {
    const response = await chatService.post<Post>("/", post);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création du post :", error.message);
    throw new Error("Impossible de créer le post. Veuillez réessayer.");
  }
};


export const findPostsByProjectId = async (projectId: string): Promise<Post[]> => {
  try {
    const response = await chatService.get<Post[]>(`/project/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des posts :", error.message);
    throw new Error("Impossible de récupérer les posts. Veuillez réessayer.");
  }
};


export const updatePost = async (
  postId: string,
  updateData: Partial<Post>
): Promise<Post> => {
  try {
    const response = await chatService.patch<Post>(`/${postId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du post :", error.message);
    throw new Error("Impossible de mettre à jour le post. Veuillez réessayer.");
  }
};

export const getPostsWithUserInfo = async (projectId: string) => {
  try {
    const posts = await findPostsByProjectId(projectId);
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await getUser(post.user_id);
        return {
          user,
          titre: post.titre,
          description: post.description,
          post_id: post.id,
          modifiedAt: post.modifiedAt,
          score: post.score,
        };
      })
    );

    return enrichedPosts;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des détails des posts :", error.message);
    throw new Error("Impossible de récupérer les posts. Veuillez réessayer.");
  }
};
