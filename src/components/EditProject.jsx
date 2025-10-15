import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject } from '../api/api';  // Import API functions for fetching and updating projects
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap styles

/**
 * EditProject Component - A form for editing an existing project.
 * 
 * This component fetches the project data by its ID, populates the form fields with that data,
 * and allows the user to update the project information. On form submission, it sends the updated
 * data to the API and redirects the user to the project list upon success.
 * 
 * @returns {JSX.Element} The form for editing a project.
 */
function EditProject() {
  const { id } = useParams();  // Get the project ID from the URL parameters
  const navigate = useNavigate();  // Hook to programmatically navigate the user

  // State to manage form data
  const [formData, setFormData] = useState({
    title: '',  // Project title
    description: '',  // Project description
    instructions: '',  // Project instructions
    initial_clue: '',  // Initial clue for the project
    homescreen_display: 'Display initial clue',  // Default option for homescreen display
    participant_scoring: 'Number of Scanned QR Codes',  // Default scoring method for participants
    is_published: false  // Boolean to track if the project is published
  });

  const [loading, setLoading] = useState(true);  // State to track if data is being loaded
  const [error, setError] = useState(null);  // State to manage any errors that occur

  /**
   * Fetches the project data by its ID and populates the form.
   * 
   * The useEffect hook is used to load the project data when the component mounts.
   */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectArray = await getProjectById(id);  // Fetch project data by ID
        const projectData = projectArray[0];  // Assuming project data is in the first array element
  
        // Populate the form if the project data is found
        if (projectData) {
          setFormData({
            title: projectData.title || '',
            description: projectData.description || '',
            instructions: projectData.instructions || '',
            initial_clue: projectData.initial_clue || '',
            homescreen_display: projectData.homescreen_display || 'Display initial clue',
            participant_scoring: projectData.participant_scoring || 'Number of Scanned QR Codes',
            is_published: projectData.is_published || false
          });
        } else {
          setError('No project data found');  // Set error if no project data is found
        }
      } catch (error) {
        console.error('Error loading project data:', error);
        setError('Error loading project data');  // Set error if fetching data fails
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };
  
    fetchProject();
  }, [id]);  // Only re-run the effect if the project ID changes

  /**
   * Handles input changes in the form fields.
   * Updates the corresponding field in formData state when the user modifies an input.
   * 
   * @param {object} e - The event object from the input field
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value  // Handle checkbox and regular input changes
    });
  };

  /**
   * Handles form submission.
   * Sends a POST request to update the project with the data from formData.
   * If successful, redirects the user to the project list page.
   * 
   * @param {object} e - The form submit event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    try {
      await updateProject(id, formData);  // Call API to update the project
      navigate('/projects');  // Navigate back to the project list upon success
    } catch (error) {
      setError('Error updating project');  // Set error if updating project fails
    }
  };

  if (loading) return <div>Loading project data...</div>;  // Show loading message while data is being fetched
  if (error) return <div>{error}</div>;  // Show error message if there is an error

  return (
    <div className="container mt-5">  {/* Bootstrap container with margin-top */}
      <h2 className="text-center mb-4">Edit Project</h2>  {/* Centered heading with bottom margin */}
      <form onSubmit={handleSubmit}>  {/* Form for editing project */}
        {/* Input for project title */}
        <div className="mb-3">
          <label className="form-label">Title</label>  {/* Bootstrap form label */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"  
            required  // Make this field required
          />
        </div>

        {/* Textarea for project description */}
        <div className="mb-3">
          <label className="form-label">Description</label>  {/* Bootstrap form label */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"  
            required  // Make this field required
          />
        </div>

        {/* Textarea for project instructions */}
        <div className="mb-3">
          <label className="form-label">Instructions</label>  {/* Label for instructions */}
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="form-control"
            required  
          />
        </div>

        {/* Input for initial clue */}
        <div className="mb-3">
          <label className="form-label">Initial Clue</label>  {/* Label for initial clue */}
          <input
            type="text"
            name="initial_clue"
            value={formData.initial_clue}
            onChange={handleChange}
            className="form-control"  
          />
        </div>

        {/* Dropdown for homescreen display option */}
        <div className="mb-3">
          <label className="form-label">Homescreen Display</label>  {/* Label for homescreen display */}
          <select
            name="homescreen_display"
            value={formData.homescreen_display}
            onChange={handleChange}
            className="form-select"  
          >
            <option value="Display initial clue">Display initial clue</option>
            <option value="Display all locations">Display all locations</option>
          </select>
        </div>

        {/* Dropdown for participant scoring method */}
        <div className="mb-3">
          <label className="form-label">Participant Scoring</label>  {/* Label for participant scoring */}
          <select
            name="participant_scoring"
            value={formData.participant_scoring}
            onChange={handleChange}
            className="form-select"  
          >
            <option value="Number of Scanned QR Codes">Number of Scanned QR Codes</option>
            <option value="Number of Locations Entered">Number of Locations Entered</option>
          </select>
        </div>

        {/* Checkbox for published status */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="form-check-input"  
          />
          <label className="form-check-label">Published</label>
        </div>

        {/* Submit button to save the project */}
        <button type="submit" className="btn btn-primary">Save Project</button>
      </form>
    </div>
  );
}

export default EditProject;







