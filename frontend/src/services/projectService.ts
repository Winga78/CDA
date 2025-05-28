import axios from "axios";
import { Project } from "../models/Project";

const isDev = import.meta.env.MODE === "development";

const API_BASE_URL = isDev ? "/api/projects" :  import.meta.env.VITE_PROJECT_SERVICE_URL;

const projectService = axios.create({
  baseURL: API_BASE_URL,
});

projectService.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProject = async (id: string | number): Promise<Project> => {
  try {
    const response = await projectService.get<Project>(`/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du projet :", error.message);
    throw new Error("Impossible de récupérer le projet. Veuillez réessayer.");
  }
};

export const projectServiceRes = getProject;

export const createProject = async (project: Project): Promise<Project> => {
  try {
    const response = await projectService.post<Project>("/", project);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création du projet :", error.message);
    throw new Error("Impossible de créer un projet. Veuillez réessayer.");
  }
};

export const getUserProjects = async (): Promise<Project[]> => {
  try {
    const response = await projectService.get<Project[]>("/user");
    console.log("Données reçues du backend :", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des projets utilisateur :", error.message);
    throw new Error("Impossible de récupérer les projets. Veuillez réessayer.");
  }
};

export const deleteProject = async (id: number): Promise<Project> => {
  try {
    const response = await projectService.delete<Project>(`/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression du projet :", error.message);
    throw new Error("Impossible de supprimer le projet. Veuillez réessayer.");
  }
};

export const updateProject = async (
  id: string | number,
  projectUpdate: Project
): Promise<Project> => {
  try {
    const response = await projectService.patch<Project>(`/${id}`, projectUpdate);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du projet :", error.message);
    throw new Error("Impossible de mettre à jour le projet. Veuillez réessayer.");
  }
};
