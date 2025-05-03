import { useEffect, useState } from "react";
import { findAllParticipantProject } from "../services/projectUserService";
import { Project } from "../models/Project";
import { Nav, Spinner } from "react-bootstrap";
import { useLocation, Outlet } from "react-router-dom";

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
    <div className="container-fluid mt-0">
      <div className="row">
        <aside className="col-md-3 col-lg-2 bg-light border-end d-flex flex-column p-3 min-vh-100">
          <h5 className="text-center mb-4">Mes projets</h5>
          <Nav className="flex-column">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Nav.Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  active={pathname === `/project/${project.id}`}
                  className={`py-2 px-3 rounded ${
                    pathname === `/project/${project.id}` ? "bg-dark text-white fw-bold" : ""
                  }`}
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
        </aside>
        <main className="col-md-9 col-lg-10 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SectionProject;
