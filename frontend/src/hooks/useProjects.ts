import { useState, useEffect } from "react";
import { fetchLastProjects } from "../services/projectService";
import { Project } from "../models/Project";

const useProjects = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchLastProjects();
        setIsLoaded(true);
        setProjects(data);
      } catch (error) {
        if (error instanceof Error) {
          setIsLoaded(true);
          setError(error.message); 
        } else {
          setError("Une erreur inconnue est survenue"); 
        }
      }
    };

    loadProjects();
  }, []);

  return { projects, error , isLoaded };
};

export default useProjects;
