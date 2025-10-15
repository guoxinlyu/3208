import React, { useState, useEffect } from 'react';
import { getAllProjects, deleteProject } from '../api/api';  // Import API functions for fetching and deleting projects
import { Link } from 'react-router-dom';  // Import Link component for navigation
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap styles

/**
 * ProjectList Component - Displays a list of projects with options to edit, view, or delete each project.
 * 
 * This component fetches all projects from the API, displays them in a card layout, and provides
 * buttons to edit, view locations, or delete a project. It uses Bootstrap for styling.
 * 
 * @returns {JSX.Element} The project list page.
 */
const ProjectList = () => {
  const [projects, setProjects] = useState([]);  // State to store the list of projects
  const [loading, setLoading] = useState(true);  // State to manage loading status
  const [error, setError] = useState(null);  // State to manage error messages

  /**
   * useEffect - Fetches all projects from the API when the component mounts.
   * 
   * This effect runs once when the component is first rendered. It calls the `getAllProjects` API function
   * to fetch the list of projects and updates the state with the project data.
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();  // Fetch all projects from the API
        setProjects(data);  // Update state with the fetched projects
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(`Failed to load projects: ${error.message}`);  // Set error message if fetching fails
      } finally {
        setLoading(false);  // Stop loading after the data is fetched
      }
    };

    fetchProjects();  // Call the fetch function
  }, []);  // Run the effect only once when the component mounts

  /**
   * handleDelete - Handles the deletion of a project.
   * 
   * This function is triggered when the user clicks the "Delete" button. It calls the `deleteProject` API function
   * and removes the deleted project from the local state.
   * 
   * @param {number} id - The ID of the project to delete.
   */
  const handleDelete = async (id) => {
    try {
      await deleteProject(id);  // Call the delete function from the API
      setProjects(projects.filter((project) => project.id !== id));  // Update state to remove the deleted project
      console.log(`Project with id ${id} deleted.`);
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      setError(`Failed to delete project: ${error.message}`);  // Set error message if deleting fails
    }
  };

  // Display loading message if data is still being fetched
  if (loading) return <div>Loading...</div>;
  // Display error message if there is an error
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">  {/* Bootstrap container to center the content with margin at the top */}
      <h1>Projects</h1>

      {/* Button to navigate to the Add Project page */}
      <div className="mb-4">
        <Link to="/add-project" className="btn btn-primary">Add Project</Link>
      </div>

      {/* Display the list of projects or a message if no projects are available */}
      {projects.length > 0 ? (
        <div className="row">
          {projects.map((project) => (
            <div key={project.id} className="col-12 mb-3">  {/* Use Bootstrap grid system to layout the projects */}
              <div className="card shadow-sm">  {/* Bootstrap card with shadow effect */}
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">{project.title}</h5>  {/* Display project title */}
                      <p className="card-text">{project.description}</p>  {/* Display project description */}
                    </div>
                    {project.is_published && (  // Conditionally display the "Published" badge if the project is published
                      <span className="badge bg-success align-self-start">Published</span>
                    )}
                  </div>
                  <div className="mt-3">
                    {/* Edit button linking to the Edit Project page */}
                    <Link to={`/edit-project/${project.id}`} className="btn btn-outline-secondary btn-sm me-2">
                      Edit
                    </Link>
                    {/* View Locations button linking to the View Location page */}
                    <Link to={`/view-location/${project.id}`} className="btn btn-outline-info btn-sm me-2">
                      View Location
                    </Link>
                    {/* Delete button for deleting a project */}
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(project.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No projects available</div>  
      )}
    </div>
  );
};

export default ProjectList;









