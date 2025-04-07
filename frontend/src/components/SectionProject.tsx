import { useEffect, useState } from "react";
import { findAllParticipantProject } from "../services/projectUserService";
import { Project } from "../models/Project";
import { Nav, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const SectionProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

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
    <div className="container-fluid mt-3">
      <div className="row">
        <nav className="col-12 col-md-3 col-lg-2 bg-light p-3 border rounded mb-3 mb-md-0">
          <h5 className="text-center mb-3">Projets</h5>
          <Nav className="flex-column">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Nav.Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  active={pathname === `/project/${project.id}`}
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
        </nav>

        {/* Contenu principal ici */}
        <main className="col">
          {/* Ton contenu à droite peut aller ici */}
        </main>
      </div>
    </div>
  );
};

export default SectionProject;
