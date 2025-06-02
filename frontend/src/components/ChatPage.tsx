import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import SectionParticipant from "./SectionParticipant";
import { getProject } from "../services/projectService";
import { Project } from "../models/Project";
import {Alert, Button } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { io, Socket } from 'socket.io-client';
import ParticipantModal from "./ModalAddParticipants";
import { getPostsWithUserInfo} from '../services/postService';
import SectionVote from './SectionVote';
import { formatDate } from "../utils/dateUtils";
import { BsPlus } from 'react-icons/bs';
import ChatMessageModal from './ChatMessageModal';
import { CiUser } from "react-icons/ci";
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
    const [showModalMessage, setShowModalMessage] = useState(false);
    
    if (!id) return null;

    const loadPosts = async () => {
        try {
          const posts = await getPostsWithUserInfo(id);
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

        const socketPath = '/chat/socket.io';

        setRoom(id);
        socketRef.current = io('', {
          path: socketPath,
          transports: ['websocket'],
        });
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
    <div className="container-fluid vh-100 d-flex p-0">
         <main className="flex-grow-1 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                 <h1 className="h4 m-0">{project?.name}</h1> 
                 <Button className="btn btn-dark rounded-pill px-4 mt-3" onClick={() => setShowModalMessage(true)}>
                  <BsPlus className="me-1" /> Ajouter un message
                 </Button>
                <ChatMessageModal
                      show={showModalMessage}
                      handleClose={() => setShowModalMessage(false)}
                      titre={titre}
                      message={message}
                      onTitreChange={setTitre}
                      onMessageChange={setMessage}
                      onSend={sendMessage}
                />
                <button className="btn btn-dark rounded-pill px-1" onClick={() => setShowModalAddParticipant(true)}><CiUser /></button>
                <ParticipantModal project_id={id} show={showModalAddParticipant} handleClose={() => setShowModalAddParticipant(false)}/>
            </div>

           
          {messages.length === 0 ? (
  <p>Aucune discussion</p>
) : (
  messages.map((msg, index) => {
    const avatar = msg.user?.avatar ? `/api/uploads/${msg.user.avatar}` : "/default-avatar.jpg";
    return (
      <div key={index} className="d-flex align-items-start mb-4">
        <img
          src={avatar}
          alt={`${msg.user.firstname} ${msg.user.lastname}`}
          className="rounded-circle me-3"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
        <div>
          <p className="mb-1">
            {msg.user.firstname} {msg.user.lastname} {" "}
            {msg.createdAt ? formatDate(msg.createdAt) : "Date inconnue"}
          </p>
          <p className="mb-1 fw-bold">{msg.titre}</p>
          <p className="mb-2">{msg.description}</p>
          <SectionVote userId={user!.id} postId={msg.post_id} onVoteChange={loadPosts} />
        </div>
      </div>
    );
  })
)}
        </main>
        <SectionParticipant project_description={project?.description}/>
            {error && <Alert variant="danger">{error}</Alert>}
        </div> 
      );
};

export default ChatPage;
