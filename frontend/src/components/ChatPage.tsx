import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import SectionParticipant from "./SectionParticipant";
import { getProject } from "../services/projectService";
import { Project } from "../models/Project";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import { io, Socket } from 'socket.io-client';
import ParticipantModal from "../components/ModalAddParticipants";
import { postsList , api_chat_url} from '../services/postService';
import SectionVote from './SectionVote';
import { formatModifiedDate } from "../utils/dateUtils";
import { api_auth_url} from "../services/authService";

const ChatPage = () => {
    const { id } = useParams();
    const { user } = useUser();
    const [project, setProject] = useState<Project | null>(null);
    const [showModalAddParticipant, setShowModalAddParticipant] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [titre, setTitre] = useState('');
    const [room, setRoom] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const avatarUrl = `${api_auth_url}`;

    if (!id) return null;

    const loadPosts = async () => {
        try {
          const posts = await postsList(id);
          if (Array.isArray(posts)) {
            setMessages(posts);  
          } else {
            setMessages([]); 
          }
        } catch (error: any) {
          setError(error?.message || "Une erreur inconnue est survenue");
        } finally {
          setIsLoading(false); 
        }
      };

    useEffect(() => {
        if (!id) return;

        setRoom(id);
        socketRef.current = io(api_chat_url);
        const socket = socketRef.current;

        socket.emit('joinRoom', id);

        const loadProject = async () => {
            try {
                const storedProject = await getProject(id);
                if (storedProject)
                    setProject(storedProject);
            } catch (error: any ) {
                setError(error.message || "Une erreur inconnue est survenue")
            }
        };

        loadProject();
        loadPosts();

        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
          
        return () => {
            if (socketRef.current) {
                socketRef.current.off("message");
                socketRef.current.emit("leaveRoom", id);
                socketRef.current.disconnect();
            }
        };
    }, [id]);

    const sendMessage = () => {
        if (!message.trim() || !titre.trim() || !user || !socketRef.current) return;
        socketRef.current.emit('message', { room, user, titre, message });
        setMessage('');
        setTitre('');
    };

    if (error) {
        return <div className="alert alert-danger">Erreur : {error}</div>;
    }

    if (isLoading) {
        <p>Chargement des messages...</p>
    }

    return (
        <Container className="mt-4">
          <h1 className="text-center mb-2">{project?.name}</h1>
          <h3 className="text-center mb-4 text-muted">{project?.description}</h3>
    
          <div className="d-flex flex-column align-items-end">
            <Button
              variant="dark"
              className="rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{ width: "40px", height: "40px" }}
              onClick={() => setShowModalAddParticipant(true)}
            >
              <BsPlus size={24} />
            </Button>
            <SectionParticipant />
          </div>
    
          <ParticipantModal
            project_id={id}
            show={showModalAddParticipant}
            handleClose={() => setShowModalAddParticipant(false)}
          />
    
          <div>
            <h2>Chat en temps réel</h2>
    
           <div>
  {messages.length === 0 ? (
    <p>Aucune discussion</p>
  ) : (
    messages.map((msg) => (
      <div key={msg.post_id} className="mb-3 d-flex justify-content-between align-items-start">
  {/* Colonne message */}
  <Alert variant="light" className="flex-grow-1 me-3">
    <div className="d-flex align-items-center mb-2">
      <img
        src={`${avatarUrl}/${msg.user.avatar}` || "https://via.placeholder.com/40"}
        alt={`${msg.user.firstname} ${msg.user.lastname}`}
        className="rounded-circle me-2"
        style={{ width: "40px", height: "40px", objectFit: "cover" }}
      />
      <strong>
        {msg.user.firstname} {msg.user.lastname}
      </strong>
      <em className="text-muted" style={{ marginLeft: "10px" }}>
  {formatModifiedDate(msg.modifiedAt)}
</em>
    </div>
    <div>
      <strong>{msg.titre}</strong>
      <p className="mb-0">{msg.description}</p>
    </div>
  </Alert>

  {/* Colonne vote */}
  <div style={{ minWidth: "100px" }}>
    <SectionVote userId={user!.id} postId={msg.post_id} onVoteChange={loadPosts} />
  </div>
</div>
    ))
  )}
</div>

            {error && <Alert variant="danger">{error}</Alert>}
    
            <Form>
              <Form.Group className="mb-3" controlId="formTitre">
                <Form.Control
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Écris un titre..."
                />
              </Form.Group>
    
              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écris un message..."
                />
              </Form.Group>
    
              <Button className="btn btn-dark text-light rounded-pill px-4 py-2 m-2 fw-semibold w-15" onClick={sendMessage}>
                Envoyer
              </Button>
            </Form>
          </div>
        </Container>
      );
};

export default ChatPage;
