import { FaArrowUp } from "react-icons/fa"; // Import de l'icône
import { useState, useEffect , useRef} from "react";
import { Button } from "react-bootstrap";
import { checkIfVoted, getVote } from "../services/postUserService";
import { io, Socket } from 'socket.io-client';

const SectionVote = ({ userId, postId, onVoteChange}: { userId: string; postId: string; onVoteChange: () => void}) => {
  const [score, setScore] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const [room, setRoom] = useState('');
  const [voted, setVoted] = useState(false); // Suivi du vote  

  useEffect(() => {
    setRoom(postId);
    socketRef.current = io('http://192.168.58.161:3003/');
    const socket = socketRef.current;

    socket.emit('joinRoom', postId);

    const fetchVoteStatus = async () => {
      try {
        const hasVoted = await checkIfVoted(postId, userId);
        setVoted(!!hasVoted);
      } catch (error) {
        console.error("Erreur lors de la vérification du vote", error);
      }
    };

    const fetchCountVote = async () => {
      try {
        const count = await getVote(postId);
        if (typeof count === "number") {
          setScore(count);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du score des votes", error);
      }
    };

    fetchVoteStatus()
    fetchCountVote();

    const handleVoteUpdate = (data: any) => {
      setVoted(data.isVoted)
      setScore(data.score)
    };
  
    socket.on("statusVote", handleVoteUpdate);
  
    return () => {
      socket.off("statusVote");
      socket.emit("leaveRoom", postId);
      socket.disconnect();
    };

  }, [userId, postId ,score]);

  const handleVote = async () => {
    try {
      if (voted) {
        if(!socketRef.current) return;
         socketRef.current.emit('deleteVote', {room: room, userId: userId});
         onVoteChange()

      } else {
        if(!socketRef.current) return;
         socketRef.current.emit('createVote', {room: room, userId: userId});
         onVoteChange()
      }
      
    } catch (error) {
      console.error("Erreur lors du vote", error);
    }
  };
  
  return (
    <div className="d-flex flex-column align-items-center">
      <Button
        variant="outline-primary"
        onClick={handleVote}
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      >
        <FaArrowUp size={24} color={score ? "green" : "black"} />
      </Button>
      <p>{score} vote{score !== 1 ? "s" : ""}</p>
      <p>{voted ? "Annuler le vote" : "Cliquez pour voter"}</p>
    </div>
  );
};

export default SectionVote;
