import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Outlet } from 'react-router-dom';
import SectionProject from "./SectionProject";
import { useUser } from "../context/UserContext";
import logo from '../assets/logo.png';

const Layout = () => {
  const { user, logout } = useUser();
  const avatarUrl = `/api/uploads/${user?.avatar}`;
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Navbar horizontale */}
      <Navbar bg="dark" variant="dark" className="px-3 d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/"><img 
          src={logo} 
          alt="Mon Logo" 
          // Ajuste la taille si nécessaire
        /></Navbar.Brand>

        {user != null && (
          <Nav className="mx-auto">
            <Nav.Link href="/accueil">Accueil</Nav.Link>
            <Nav.Link href="/projects">Projets</Nav.Link>
            <Nav.Link href="/notifications">Notifications</Nav.Link>
            <button onClick={logout}>Déconnexion</button>
          </Nav>
        )}

        <Nav>
          {user ? (
            <Nav.Link href="/profile" className="d-flex align-items-center">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="rounded-circle"
                width="40"
                height="40"
              />
              <span className="ms-2 text-white">{user?.firstname} {user?.lastname}</span>
            </Nav.Link>
          ) : (
            <>
              <Nav.Link href="/login">Connexion</Nav.Link>
              <Nav.Link href="/register">Inscription</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar>

      {user ? (
        <>
          <SectionProject />
        </>
      ) : (
        <Container className="flex-grow-1 mt-3">
          <Outlet />
        </Container>
      )}

      <footer className="text-center py-3 border-top mt-auto">
        <div className="mb-2">
          <FaFacebook size={24} className="mx-2" />
          <FaTwitter size={24} className="mx-2" />
          <FaInstagram size={24} className="mx-2" />
        </div>
        <div>
          <a href="/mentions-legales" className="text-dark fw-bold">Mentions légales</a> | 
          <a href="/confidentialite" className="text-dark fw-bold"> Politique de confidentialité</a> | 
          <a href="/cookies" className="text-dark fw-bold"> Politique de cookies</a> | 
          <a href="/cgv" className="text-dark fw-bold"> Conditions générales de vente</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
