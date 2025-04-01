import axios from "axios";
import {Project} from "../models/Project";
import {projectServiceRes} from "../services/projectService"
import { ProjectUser } from "../models/ProjectUser";

const API_BASE_URL = import.meta.env.VITE_PROJECT_USER_POST_SERVICE_URL || '/api/project-user';

const projectService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials : true
});

projectService.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const lastProjects = async (): Promise<Project[]> => {
  try {
    const projects = await projectService.get<ProjectUser[]>('/project-user/last');
    
    let list_last_project: Project[] = [];

    for (let i = 0; i < projects.data.length; i++) {
      const projectId = projects.data[i].project_id;
      if (typeof projectId === 'number') { // Vérifier que l'id est bien un nombre
        const project = await projectServiceRes(projectId);
        list_last_project.push(project);
      } else {
        console.warn(`Id invalide pour le projet à l'index ${i}:`, projectId);
      }
    }
    
    return list_last_project;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des projets :", error.response?.data || error.message);
    throw error;
  }
};

export const addParticipant = async(project_user : ProjectUser)=>{
  try {
    const response = await projectService.post<ProjectUser>(`/project-user` , project_user);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.response?.data || error.message);
    throw error;
  }
}

export const deleteProjectUser = async(id : number , user_email : string)=>{
  try {
    const response = await projectService.delete<ProjectUser>(`/project-user/${id}`, { data: { email: user_email } });
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.response?.data || error.message);
    throw error;
  }
}

export const findAllParticipantProject = async()=>{
  try {
    const projects = await projectService.get<ProjectUser[]>('/project-user/projects');
    
    let list_last_project: Project[] = [];

    for (let i = 0; i < projects.data.length; i++) {
      const projectId = projects.data[i].project_id;
      if (typeof projectId === 'number') { // Vérifier que l'id est bien un nombre
        const project = await projectServiceRes(projectId);
        list_last_project.push(project);
      } else {
        console.warn(`Id invalide pour le projet à l'index ${i}:`, projectId);
      }
    }
    
    return list_last_project;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des projets :", error.response?.data || error.message);
    throw error;
  }
}

export const findParticipant = async(id : string)=>{
  try{
    const response = await projectService.get<ProjectUser[]>(`/project-user/users/${id}`);
    if(response.data)
     return response.data;
  }catch(error: any){
    console.error("Erreur lors de la récupération des participants :", error.response?.data || error.message);
  }
}