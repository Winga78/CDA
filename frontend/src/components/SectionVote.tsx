import { FaArrowUp } from 'react-icons/fa'; // Importation de l'icône flèche vers le haut
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { createVote } from '../services/postUserService'; // Appel à la fonction du backend

const SectionVote = ({ userId, postId }: { userId: string; postId: string }) => {
  const [voted, setVoted] = useState(false); // État pour savoir si l'utilisateur a déjà voté

  // Fonction pour enregistrer le vote
  const handleVote = async () => {
    if (userId && postId && voted) {
      try {
        const response = await createVote({participant_id : userId, post_id : postId}); // Appel à l'API backend pour enregistrer le vote
        if (response) {
          setVoted(true);
          console.log('Vote enregistré');
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du vote', error);
      }
    }
    else {
        
    }
  };


  return (
    <div className="d-flex flex-column align-items-center">
      <Button
        variant="outline-primary"
        onClick={handleVote}
        disabled={voted}
        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
      >
        <FaArrowUp size={24} color={voted ? 'green' : 'black'} />
      </Button>
      <p>{voted ? 'Vous avez voté!' : 'Cliquez pour voter'}</p>
    </div>
  );
};

export default SectionVote;
