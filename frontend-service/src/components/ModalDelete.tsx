import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { deleteProject } from "../services/projectService";
import { useState } from "react";
import { deleteProjectUser } from "../services/projectUserService";

interface DeleteModalProps {
  user: { id: string };
  project_id: number;
  show: boolean;
  handleClose: () => void;
}

const DeleteModal = ({ user, project_id, show, handleClose }: DeleteModalProps) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await deleteProject(project_id);
      await deleteProjectUser(project_id, user.id);
      //suppression des posts et des votes
      setMessage("Projet supprimé !");
      handleClose();
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || "Une erreur inconnue est survenue");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <h5 className="modal-title">Confirmation de suppression</h5>
      </ModalHeader>
      <ModalBody>
        <p>Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Supprimer
        </Button>
      </ModalFooter>
      {message && <p className="mt-3">{message}</p>}
    </Modal>
  );
};

export default DeleteModal;
