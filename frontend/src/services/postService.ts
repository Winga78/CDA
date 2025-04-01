import axios from "axios";
import {Post} from "../models/Post";
import { getVote } from "./postUserService";

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

export const createPost= async()=>{

}

export const voteByOrderVote = async(allPosts : Post[])=>{
  try{
    let postswithVote :any= []
    for(let i= 0 ; i < allPosts.length; i++){
        const postId = allPosts[i].id;
        if (postId){
            const {count } = await getVote(postId);
                 postswithVote.push({post_id : postId , vote : count , description : allPosts[i].description, titre : allPosts[i].titre, modifiedAt : allPosts[i].modifiedAt })
        }
    }
    postswithVote.sort((a :any, b:any) => a.vote - b.vote);
    return postswithVote;
  }catch(error:any){
    console.log('erreur lors de la récupération des posts et votes', error.message)
  }
}