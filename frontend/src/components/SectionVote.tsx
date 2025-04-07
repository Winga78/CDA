import { FaArrowUp } from "react-icons/fa"; // Import de l'icône
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { checkIfVoted, getVote , api_project_post_user_url} from "../services/postUserService";
import { io, Socket } from "socket.io-client";
import { updatePost } from "../services/postService";

const SectionVote = ({
  userId,
  postId,
  onVoteChange,
}: {
  userId: string;
  postId: string;
  onVoteChange: () => void;
}) => {
  const [score, setScore] = useState(0);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const room = postId || ""; // On initialise la room avec postId

  if (!postId) return null;

  useEffect(() => {
    if (!postId) return;

    // Initialisation de la connexion socket
    socketRef.current = io(
      api_project_post_user_url
    );
    const socket = socketRef.current;

    socket.emit("joinRoom", postId);

    // Fonction pour récupérer l'état du vote
    const fetchVoteStatus = async () => {
      try {
        const hasVoted = await checkIfVoted(postId, userId);
        setVoted(!!hasVoted);
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    };

    // Fonction pour récupérer le nombre de votes
    const fetchCountVote = async () => {
      try {
        const count = await getVote(postId);
        if (typeof count === "number") {
          setScore(count);
        }
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    };

    fetchVoteStatus();
    fetchCountVote();

    // Fonction pour mettre à jour le score du vote
    const handleVoteUpdate = async (data: any) => {
      setVoted(data.isVoted);
      setScore(data.score);
      await updatePost(postId, { score: data.score });
      onVoteChange(); // Appel du callback pour mettre à jour l'état parent
    };

    socket.on("statusVote", handleVoteUpdate);

    return () => {
      socket.off("statusVote");
      socket.emit("leaveRoom", postId);
      socket.disconnect();
    };
  }, [postId, userId, onVoteChange]);

  // Fonction pour gérer le vote
  const handleVote = async () => {
    try {
      if (!socketRef.current) return;

      if (voted) {
        socketRef.current.emit("deleteVote", { room, userId });
      } else {
        socketRef.current.emit("createVote", { room, userId });
      }
    } catch (error: any) {
      setError(error.message || "Une erreur inconnue est survenue");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {error && <div className="alert alert-danger">{error}</div>}
      <Button
        variant="outline-primary"
        onClick={handleVote}
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      >
        <FaArrowUp size={24} color={score ? "green" : "black"} />
      </Button>
      <p>
        {score} vote{score !== 1 ? "s" : ""}
      </p>
      <p>{voted ? "Annuler le vote" : "Cliquez pour voter"}</p>
    </div>
  );
};

export default SectionVote;