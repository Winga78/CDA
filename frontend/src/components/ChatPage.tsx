import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import SectionParticipant from "./SectionParticipant";
import { getProject } from "../services/projectService";
import { Project } from "../models/Project";
import { Container, Button } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import { io, Socket } from 'socket.io-client';
import { User } from "../models/User";
import ParticipantModal from "../components/ModalAddParticipants";

const ChatPage = () => {
    const { id } = useParams();
    const { user } = useUser();
    const [project, setProject] = useState<Project | null>(null);
    const [showModalAddParticipant, setShowModalAddParticipant] = useState(false);
    const [messages, setMessages] = useState<{ id: number; room: string; user: User; message: string }[]>([]);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');
    const socketRef = useRef<Socket | null>(null);  // Ajout du type Socket ou null

    useEffect(() => {
        if (!id) return;

        setRoom(id);
        socketRef.current = io('http://192.168.58.161:3001/');
        const socket = socketRef.current;

        socket.emit('joinRoom', id);

        const loadProject = async () => {
            try {
                const storedProject = await getProject(id!);
                setProject(storedProject || null);
            } catch (error) {
                console.error("Erreur lors de la récupération du projet", error);
            }
        };
        loadProject();

        socket.on('message', (data) => {
            setMessages((prev) => [...prev, { id: Date.now(), ...data }]);
        });

        return () => {
            socket.off('message');
            socket.emit('leaveRoom', id);
            socket.disconnect();
        };
    }, [id]);

    const sendMessage = () => {
        if (!message.trim() || !user || !socketRef.current) return;
        socketRef.current.emit('message', { room, user, message });
        setMessage('');
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
                <div>
                    {messages.map((msg) => (
                        <p key={msg.id}>
                            <strong>{msg.user.firstname} {msg.user.lastname}:</strong> {msg.message}
                        </p>
                    ))}
                </div>
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
