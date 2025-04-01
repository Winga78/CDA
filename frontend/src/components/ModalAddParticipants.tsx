import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from "react-bootstrap";
import {addParticipant} from "../services/projectUserService"
import { useState } from "react";
import { UserRole } from "../models/UserRoleEnum";
import { getUserByEmail } from "../services/authService";

const ParticipantModal = ({ project_id, show, handleClose }: any) => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("L'email est requis.");
      return;
    }
    await getUserByEmail(email).then(async(user)=>{
        try {
          if(role === "admin" && user)
            
            await addParticipant({project_id : Number(project_id) , participant_id : user._id! , role: UserRole.ADMIN});
           else if(role === "user" && user)
            await addParticipant({project_id : Number(project_id) , participant_id : user._id! , role: UserRole.USER});
           handleClose();
           window.location.reload();
         } catch (error) {
           setMessage("Erreur lors de la mise à jour du projet.");
         }
        
      }).catch((error)=>{
          console.log(error)
          setMessage("Utilisateur non trouvé")
      })
      
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <h5 className="modal-title">Modifier le projet</h5>
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
