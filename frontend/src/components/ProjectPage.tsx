import { useState, useEffect } from "react";
import ProjectModal from "./ModalProject";
import DeleteModal from "./ModalDelete";
import UpdateModal from "./ModalUpdate";
import { getUserProjects } from "../services/projectService";
import { Project } from "../models/Project";
import { Button } from "react-bootstrap";
import { formatDate } from "../utils/dateUtils";
import { useUser } from "../context/UserContext";

const ProjectPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useUser();

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleShowModal = () => {
    setIsModalVisible(true);
  };

  const handleShowModalDelete = () => setShowModalDelete(true);
  const handleCloseModalDelete = () => setShowModalDelete(false);

  const handleShowModalUpdate = () => setShowModalUpdate(true);
  const handleCloseModalUpdate = () => setShowModalUpdate(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getUserProjects();
        setIsLoaded(true);
        setProjects(data);
      } catch (error : any) {
          setError(error.message ||"Une erreur inconnue est survenue" )
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex justify-content-center mt-4">
        <button
          type="button"
          className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold"
          onClick={handleShowModal}
        >
          Nouveau
        </button>
      </div>
      <ProjectModal user={user} show={isModalVisible} handleClose={handleCloseModal} />
      <div>
        {error ? (
          <div>Error: {error}</div>
        ) : !isLoaded ? (
          <div>Chargement...</div>
        ) : (
          <div className="container mt-4">
            <div className="row">
              {projects.map((project) => (
                <div key={project.id} className="col-md-4 mb-4">
                  <div
                    className="card shadow-sm"
                    style={{
                      borderRadius: "35px",
                      border: "2px solid black",
                    }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">{project.description}</p>
                      <p className="card-text text-muted small">
                        Modifié: {project.modifiedAt ? formatDate(project.modifiedAt) : "Date inconnue"}
                      </p>
                      <Button
                        className="btn btn-dark text-light rounded-pill px-4 py-2 m-2 fw-semibold w-50"
                        onClick={handleShowModalUpdate}
                      >
                        Mettre à jour
                      </Button>
                      <UpdateModal
                        user={user}
                        project_id={(project.id)!.toString()}
                        show={showModalUpdate}
                        handleClose={handleCloseModalUpdate}
                      />
                      <Button
                        className="btn btn-light text-dark rounded-pill px-4 py-2 m-2 fw-semibold w-70"
                        onClick={handleShowModalDelete}
                      >
                        Supprimer
                      </Button>
                      <DeleteModal
                        user={user!}
                        project_id={project.id!}
                        show={showModalDelete}
                        handleClose={handleCloseModalDelete}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
