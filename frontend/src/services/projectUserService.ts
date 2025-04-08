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
      if (typeof projectId === 'number') {
        const project = await projectServiceRes(projectId);
        list_last_project.push(project);
      } else {
        console.error(`Id invalide pour le projet à l'index ${i}:`, projectId);
      }
    }
    return list_last_project;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des projets :", error.message);
    throw new Error("Impossible de récupérer les projets. Veuillez réessayer.");
  }
};

export const addParticipant = async(project_user : ProjectUser)=>{
  try {
    const response = await projectService.post<ProjectUser>(`/project-user` , project_user);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de l'ajout des participants :", error.message);
    throw new Error("Impossible d'ajouter un participant au projet. Veuillez réessayer.");
  }
}

export const deleteProjectUser = async(id : number , user_id: string)=>{
  try {
    const response = await projectService.delete<ProjectUser>(`/project-user/${id}/${user_id}`);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de la suppression des participants :", error.message);
    throw new Error("Impossible de supprimer un participant du projet. Veuillez réessayer.");
  }
}

export const findAllParticipantProject = async()=>{
  try {
    const projects = await projectService.get<ProjectUser[]>('/project-user/projects');
    
    let list_last_project: Project[] = [];

    for (let i = 0; i < projects.data.length; i++) {
      const projectId = projects.data[i].project_id;
      if (typeof projectId === 'number') {
        const project = await projectServiceRes(projectId);
        list_last_project.push(project);
      } else {
        console.warn(`Id invalide pour le projet à l'index ${i}:`, projectId);
      }
    }
    
    return list_last_project;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des participants :", error.message);
    throw new Error("Impossible d'afficher les participants du projet. Veuillez réessayer.");
  }
}

export const findParticipant = async(id : string)=>{
  try{
    const response = await projectService.get<ProjectUser[]>(`/project-user/users/${id}`);
    if(response.data)
     return response.data;
  }catch(error: any){
    console.error("Erreur lors de la récupération des participants :", error.message);
    throw new Error("Impossible d'afficher les participants. Veuillez réessayer.");
  }
}