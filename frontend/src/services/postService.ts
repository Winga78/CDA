import axios from "axios";
import {Post} from "../models/Post";
import { getUser } from "./authService";

const API_BASE_URL = import.meta.env.VITE_CHAT_SERVICE_URL || '/api/chat';

const chatService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials : true
});

chatService.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const createPost = async(postCreate : Post) : Promise<Post | undefined>=>{
   try{
    const response = await chatService.post<Post>(`/posts/`, postCreate);
     return response.data;
   }catch(error : any){
      console.log('erreur lors de création du post', error)
   }
}

export const findByProjectId = async(project_id : string) : Promise<Post[] | undefined>=>{
   try{
   const response = await chatService.get<Post[]>(`/posts/project/${project_id}`);
   return response.data
   }catch(error :any){
     console.log('erreur lors de la récupération des posts', error.message)
   }
}

export const updatePost = async(post_id : string, updatePost : any) : Promise<Post | undefined>=>{
  try{
  const response = await chatService.patch<Post>(`/posts/${post_id}`, updatePost);
  return response.data
  }catch(error :any){
    console.log('erreur lors de la récupération des posts', error.message)
  }
}

export const test = async(project_id : string)=>{
  const posts = await findByProjectId(project_id)
  let posts_user = []
  if (posts){
      for(let i= 0 ; i<posts?.length ; i++){
          let user = await getUser(posts[i].user_id);
          posts_user.push({user : user, titre : posts[i].titre, description : posts[i].description, post_id : posts[i].id , score : posts[i].score})
      }
  }
  return posts_user
}