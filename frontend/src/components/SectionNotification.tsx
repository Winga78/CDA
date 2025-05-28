import { useState, useEffect } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { BsBellFill } from "react-icons/bs";
import { getVoteNotifications } from "../services/postUserService";

interface Notification {
  id: number;
  message: string;
  post_id: number;
  isRead?: boolean;
}

function NotificationSection() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getVoteNotifications();
         console.log("Notifications récupérées :", data);
        if (!data || data.length === 0) {
          setMessage("Aucune notification trouvée");
        } else {
          const notificationsWithReadFlag = data.slice(0, 3).map((notif: any, index: number) => ({
            id: index + 1,
            post_id: notif.post?.id || 0,
            message: `${notif.user.firstname} ${notif.user.lastname} a voté dans ${notif.project.name}`,
            isRead: false
          }));
          setNotifications(notificationsWithReadFlag);
        }
      } catch (err: any) {
        setError(err.message || "Une erreur inconnue est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (error) {
    return <div className="alert alert-danger">Erreur : {error}</div>;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div
      style={{
        marginTop : "20px",
        position: "absolute",
        top: "56px",
        right: 0,
        width: "300px",
        height: "100%",
        backgroundColor: "#f8f9fa",
        borderLeft: "1px solid #dee2e6",
        padding: "1rem",
        overflowY: "auto",
        zIndex: 1050,
      }}
    >
      <h5 className="mb-3">
        <BsBellFill className="me-2" />
        Notifications
      </h5>

      {message && <div className="text-muted">{message}</div>}

      <ListGroup>
        {notifications.map((notif) => (
          <ListGroup.Item key={notif.id}>
            {notif.message}
            {!notif.isRead && (
              <Badge bg="danger" className="ms-2">
                Nouveau
              </Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default NotificationSection;
