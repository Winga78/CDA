import {useEffect , useState} from "react";
import {findAllParticipantProject} from "../services/projectUserService";
import { Project } from "../models/Project";
import {Nav} from "react-bootstrap";

const SectionProject = ()=>{
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
      <div className="d-flex flex-grow-1">
        {/* Navbar latérale */}
        <div className="border-end p-3" style={{ width: "250px" }}>
          <Nav className="flex-column">
            {projects.map((project) => (
              <Nav.Link key={project.id} href={`/project/${project.id}`}>
                {project.name}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>
    );
    
}

export default SectionProject;