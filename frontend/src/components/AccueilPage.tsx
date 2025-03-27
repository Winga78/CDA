import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { lastProjects } from "../services/projectUserService";
import { Project } from "../models/Project";

const AccueilPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await lastProjects();
        setIsLoaded(true);
        if (!data || data.length === 0) {
          setMessage('Aucun projet trouvé');
        } else {
          setProjects(data);
        }
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

  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="d-flex flex-column vh-100">
        <h2>Projets récents</h2>
        {message && <p>{message}</p>}
        <div className="d-flex flex-wrap" style={{ width: '70%' }}>
          {projects.map((project) => (
            <div key={project.id} className="card shadow-sm mb-4" style={{ width: '30%', marginRight: '1%' }}>
              <div className="card-body">
                <h5 className="card-title">{project.name}</h5>
                <Link to={`/project/${project.id}`} className="btn btn-outline-dark">
                  Voir le projet
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default AccueilPage;