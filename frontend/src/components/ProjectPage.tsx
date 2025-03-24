import { useState, useEffect }  from 'react';
import { Link} from 'react-router-dom';
import { Project } from "../models/Project";

const ProjectPage = ()=>{
    const [error, setError] = useState<Error | null>(null);
   const [isLoaded, setIsLoaded] = useState(false);
   const [projects, setProjects] = useState<Project[]>([]);

   useEffect(() => {
    fetch("http://project-service:3002/projects/last")
        .then(res => res.json())
        .then(
            (data) => {
                setIsLoaded(true);
                setProjects(data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
  }, [])

if (error) {
    return <div>Error: {error.message}</div>;
   } else if (!isLoaded) {
     return <div>Loading...</div>;
   } else {
     return (
        <ul>
            {projects.map(project => (
                <li key={project.id}>
                    <Link to={`project/${project.id}`}>{project.name}</Link>
                </li>
            ))}
        </ul>
     );
   }
}


export default ProjectPage;