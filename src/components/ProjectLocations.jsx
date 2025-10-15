import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';  // Import the QR code generation library
import { getLocationsByProjectId, getProjectById, deleteLocation } from '../api/api';  // Import necessary API functions
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap styles

/**
 * ProjectLocations Component - Displays and manages the list of locations for a specific project.
 * 
 * This component fetches the list of locations by project ID, allows the user to add, edit, delete locations,
 * and also generates a QR code for a location if applicable. The component is styled using Bootstrap.
 * 
 * @returns {JSX.Element} The locations management page for a project.
 */
function ProjectLocations() {
  const { id } = useParams();  // Get projectId from URL parameters
  const navigate = useNavigate();  // Hook for programmatic navigation
  const [locations, setLocations] = useState([]);  // State to store the list of locations
  const [projectTitle, setProjectTitle] = useState('');  // State to store the project title
  const [error, setError] = useState(null);  // State to store any error messages
  const [loading, setLoading] = useState(true);  // State to manage loading status
  const [qrCodeVisible, setQrCodeVisible] = useState(null);  // State to store the locationId for which the QR code is visible

  /**
   * useEffect - Fetches the locations and project data when the component mounts or when the projectId changes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await getLocationsByProjectId(id);  // Fetch locations for the project
        setLocations(locations);
        const projectResponse = await getProjectById(id);  // Fetch project details by projectId
        if (projectResponse.length > 0) {
          const project = projectResponse[0];
          setProjectTitle(project.title);  // Set the project title
        } else {
          setError('Project not found');  // Set error if project is not found
        }
      } catch (error) {
        setError(`Failed to load locations: ${error.message}`);  // Handle errors during data fetching
      } finally {
        setLoading(false);  // Stop the loading state
      }
    };
    fetchData();
  }, [id]);  // Run this effect when the projectId changes

  /**
   * handleDelete - Deletes a specific location by its ID.
   * 
   * @param {number} locationId - The ID of the location to delete.
   */
  const handleDelete = async (locationId) => {
    try {
      await deleteLocation(locationId);  // Call API to delete the location
      setLocations(locations.filter((location) => location.id !== locationId));  // Update state by removing the deleted location
    } catch (error) {
      setError(`Failed to delete location: ${error.message}`);  // Set error message if deletion fails
    }
  };

  /**
   * handlePrintQrCode - Handles the QR code display for a location.
   * 
   * Displays a QR code for locations that are triggered by "QR Code" or "Both".
   * 
   * @param {number} locationId - The ID of the location to generate a QR code for.
   * @param {string} trigger - The trigger method of the location (e.g., "QR Code", "Both").
   */
  const handlePrintQrCode = (locationId, trigger) => {
    if (trigger === 'QR Code' || trigger === 'Both') {
      setQrCodeVisible(locationId);  // Show QR code if the trigger supports it
    } else {
      alert('This location does not support QR Code.');  // Display an alert if QR code is not supported
    }
  };

  // Display loading message while fetching data
  if (loading) return <div>Loading locations...</div>;
  // Display error message if there is an error
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">  {/* Bootstrap container with top margin */}
      <h1 className="mb-4">Exploring Project: {projectTitle} - Locations</h1> 
      
      {/* Buttons to add location and preview project */}
      <div className="d-flex mb-3">  {/* Bootstrap flexbox for button layout */}
        <Link to={`/project/${id}/add-location`} className="btn btn-primary">
          Add Location
        </Link>
        <button
          className="btn btn-secondary ms-3"
          onClick={() => navigate(`/project/${id}/preview`)}  // Navigate to the PreviewPage
        >
          Preview
        </button>
      </div>
      
      {/* List of project locations */}
      <div className="list-group">  {/* Bootstrap list group */}
        {locations.length > 0 ? (
          locations.map((location) => (
            <div key={location.id} className="list-group-item mb-3 p-3 border rounded">  {/* List item with Bootstrap styles */}
              <h5>{location.location_name}</h5>
              <p className="text-muted">Trigger: {location.location_trigger}</p>  {/* Display trigger type */}
              <p className="text-muted">Position: {location.location_position}</p>  {/* Display location coordinates */}
              <p className="text-muted">Points: {location.score_points}</p>  {/* Display points for the location */}
              
              {/* Buttons to edit, delete, and print QR code */}
              <div className="d-flex">  {/* Bootstrap flexbox for button layout */}
                <Link to={`/project/${id}/location/${location.id}/edit`} className="btn btn-outline-secondary btn-sm me-2">
                  Edit
                </Link>
                <button className="btn btn-outline-danger btn-sm me-2" onClick={() => handleDelete(location.id)}>
                  Delete
                </button>
                <button 
                  className="btn btn-outline-warning btn-sm" 
                  onClick={() => handlePrintQrCode(location.id, location.location_trigger)}
                >
                  Print QR Code
                </button>
              </div>

              {/* Display QR code only if the location supports QR Code trigger */}
              {qrCodeVisible === location.id && (
                <div className="mt-3">
                  <QRCode value={`Location: ${location.id}, Point: ${location.score_points}`} />  {/* Generate QR code */}
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No locations available for this project.</div>  
        )}
      </div>
    </div>
  );
}

export default ProjectLocations;

