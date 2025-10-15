import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PreviewPage.css';  // Import the stylesheet for this component
import { getLocationsByProjectId, getProjectById } from '../api/api';  // Import API methods to fetch project and location data

/**
 * PreviewPage Component - A preview interface for viewing a project's locations and testing the scoring system.
 * 
 * This component fetches project and location data by project ID, allows users to select different locations,
 * and tracks visited locations, points scored, and the total number of locations visited.
 * 
 * @returns {JSX.Element} The preview page for the project.
 */
function PreviewPage() {
  const { id } = useParams();  // Get the project ID from the URL parameters
  const [project, setProject] = useState({});  // State to store the project data
  const [locations, setLocations] = useState([]);  // State to store the list of locations
  const [selectedLocation, setSelectedLocation] = useState(null);  // State to store the currently selected location
  const [points, setPoints] = useState(0);  // State to store the user's current score
  const [locationsVisited, setLocationsVisited] = useState(0);  // State to store the number of locations visited
  const [visitedLocationIds, setVisitedLocationIds] = useState([]);  // Array to track visited location IDs
  const [maxPoints, setMaxPoints] = useState(0);  // State to store the maximum possible points for the project

  /**
   * useEffect - Fetch project and location data when the component mounts or when the project ID changes.
   * 
   * This effect fetches the project data by project ID and then fetches the locations associated with the project.
   * It also calculates the total maximum points available from all locations.
   */
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const projectData = await getProjectById(id);  // Fetch project data by ID
          const locationsData = await getLocationsByProjectId(id);  // Fetch locations by project ID
          if (projectData.length > 0) {
            setProject(projectData[0]);  // Set the first project as the current project
          }
          setLocations(locationsData);  // Set the fetched locations

          // Calculate the total maximum points by summing the score_points of all locations
          const totalPoints = locationsData.reduce((sum, loc) => sum + loc.score_points, 0);
          setMaxPoints(totalPoints);  // Set the maximum points for the project
        } catch (error) {
          console.error('Error fetching project or locations:', error);  // Handle errors in data fetching
        }
      };
      fetchData();
    } else {
      console.error("Invalid project ID:", id);  // Handle case where project ID is invalid
    }
  }, [id]);  // Re-run the effect when the project ID changes

  /**
   * handleLocationChange - Handles the selection of a new location from the dropdown.
   * 
   * When a location is selected, the component updates the state with the selected location,
   * and increments the points and visited locations if the location hasn't been visited before.
   * 
   * @param {Event} event - The event object from the location dropdown change.
   */
  const handleLocationChange = (event) => {
    const locationId = parseInt(event.target.value);  // Get the selected location ID from the event
    const location = locations.find(loc => loc.id === locationId);  // Find the location object by ID
    
    if (location && !visitedLocationIds.includes(locationId)) {
      // If the location hasn't been visited before, update the points and visited locations
      setPoints(points + location.score_points);  // Add the location's points to the total score
      setLocationsVisited(locationsVisited + 1);  // Increment the number of visited locations
      setVisitedLocationIds([...visitedLocationIds, locationId]);  // Add the location ID to the visited list
    }
    setSelectedLocation(location);  // Set the currently selected location
  };

  return (
    <div className="preview-container">  {/* Container for the preview page */}
      <h1>{project.title} - Preview</h1>  {/* Display the project title */}
      <label>Change Locations to Test Scoring:</label>
      <select onChange={handleLocationChange}>  {/* Dropdown to select locations */}
        <option value="">{project.homescreen_display === "Display initial clue" ? "Homescreen" : "Select a Location"}</option>  {/* Default option */}
        {locations.map(location => (
          <option key={location.id} value={location.id}>{location.location_name}</option>  
        ))}
      </select>

      <div className="mobile-preview">  {/* Container for the mobile preview section */}
        <h2>{project.title}</h2>  {/* Display project title */}
        <p><strong>Instructions:</strong> {project.instructions}</p>  {/* Display project instructions */}

        {/* Conditionally render the selected location's details or the initial clue/all locations */}
        {selectedLocation ? (
          <div>
            <h3>{selectedLocation.location_name}</h3>
            <p><strong>Clue: </strong>{selectedLocation.clue}</p>
            {/* Render the location content using dangerouslySetInnerHTML to handle embedded HTML, including images */}
            <div 
              className="location-content"
              dangerouslySetInnerHTML={{ __html: selectedLocation.location_content }}
            />
          </div>
        ) : (
          <div>
            {project.homescreen_display === "Display initial clue" ? (
              <p><strong>Initial Clue: </strong>{project.initial_clue}</p>  
            ) : (
              <p><strong>All Locations:</strong> {locations.map(loc => loc.location_name).join(', ')}</p>  
            )}
          </div>
        )}

        <div className="points-container">  {/* Container for the points and visited locations display */}
          <div>
            Points
            <span>{points} / {maxPoints}</span>  {/* Display the current points and maximum points */}
          </div>
          <div>
            Locations Visited
            <span>{locationsVisited} / {locations.length}</span>  {/* Display the number of visited locations out of total */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;



