import { useEffect, useState } from "react";
import { ListGroup, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { User } from "../models/User";
import { findParticipant } from "../services/projectUserService";
import { getUser } from "../services/authService";
import { ProjectUser } from "../models/ProjectUser";

const SectionParticipant = () => {
  const [participants, setParticipants] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const loadParticipants = async () => {
      if (!id) return;

      try {
        const data: ProjectUser[] = (await findParticipant(id)) || [];
        const users = await Promise.all(data.map(async (user) => await getUser(user.participant_id)));
        const filteredUsers = users.filter((user): user is User => user !== undefined);
        setParticipants(filteredUsers);
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    };

    loadParticipants();
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">Erreur : {error}</div>;
  }

  return (
    <Container
      className="mt-3 border p-3 rounded shadow-sm"
      style={{
        maxWidth: "300px",
        position: "fixed", // Pour positionner la liste à droite
        right: "0",
        top: "10%",
        height: "auto",
        overflowY: "auto",
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
