import axios from "axios";
import {Project} from "../models/Project";

const API_BASE_URL = import.meta.env.VITE_PROJECT_SERVICE_URL || '/api/projects';

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

export const projectServiceRes = async (project_id : number): Promise<Project> => {
    try {
      const response = await projectService.get<Project>(`/projects/${project_id}`);
      return response.data;
    } catch (error :any) {
      console.error("Erreur lors de la récupération du projet :", error.message);
      throw new Error("Impossible de récupérer les projets. Veuillez réessayer.");
    }
};

export const createProject = async(project : Project) : Promise<Project> => {
  try {
    const response = await projectService.post<Project>(`/projects/`, project);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.message);
    throw new Error("Impossible de créer un projet. Veuillez réessayer.");
  }
}

export const getUserProject = async() : Promise<Project[]> => {
  try {
    const response = await projectService.get<Project[]>(`/projects/user`);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.message);
    throw new Error("Impossible de récupérer les projets . Veuillez réessayer.");
  }
}


export const deleteProject = async(id : number) => {
  try {
    const response = await projectService.delete<Project>(`/projects/${id}`);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.message);
    throw new Error("Impossible de supprimer un projet. Veuillez réessayer.");
  }
}

export const updateProject = async(id : string , projectUpdate : Project)=>{
  try {
    const response = await projectService.patch<Project>(`/projects/${id}`, projectUpdate);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.message);
    throw new Error("Impossible de mettre à jour un projet. Veuillez réessayer.");
  }
}

export const getProject = async(id : string)=>{
  try {
    const response = await projectService.get<Project>(`/projects/${id}`);
    return response.data;
  } catch (error :any) {
    console.error("Erreur lors de création du projet :", error.message);
    throw new Error("Impossible de récupérer le projet. Veuillez réessayer.");
  }
}