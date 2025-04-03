import { useEffect, useState } from "react";
import { ListGroup, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { User } from "../models/User";
import { findParticipant } from "../services/projectUserService";
import { getUser } from "../services/authService";
import { ProjectUser } from "../models/ProjectUser";

const SectionParticipant = () => {
  const [participants, setParticipants] = useState<User[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const loadParticipants = async () => {
      if (!id) return; 

      try {
        const data: ProjectUser[] = (await findParticipant(id)) || [];
        const users = await Promise.all(data.map(user => getUser(user.participant_id)));
        const filteredUsers = users.filter((user): user is User => user !== undefined);
        setParticipants(filteredUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des participants :", error);
      }
    };

    loadParticipants();
  }, [id]);

  return (
    <Container
      className="mt-3 border p-3 rounded shadow-sm"
      style={{
        maxWidth: "300px", // Limite la largeur
        height: "auto", // Prend toute la hauteur de l'écran
        overflowY: "auto", // Permet le scroll si nécessaire
      }}
    >
      <h5 className="text-center">Participants</h5>

      <ListGroup>
        {participants.length > 0 ? (
          participants.map((user) => (
            <ListGroup.Item key={user._id}>
              {user.firstname} {user.lastname}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Aucun participant</ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
};

export default SectionParticipant;
