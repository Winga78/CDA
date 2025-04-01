import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { deleteProject } from "../services/projectService";
import { useState } from "react";
import {deleteProjectUser} from "../services/projectUserService"

const DeleteModal = ({ user , project_id, show, handleClose}: any) => {
  const [message, setMessage] = useState("");
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deleteProject(project_id);
      await deleteProjectUser(project_id , user?.email!)
      setMessage("Projet supprimé !");
      handleClose();
      window.location.reload();
    } catch (error) {
      setMessage("Échec de l'authentification.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <h5 className="modal-title">Confirmation de suppression</h5>
      </ModalHeader>
      <ModalBody>
        <p>Êtes-vous sûr de vouloir supprimer cette application ? Cette action est irréversible.</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleSubmit}> {/* Appel de handleSubmit ici */}
          Supprimer
        </Button>
        {message && <p className="mt-3">{message}</p>}
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
