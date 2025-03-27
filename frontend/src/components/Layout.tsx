import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Outlet } from 'react-router-dom';
import {useEffect , useState} from "react";
import {findAllParticipantProject} from "../services/projectUserService";
import { Project } from "../models/Project";

type LayoutProps = {
  // children: React.ReactNode;
  isAuthenticated: boolean;
  user?: { id: string; email: string; role: string; firstname : string , lastname : string };
};

const Layout: React.FC<LayoutProps> = ({isAuthenticated, user }) => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const loadProject = async () => {
          try {
            const data = await findAllParticipantProject();
            setProjects(data);
          } catch (error) {
            console.log(error)
          }
        };
        loadProject();
    }, []);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <Navbar bg="dark" variant="dark" className="px-3 d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">Mon Logo</Navbar.Brand>

        {isAuthenticated && (
          <Nav className="mx-auto">
            <Nav.Link href="/projects">Projet</Nav.Link>
            <Nav.Link href="/accueil">Accueil</Nav.Link>
            <Nav.Link href="/notifications">Notifications</Nav.Link>
          </Nav>
        )}

        <Nav>
          {isAuthenticated ? (
            <Nav.Link href="/profile" className="d-flex align-items-center">
              <img
                src={"/default-avatar.png"}
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
      
      {isAuthenticated && (
        <div className="d-flex flex-grow-1">
          {/* Navbar latérale */}
          <div className="border-end p-3" style={{ width: "250px" }}>
            <Nav className="flex-column">
            {projects.map((project) => (
            <Nav.Link href={`/project/${project.id}`}>{project.name}</Nav.Link>
            ))}
            </Nav>
          </div>
        </div>
      )}

     <div className="d-flex flex-column vh-100">
        <Container>
            <Outlet />
        </Container>
      </div>
      
      {/* Footer */}
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
