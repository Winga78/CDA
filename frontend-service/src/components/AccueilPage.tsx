import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { lastProjects } from "../services/projectUserService";
import { Project } from "../models/Project";
import NotificationSection from './SectionNotification';

const AccueilPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState("");
  const [randomColor, setRandomColor] = useState('');

  
  const colors = [
    { "name": "Noir", "hex": "#000000" },
    { "name": "Gris Foncé", "hex": "#2f2f2f" },
    { "name": "Charcoal", "hex": "#36454f" },
    { "name": "Bleu Nuit", "hex": "#1d2b3a" },
    { "name": "Vert Forêt", "hex": "#0b3d2e" },
    { "name": "Rouge Sombre", "hex": "#8b0000" },
    { "name": "Violet Sombre", "hex": "#4b0082" },
    { "name": "Bleu Marine", "hex": "#000080" },
    { "name": "Gris Anthracite", "hex": "#333333" },
    { "name": "Marron Foncé", "hex": "#3e2723" }
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await lastProjects();
        if (!data || data.length === 0) {
          setMessage('Aucun projet trouvé');
        } else {
          setProjects(data);
        }
      } catch (err: any) {
        setError(err.message || "Une erreur inconnue est survenue");
      }
      finally {
        setIsLoaded(false);
      }
    };

    loadProjects();

    const randomIndex = Math.floor(Math.random() * colors.length);
    setRandomColor(colors[randomIndex].hex);
  }, []);

  if (error) {
    return <div className="alert alert-danger">Erreur : {error}</div>;
  }

  if (isLoaded) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
    <div className="container my-5">
      <h2 className="mb-4">Projets récents</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {projects.map((project) => (
          <div key={project.id} className="col-md-4 mb-4">
            <div 
              className="card shadow-sm h-100"
              style={{ backgroundColor: randomColor }}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-white">{project.name}</h5>
                <Link to={`/project/${project.id}`} className="btn btn-outline-light mt-3">
                  Voir le projet
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <NotificationSection />
 
    </div>
  );

};

export default AccueilPage;