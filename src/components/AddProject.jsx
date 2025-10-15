import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/api';  // Import the API method to create a new project
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap for styling

/**
 * AddProject Component - A form for creating new projects.
 * 
 * This component manages the form state for creating a new project. Upon form submission,
 * it sends a POST request to the API to create the project, and then navigates the user back to the project list.
 * 
 * @returns {JSX.Element} The form for adding a new project.
 */
function AddProject() {
  const navigate = useNavigate();  // Hook to programmatically navigate the user

  // State to manage form data
  const [formData, setFormData] = useState({
    title: '',  // Project title
    description: '',  // Project description
    instructions: '',  // Project instructions
    initial_clue: '',  // Initial clue for the project
    homescreen_display: 'Display initial clue',  // Option for what to display on the home screen
    participant_scoring: 'Number of Scanned QR Codes',  // Scoring method for participants
    is_published: false  // Boolean to track if the project is published
  });

  const [error, setError] = useState(null);// State to store any error messages

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
      [name]: type === 'checkbox' ? checked : value  // Update checkbox or input values accordingly
    });
  };

  /**
   * Handles form submission.
   * Sends a POST request to create a new project with the data from formData.
   * If successful, navigates back to the project list.
   * 
   * @param {object} e - The form submit event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    try {
      // Add username to the formData
      const projectData = {
        ...formData,
        username: 's4739502'  // Static username for submission
      };

      console.log('Submitting project data:', projectData);  // Debug log of the project data being submitted

      // Call API to create the project
      await createProject(projectData);

      console.log("Project created successfully!");

      // On successful submission, redirect to the projects list page
      navigate('/projects');
    } catch (error) {
      console.error("Error creating project:", error);  // Log any error to the console
      setError("Error creating project");  // Set the error message for display
    }
  };
  
  return (
    <div className="container mt-5"> {/* Bootstrap container with top margin */}
      <h2 className="text-center mb-4">Add New Project</h2>  {/* Centered heading with bottom margin */}
      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label className="form-label">Title</label>  {/* Label for the title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Initial Clue</label>
          <input
            type="text"
            name="initial_clue"
            value={formData.initial_clue}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Homescreen Display</label>
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

        <div className="mb-3">
          <label className="form-label">Participant Scoring</label>
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

        <button type="submit" className="btn btn-primary">Submit Project</button>
      </form>
      {error && <div className="text-danger mt-3">{error}</div>}  
    </div>
  );
}

export default AddProject;
