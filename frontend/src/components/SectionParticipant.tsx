import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../models/User";
import { findParticipant } from "../services/projectUserService";
import { getUser } from "../services/authService";
import { ProjectUser } from "../models/ProjectUser";

const SectionParticipant = ({project_description }: {project_description:any}) => {
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
    <aside
   className="bg-light border-start p-3" style={{ width: '250px' }}
  >
       <h5>Membres</h5>

    <div className="d-flex mb-3 flex-wrap">
      {participants.length > 0 ? (
       participants.map((user, index) => {
      const key = `${user?.firstname}-${user?.lastname}-${user?.email || index}`;
      const avatar = user?.avatar ? `/api/uploads/${user.avatar}` : "/default-avatar.jpg";

      return (
        <div key={key} className="d-flex flex-column align-items-center me-3 mb-2">
          <img
            src={avatar}
            alt={`${user?.firstname} ${user?.lastname}`}
            className="rounded-circle"
            width="40"
            height="40"
            style={{ objectFit: 'cover' }}
          />
          <span className="small">{user?.firstname} {user?.lastname}</span>
        </div>
      );
      })
    ) : (
    <div key="no-participant">Aucun participant</div>
   )}
</div>

       <h6>Info</h6>
        <p className="small">
          {project_description}
        </p>
      </aside>
  );
};

export default SectionParticipant;
