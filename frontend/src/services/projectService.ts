export const fetchLastProjects = async (): Promise<any[]> => {
    try {
      const response = await fetch("/api/projects/last");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des projets");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Une erreur est survenue");
    }
};