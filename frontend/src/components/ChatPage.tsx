import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import SectionParticipant from "./SectionParticipant";
import { getProject } from "../services/projectService";
import { Project } from "../models/Project";
import { Container, Button } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import { io, Socket } from 'socket.io-client';
import ParticipantModal from "../components/ModalAddParticipants";
import { postsList } from '../services/postService';
import SectionVote from './SectionVote';

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

    if (!id) return null; // Évite d'exécuter du code inutile si l'ID est absent

    // Fonction pour charger les posts
    const loadPosts = async () => {
        try {
            const posts = await postsList(id);
            if(posts){
                setMessages(posts);
            }  
        } catch (error) {
            console.error("Erreur lors de la récupération des posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        setRoom(id);
        socketRef.current = io('http://192.168.58.161:3001/');
        const socket = socketRef.current;

        socket.emit('joinRoom', id);

        const loadProject = async () => {
            try {
                const storedProject = await getProject(id);
                setProject(storedProject || null);
            } catch (error) {
                console.error("Erreur lors de la récupération du projet", error);
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

    // Trie les posts par score (du plus haut au plus bas)
    const sortedPosts = [...messages].sort((a, b) => b.score - a.score);

    // Fonction d'envoi du message
    const sendMessage = () => {
        if (!message.trim() || !titre.trim() || !user || !socketRef.current) return;
        socketRef.current.emit('message', { room, user, titre, message });
        setMessage('');
        setTitre('');
    };

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
                project_id={project?.id}
                show={showModalAddParticipant}
                handleClose={() => setShowModalAddParticipant(false)}
            />

            <div>
                <h2>Chat en temps réel</h2>
                
                {/* Gestion du chargement */}
                {isLoading ? (
                    <p>Chargement des messages...</p>
                ) : (
                    <div>
                        {sortedPosts.map((msg) => (
                            <div key={msg.post_id}>
                                <p>
                                    <strong>{msg.user.firstname} {msg.user.lastname}:</strong> {msg.titre} {msg.description}
                                </p>
 
                                <SectionVote userId={user!.id} postId={msg.post_id} onVoteChange={loadPosts} />
                            </div>
                        ))}
                    </div>
                )}

                <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Écris un titre..."
                />

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écris un message..."
                />
                <button onClick={sendMessage}>Envoyer</button>
            </div>
        </Container>
    );
};

export default ChatPage;
