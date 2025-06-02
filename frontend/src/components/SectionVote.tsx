import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { checkIfVoted, getVoteCount} from "../services/postUserService";
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
  const room = postId || "";
  
  if (!postId) return null;

  useEffect(() => {
    if (!postId) return;

    const socketPath = '/vote/socket.io';

        socketRef.current = io('', {
          path: socketPath,
          transports: ['websocket'],
        });
    const socket = socketRef.current;

    socket.emit("joinRoom", postId);

    const fetchVoteStatus = async () => {
      try {
        const hasVoted = await checkIfVoted(postId, userId);
        setVoted(!!hasVoted);
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    };

    const fetchCountVote = async () => {
      try {
        const count = await getVoteCount(postId);
        if (typeof count === "number") {
          setScore(count);
        }
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    };

    fetchVoteStatus();
    fetchCountVote();

    const handleVoteUpdate = async (data: any) => {
      setVoted(data.isVoted);
      setScore(data.score);
      await updatePost(postId, { score: data.score });
      onVoteChange();
    };

    socket.on("statusVote", handleVoteUpdate);

    return () => {
      socket.off("statusVote");
      socket.emit("leaveRoom", postId);
      socket.disconnect();
    };
  }, [postId, userId, onVoteChange]);

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
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <Button
  className="btn btn-outline-secondary btn-sm"
  style={{ backgroundColor: "#e0e0e0", color: "#000" }}
  onClick={handleVote}>
  👍{score} vote{score > 0 ? "s" : ""}
</Button>

    </div>
  );
};

export default SectionVote;