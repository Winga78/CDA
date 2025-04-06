import { useState, useEffect } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { BsBellFill } from "react-icons/bs";
import { notificationPost } from "../services/postUserService";

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
        const data = await notificationPost();

        if (!data || data.length === 0) {
          setMessage("Aucune notification trouvée");
        } else {
          // Récupérer uniquement les 3 dernières notifications
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
        position: "fixed",
        right: "20px", 
        bottom: "400px",
        width: "300px",
        zIndex: 9999,
      }}
    >
      <div className="alert alert-info">
        <h4>
          <BsBellFill className="me-2" />
          Notifications
        </h4>
        {message && <div>{message}</div>}
      </div>
      <ListGroup className="mt-3">
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
