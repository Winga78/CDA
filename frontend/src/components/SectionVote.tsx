import { FaArrowUp } from "react-icons/fa"; // Import de l'icône
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { createVote, DeleteVote, checkIfVoted, getVote } from "../services/postUserService";
import { updatePost } from "../services/postService";

const SectionVote = ({ userId, postId, onVoteChange }: { userId: string; postId: string; onVoteChange: () => void }) => {
  const [voted, setVoted] = useState(false); // Suivi du vote
  const [score, setScore] = useState(0); // Nombre total de votes

  // Vérifie si l'utilisateur a déjà voté et récupère le score des votes
  useEffect(() => {
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

    fetchVoteStatus();
    fetchCountVote();
  }, [userId, postId, voted]); // Ajout de voted pour forcer le rechargement après un vote

  // Fonction pour voter ou annuler le vote
  const handleVote = async () => {
    try {
      if (voted) {
        // Annulation du vote
        const response = await DeleteVote(postId, userId);
        if (response) {
          const responseUpdate = await updatePost(postId, {score:score - 1});
          if (responseUpdate) {
            setScore((prevScore) => prevScore - 1);
            setVoted(false);
            onVoteChange();
          }
        }
      } else {
        // Création du vote
        const response = await createVote({ participant_id: userId, post_id: postId });
        if (response) {
          const responseUpdate = await updatePost(postId, {score:score + 1});
          if (responseUpdate) {
            setScore((prevScore) => prevScore + 1);
            setVoted(true);
            onVoteChange();
          }
        }
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
        <FaArrowUp size={24} color={voted ? "green" : "black"} />
      </Button>
      <p>{score} vote{score !== 1 ? "s" : ""}</p>
      <p>{voted ? "Annuler le vote" : "Cliquez pour voter"}</p>
    </div>
  );
};

export default SectionVote;
