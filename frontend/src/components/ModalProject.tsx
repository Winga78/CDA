import React, { useState } from "react";
import { createProject} from "../services/projectService";
import {addParticipant} from "../services/projectUserService"
import { useUser } from "../services/AuthGuard";
import { UserRole } from "../models/UserRoleEnum";

interface ProjectModalProps {
  show: boolean;
  handleClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ show, handleClose }) => {
  const { user } = useUser();
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await createProject({ name: projectName, description: projectDescription, user_id: user!.email });
      await addParticipant({project_id : data.id !, participant_email : user!.email  , role : UserRole.ADMIN })
      setMessage('Projet créé avec succès !')
      window.location.reload();
    } catch (error) {
      setMessage("Échec de la création du projet");
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
            <button type="button" className="btn btn-outline-dark btn-sm rounded-circle"  onClick={handleClose}>
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
              <button type="submit"  className="btn btn-outline-dark rounded-pill px-4 py-2 m-2 fw-semibold">
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
