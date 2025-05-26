// components/ChatMessageModal.tsx
import { Modal, Button, Form } from "react-bootstrap";

interface ChatMessageModalProps {
  show: boolean;
  handleClose: () => void;
  titre: string;
  message: string;
  onTitreChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSend: () => void;
}

const ChatMessageModal = ({
  show,
  handleClose,
  titre,
  message,
  onTitreChange,
  onMessageChange,
  onSend,
}: ChatMessageModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={titre}
              onChange={(e) => onTitreChange(e.target.value)}
              placeholder="Titre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Message"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="dark" onClick={() => {
          onSend();
          handleClose();
        }}>
          Envoyer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatMessageModal;
