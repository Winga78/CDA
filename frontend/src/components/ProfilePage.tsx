import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { getProfile, updateUser, deleteUser } from "../services/authService";
import { User } from "../models/User";

function ProfilePage() {
  const { user, logout} = useUser();
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    const loadProfil = async () => {
      try {
        const storedUser = await getProfile();
        setFormData(storedUser || null);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil", error);
        return;
      }
    };
    loadProfil();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await updateUser(formData);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil", error.message);
    }
  };

  const handleDelete = async () => {
      try {
        await deleteUser();
        logout()
      } catch (error: any) {
        console.error("Erreur lors de la suppression du compte", error.message);
      }
  };

  if (!formData) return <p>Chargement du profil...</p>;

  return (
    <Container className="mt-4">
      <h2>Profil</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="text"
            name="firstname"
            value={formData.firstname || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            name="lastname"
            value={formData.lastname || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email || ""} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date de naissance</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            value={formData.birthday || ""}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="me-2">
          Modifier
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer le compte
        </Button>
      </Form>
    </Container>
  );
}

export default ProfilePage;
