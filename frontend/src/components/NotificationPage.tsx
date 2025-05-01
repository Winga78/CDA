import { useState, useEffect } from "react";
import { Container, ListGroup, Badge } from "react-bootstrap";
import { BsBellFill } from "react-icons/bs";
import { getVoteNotifications } from "../services/postUserService";

interface Notification {
  id: number;
  message: string;
  post_id: number;
  isRead?: boolean;
}

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getVoteNotifications();

        if (!data || data.length === 0) {
          setMessage("Aucune notification trouvée");
        } else {
          const notificationsWithReadFlag = data.map((notif: any, index: number) => ({
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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  if (error) {
    return <div className="alert alert-danger">Erreur : {error}</div>;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Container className="mt-4">
      <h3>
        <BsBellFill className="me-2" />
        Notifications
      </h3>
      {message && <div className="alert alert-info">{message}</div>}
      <ListGroup className="mt-3">
        {notifications.map((notif) => (
          <ListGroup.Item
            key={notif.id}
            action
            onClick={() => markAsRead(notif.id)}
            variant={notif.isRead ? "light" : "primary"}
          >
            {notif.message}
            {!notif.isRead && (
              <Badge bg="danger" className="ms-2">
                Nouveau
              </Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default NotificationPage;
