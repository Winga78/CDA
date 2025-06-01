import axios from "axios";
import { Project } from "../models/Project";
import { ProjectUser } from "../models/ProjectUser";
import { projectServiceRes } from "./projectService";

const API_BASE_URL = "/api/project-user";

const projectUserService = axios.create({
  baseURL: API_BASE_URL,
});

projectUserService.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mapProjectUsersToProjects = async (projectUsers: ProjectUser[]): Promise<Project[]> => {
  const projects: Project[] = [];

  for (const item of projectUsers) {
    if (typeof item.project_id === "number") {
      const project = await projectServiceRes(item.project_id);
      projects.push(project);
    } else {
      console.warn("ID de projet invalide :", item.project_id);
    }
  }

  return projects;
};

export const lastProjects = async (): Promise<Project[]> => {
  try {
    const response = await projectUserService.get<ProjectUser[]>("/last");
    const data= await mapProjectUsersToProjects(response.data);
    return data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des projets :", error.message);
    throw new Error("Impossible de récupérer les projets. Veuillez réessayer.");
  }
};


export const addParticipant = async (projectUser: ProjectUser): Promise<ProjectUser> => {
  try {
    const response = await projectUserService.post<ProjectUser>("/", projectUser);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du participant :", error.message);
    throw new Error("Impossible d'ajouter un participant au projet. Veuillez réessayer.");
  }
};


export const deleteProjectUser = async (projectId: number, userId: string): Promise<ProjectUser> => {
  try {
    const response = await projectUserService.delete<ProjectUser>(`/${projectId}/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression du participant :", error.message);
    throw new Error("Impossible de supprimer un participant du projet. Veuillez réessayer.");
  }
};


export const findAllParticipantProject = async (): Promise<Project[]> => {
  try {
    const response = await projectUserService.get<ProjectUser[]>("/projects");
    return await mapProjectUsersToProjects(response.data);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des projets participants :", error);
    throw new Error("Impossible d'afficher les participants du projet. Veuillez réessayer.");
  }
};

export const findParticipant = async (projectId: string): Promise<ProjectUser[]> => {
  try {
    const response = await projectUserService.get<ProjectUser[]>(`/users/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des participants :", error.message);
    throw new Error("Impossible d'afficher les participants. Veuillez réessayer.");
  }
};
