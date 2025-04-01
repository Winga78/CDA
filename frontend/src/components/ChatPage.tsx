import ParticipantModal from "../components/ModalAddParticipants";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import SectionParticipant from "./SectionParticipant";
import { getProject } from "../services/projectService";
import { Project } from "../models/Project";
import { Container, Button } from "react-bootstrap";
import { BsPlus } from "react-icons/bs"; // Icône Bootstrap
// import { io } from 'socket.io-client';

// const socket = io('/api/chat', {
//   path: '/socket.io',
//   transports: ['websocket'],
// });
// console.log(socket)

const ChatPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [showModalAddParticipant, setShowModalAddParticipant] = useState(false);

    const handleShowModalAddParticipant = () => setShowModalAddParticipant(true);
    const handleCloseModalAddParticipant = () => setShowModalAddParticipant(false);

    // const [messages, setMessages] = useState<{ id: number; user: string; message: string }[]>([]);
    // const [message, setMessage] = useState('');
    // const [user] = useState(`User-${Math.floor(Math.random() * 1000)}`);


    useEffect(() => {
        const loadProject = async () => {
            try {
                const storedUser = await getProject(id!);
                setProject(storedUser || null);
            } catch (error) {
                console.error("Erreur lors de la récupération du projet", error);
            }
        };
        loadProject();

        // // Écoute des messages en temps réel
        // socket.on('message', (data) => {
        //     setMessages((prev) => [...prev, { id: Date.now(), ...data }]); // Ajout d'un id unique
        // });

        // // Nettoyage lors du démontage du composant
        // return () => {
        //     socket.off('message');
        // };

    }, [id]); // Ajout de `id` dans le tableau des dépendances

    // const sendMessage = () => {
    //     if (message.trim()) {
    //         // socket.emit('message', { user, message });
    //         setMessage('');
    //     }
    // };

    return (
        <Container className="mt-4">
            {/* Titre du projet */}
            <h1 className="text-center mb-2">{project?.name}</h1>
            <h3 className="text-center mb-4 text-muted">{project?.description}</h3>

            {/* Conteneur principal */}
            <div className="d-flex flex-column align-items-end">
                {/* Bouton "Nouveau" */}
                <Button
                    variant="dark"
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{ width: "40px", height: "40px" }}
                    onClick={handleShowModalAddParticipant}
                >
                    <BsPlus size={24} />
                </Button>

                {/* Section des participants */}
                <SectionParticipant />
            </div>

            {/* Modal d'ajout de participant */}
            <ParticipantModal
                project_id={project?.id}
                show={showModalAddParticipant}
                handleClose={handleCloseModalAddParticipant}
            />

            {/* Chat en temps réel */}
            {/* <div>
                <h2>Chat en temps réel</h2>
                <div>
                    {messages.map((msg) => (
                        <p key={msg.id}>
                            <strong>{msg.user}:</strong> {msg.message}
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
            </div> */}
        </Container>
    );
};

export default ChatPage;
