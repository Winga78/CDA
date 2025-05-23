import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { getUser, updateUser, deleteUser } from "../services/authService";

function ProfilePage() {
  const { user, logout} = useUser();
  const [formData, setFormData] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = await getUser(user!.id);
        setFormData(storedUser || null);
      } catch (error: any) {
        setError("Erreur lors de la récupération du profil : " + error.message);
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    if (e.target.name === 'avatar') {
      setAvatarFile(e.target.files ? e.target.files[0] : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    
    let data = { ...formData };

    if (!data.password || data.password.trim() === "") {
      delete data.password;
    }

    if (avatarFile) {
      const formDataToSend = new FormData();
      formDataToSend.append('file', avatarFile);
      formDataToSend.append('firstname', data.firstname);
      formDataToSend.append('lastname', data.lastname);
      try {
        await updateUser(formDataToSend);
        window.location.reload();
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    } else {
      try {
       await updateUser(data);
       window.location.reload();
      } catch (error: any) {
        setError(error.message || "Une erreur inconnue est survenue");
      }
    }

  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      logout();
    } catch (error: any) {
      setError(error.message || "Une erreur inconnue est survenue");
    }
  };

  if (!formData) return <p>Chargement du profil...</p>;

  return (
    <Container className="mt-4">
      <h2>Profil</h2>
      {error && <p className="text-danger">{error}</p>}
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
        <Form.Group className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            name="avatar"
            accept="image/png, image/jpeg"
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
