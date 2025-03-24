import useProjects from '../hooks/useProjects';
import { Link} from 'react-router-dom';

const AccueilPage=()=>{
    const { projects, error , isLoaded} = useProjects();

    if (error) {
        return <div>Error: {error}</div>;
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

export default AccueilPage;