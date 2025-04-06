import { useState } from "react";
import { createProject } from "../services/projectService";
import { addParticipant } from "../services/projectUserService";
import { UserRole } from "../models/UserRoleEnum";

interface ProjectModalProps {
  show: boolean;
  handleClose: () => void;
  user: any;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ user, show, handleClose }) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const project = await createProject({ name: projectName, description: projectDescription, user_id: user.email });
      if (project && project.id && project.user_id) {
        await addParticipant({
          project_id: project.id,
          participant_id: project.user_id,
          role: UserRole.ADMIN
        });
      }else {
        throw new Error("Le projet créé ne contient pas d'id ou d'utilisateur valide.");
      }
      setMessage('Projet créé avec succès !');
      handleClose();
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || "Une erreur inconnue est survenue");
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      id="projectModal"
      tabIndex={-1}
      aria-labelledby="projectModalLabel"
      aria-hidden={!show}
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title" id="projectModalLabel">Créer un projet</h5>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm rounded-circle"
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="projectName" className="form-label">
                  Nom du projet
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 border-dark"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="projectDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control rounded-3 border-dark"
                  id="projectDescription"
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-outline-dark rounded-pill px-4 py-2 m-2 fw-semibold">
                Soumettre
              </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;