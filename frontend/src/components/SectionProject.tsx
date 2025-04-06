import { useEffect, useState } from "react";
import { findAllParticipantProject } from "../services/projectUserService";
import { Project } from "../models/Project";
import { Nav, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom"; // Pour gérer l'active link

const SectionProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Pour gérer le chargement

  const { pathname } = useLocation(); // Pour identifier le projet actif

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await findAllParticipantProject();
        setProjects(data);
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, []);

  if (loading) {
    return <Spinner animation="border" role="status" className="d-block mx-auto mt-5" />;
  }

  if (error) {
    return <div className="alert alert-danger">Erreur : {error}</div>;
  }

  return (
    <div className="d-flex flex-grow-1">
      {/* Navbar latérale */}
      <div
        className="border-end p-3"
        style={{
          width: "250px",
          position: "fixed", // Pour positionner la barre latérale de manière fixe
          top: "0",
          left: "0",
          bottom: "0",
          backgroundColor: "#f8f9fa",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h5 className="text-center mb-4">Projets</h5>
        <Nav className="flex-column">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Nav.Link
                key={project.id}
                href={`/project/${project.id}`}
                active={pathname === `/project/${project.id}`} // Lien actif pour le projet en cours
                style={{
                  fontWeight: pathname === `/project/${project.id}` ? "bold" : "normal",
                  color: pathname === `/project/${project.id}` ? "#007bff" : "inherit",
                }}
              >
                {project.name}
              </Nav.Link>
            ))
          ) : (
            <Nav.Item>
              <Nav.Link disabled>Aucun projet trouvé</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default SectionProject;
