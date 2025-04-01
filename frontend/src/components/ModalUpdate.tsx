import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from "react-bootstrap";
import { getProject, updateProject } from "../services/projectService";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const UpdateModal = ({ user, project_id, show, handleClose }: any) => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
 
  useEffect(() => {
    if (show && project_id) {
      const loadProject = async () => {
        try {
          const data = await getProject(project_id);
          setName(data.name);
          setDescription(data.description);
        } catch (error) {
          setMessage("Impossible de récupérer les données du projet.");
        }
      };
      loadProject();
    }
  }, [show, project_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject(project_id, { user_id: user!.id, description, name });
      handleClose();
      window.location.reload();
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du projet.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <h5 className="modal-title">Modifier le projet</h5>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom du projet</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le nom du projet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Entrez une description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <ModalFooter>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Soumettre
            </Button>
          </ModalFooter>
        </Form>
        {message && <p className="mt-3 text-danger">{message}</p>}
      </ModalBody>
    </Modal>
  );
};

export default UpdateModal;
