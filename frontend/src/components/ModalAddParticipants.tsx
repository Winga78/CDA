import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from "react-bootstrap";
import { addParticipant } from "../services/projectUserService";
import { useState } from "react";
import { UserRole } from "../models/UserRoleEnum";
import { getUserByEmail } from "../services/authService";

interface ParticipantModalProps {
  project_id: string;
  show: boolean;
  handleClose: () => void;
}

const ParticipantModal = ({ project_id, show, handleClose }: ParticipantModalProps) => {
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("L'email est requis.");
      return;
    }

    try {
      const user = await getUserByEmail(email);
      if (user) {
        const participantRole = role === "admin" ? UserRole.ADMIN : UserRole.USER;
        await addParticipant({
          project_id: Number(project_id),
          participant_id: user._id!,
          role: participantRole,
        });
        handleClose();
        window.location.reload();
      } else {
        setMessage("Utilisateur non trouvé");
      }
    } catch (error: any) {
      setMessage(error.message || "Une erreur inconnue est survenue");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <h5 className="modal-title">Ajouter un participant au projet</h5>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {/* Input email */}
          <Form.Group className="mb-3">
            <Form.Label>Adresse Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez l'adresse email de l'utilisateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Input role */}
          <Form.Group className="mb-3">
            <Form.Label>Rôle</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </Form.Control>
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

export default ParticipantModal;