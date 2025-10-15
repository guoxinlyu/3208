import { useParams } from 'react-router-dom';

/**
 * ProjectDetail Component - Displays the details of a specific project.
 * 
 * This component retrieves the project ID from the URL using `useParams` and looks up the project
 * from the passed `projects` array. If the project is found, it displays the project's title and description.
 * If no project is found, it displays a "Project not found" message.
 * 
 * @param {Array} projects - An array of project objects, each containing at least an `id`, `title`, and `description`.
 * @returns {JSX.Element} The details of the selected project, or a message if the project is not found.
 */
const ProjectDetail = ({ projects = [] }) => {
  const { id } = useParams();  // Retrieve the project ID from the URL parameters
  const project = projects.length ? projects.find((proj) => proj.id === parseInt(id)) : null;  // Find the project with the matching ID

  // If the project is not found, display an error message
  if (!project) {
    return <div>Project not found</div>;
  }

  // Render the project details
  return (
    <div>
      <h1>{project.title}</h1>  {/* Display the project title */}
      <p>{project.description}</p>  {/* Display the project description */}
      
      {/* Placeholder for rendering project locations, currently commented out */}
      {/* <ProjectLocations locations={project.locations} /> */}
    </div>
  );
};

export default ProjectDetail;


