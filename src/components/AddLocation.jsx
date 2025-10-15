import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createLocation } from '../api/api';  // API call to create a new location
import ReactQuill from 'react-quill';  // Import rich text editor
import LocationPicker from './LocationPicker';  // Component for selecting geographical locations via a map
import 'react-quill/dist/quill.snow.css';  // Quill editor styling

function AddLocation() {
  const { projectId } = useParams();  // Extract projectId from the URL parameters
  const navigate = useNavigate();  // Navigate function for redirecting users

  // State to manage form data
  const [formData, setFormData] = useState({
    location_name: '',  // The name of the location
    location_trigger: 'Location Entry',  // Default trigger for the location
    location_position: '',  // Will be updated by the map-based location picker
    score_points: 0,  // Points for reaching the location
    clue: '',  // Optional clue for reaching the next location
    location_content: ''  // Rich text content for the location
  });

  const [error, setError] = useState(null);  // State to store any error messages
  const [fieldErrors, setFieldErrors] = useState({});  // State to store individual field errors

  // Handle input change for the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value  // Update the specific field in the form data
    });
  };

  // Handle map-based location picker to get latitude and longitude
  const handleLocationSelect = ([lat, lng]) => {
    setFormData({
      ...formData,
      location_position: `${lat},${lng}`  // Update the location_position with selected coordinates
    });
  };

  // Handle content change from the ReactQuill editor
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      location_content: content  // Update the location_content in formData
    });
  };

  // Toolbar configuration for ReactQuill, includes support for images
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],  // Includes image support
      [{ 'color': [] }, { 'background': [] }],
      ['clean']  // Clear formatting
    ],
  };

  // Validate the form before submitting
  const validateForm = () => {
    const latLongRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    const cleanedPosition = formData.location_position.replace(/[()]/g, '');

    if (!latLongRegex.test(cleanedPosition)) {
      setError("Invalid location position format. Expected format: latitude,longitude");
      return false;
    }

    if (formData.score_points < 0) {
      setError("Points must be a positive number.");
      return false;
    }

    return true;
  };

  // Handle form submission to create a new location
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Field validation
    const errors = {};
    if (!formData.location_name.trim()) {
      errors.location_name = 'Location name is required';
    }
    if (!formData.location_position) {
      errors.location_position = 'Location position is required';
    }
    if (!formData.location_content || formData.location_content === '<p><br></p>') {  // Check if content is empty or just a line break
      errors.location_content = 'Location content is required';
    }
  
    // If there are errors, set field errors and stop form submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
  
    try {
      const locationData = {
        ...formData,
        project_id: projectId,
        username: "s4739502"
      };
  
      await createLocation(locationData);
      navigate(`/view-location/${projectId}`);
    } catch (error) {
      console.error('Error adding location:', error);
      setError(`Failed to add location: ${error.message}`);
    }
  };
  

  return (
    <div className="add-location-container">
      <h1>Add Location to Project {projectId}</h1>

      {/* Form for adding a new location */}
      <form className="add-location-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Location Name</label>
          <input
            type="text"
            name="location_name"
            value={formData.location_name}
            onChange={handleChange}
            className={`form-control ${fieldErrors.location_name ? 'is-invalid' : ''}`}
            required
          />
          {fieldErrors.location_name && (
            <div className="invalid-feedback">
              {fieldErrors.location_name}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label>Location Trigger</label>
          <select
            name="location_trigger"
            value={formData.location_trigger}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Location Entry">Location Entry</option>
            <option value="QR Code Scan">QR Code Scan</option>
            <option value="Both">Both Location Entry and QR Code Scan</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Location Position (Lat, Long)</label>
          <LocationPicker onLocationSelect={handleLocationSelect} />
          <input
            type="text"
            name="location_position"
            value={formData.location_position}
            readOnly
            className={`form-control ${fieldErrors.location_position ? 'is-invalid' : ''}`}
          />
          {fieldErrors.location_position && (
            <div className="invalid-feedback">
              {fieldErrors.location_position}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label>Points for Reaching Location</label>
          <input
            type="number"
            name="score_points"
            value={formData.score_points}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Clue</label>
          <textarea
            name="clue"
            value={formData.clue}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Location Content</label>
          <ReactQuill
          value={formData.location_content}
          onChange={handleContentChange}
          className={`quill-editor ${fieldErrors.location_content ? 'is-invalid' : ''}`}  // Conditional class for validation
          modules={modules}  // Add the toolbar configuration for image support
          />
          {fieldErrors.location_content && (
            <div className="invalid-feedback">
              {fieldErrors.location_content}
              </div>
            )}
        </div>

        <button type="submit" className="btn btn-primary">Save Location</button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default AddLocation;


