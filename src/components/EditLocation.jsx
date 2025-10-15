import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocationById, updateLocation } from '../api/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LocationPicker from './LocationPicker';

function EditLocation() {
  const { projectId, locationId } = useParams();
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    location_name: '',
    location_trigger: 'Location Entry',
    location_position: '',
    score_points: 0,
    clue: '',
    location_content: ''  // Rich text content for the location
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});  // To track specific field validation errors

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationArray = await getLocationById(locationId);
        const location = locationArray[0];

        if (location) {
          setFormData({
            location_name: location.location_name || '',
            location_trigger: location.location_trigger || 'Location Entry',
            location_position: location.location_position.replace(/[()]/g, '') || '',
            score_points: location.score_points || 0,
            clue: location.clue || '',
            location_content: location.location_content || ''
          });
        } else {
          setError('No location data found');
        }
      } catch (error) {
        setError('Error loading location data');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [locationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      location_content: content
    });
  };

  const handleLocationSelect = ([lat, lng]) => {
    setFormData({
      ...formData,
      location_position: `${lat},${lng}`
    });
  };

  const initialPosition = formData.location_position
    ? formData.location_position.split(',').map(Number)
    : null;

  // Validate form data
  const validateForm = () => {
    const errors = {};
    const latLongRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    const cleanedPosition = formData.location_position.replace(/[()]/g, '');

    if (!latLongRegex.test(cleanedPosition)) {
      errors.location_position = 'Invalid location position format. Expected format: latitude,longitude';
    }

    if (formData.score_points < 0) {
      errors.score_points = 'Points must be a positive number.';
    }

    // Check if content is empty or just a line break
    if (!formData.location_content || formData.location_content === '<p><br></p>') {
      errors.location_content = 'Location content is required.';
    }

    // Set errors if any
    setFieldErrors(errors);

    // Return true if no errors, otherwise false
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const locationData = {
          ...formData,
          location_position: formData.location_position.replace(/[()]/g, ''),
          id: locationId,
          project_id: projectId,
          username: "s4739502"
        };

        await updateLocation(locationId, locationData);
        navigate(`/view-location/${projectId}`);
      } catch (error) {
        console.error('Error updating location:', error);
        setError(`Failed to update location: ${error.message}`);
      }
    }
  };

  if (loading) return <div>Loading location data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };

  return (
    <div className="edit-location-container">
      <h1>Edit Location</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="location_name" className="form-label">Location Name</label>
          <input
            type="text"
            id="location_name"
            name="location_name"
            className={`form-control ${fieldErrors.location_name ? 'is-invalid' : ''}`}
            value={formData.location_name}
            onChange={handleChange}
            required
          />
          {fieldErrors.location_name && (
            <div className="invalid-feedback">
              {fieldErrors.location_name}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="location_trigger" className="form-label">Location Trigger</label>
          <select
            id="location_trigger"
            name="location_trigger"
            className="form-select"
            value={formData.location_trigger}
            onChange={handleChange}
          >
            <option value="Location Entry">Location Entry</option>
            <option value="QR Code">QR Code</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location_position" className="form-label">Location Position (lat, long)</label>
          <LocationPicker onLocationSelect={handleLocationSelect} initialPosition={initialPosition} />
          <input
            type="text"
            id="location_position"
            name="location_position"
            className={`form-control ${fieldErrors.location_position ? 'is-invalid' : ''}`}
            value={formData.location_position}
            onChange={handleChange}
            required
            placeholder="e.g. 27.4975,153.013276"
          />
          {fieldErrors.location_position && (
            <div className="invalid-feedback">
              {fieldErrors.location_position}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="score_points" className="form-label">Points for Reaching Location</label>
          <input
            type="number"
            id="score_points"
            name="score_points"
            className={`form-control ${fieldErrors.score_points ? 'is-invalid' : ''}`}
            value={formData.score_points}
            onChange={handleChange}
            required
            min="0"
          />
          {fieldErrors.score_points && (
            <div className="invalid-feedback">
              {fieldErrors.score_points}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="clue" className="form-label">Clue</label>
          <textarea
            id="clue"
            name="clue"
            className="form-control"
            value={formData.clue}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location_content" className="form-label">Location Content</label>
          <ReactQuill
            value={formData.location_content}
            onChange={handleContentChange}
            className={`quill-editor ${fieldErrors.location_content ? 'is-invalid' : ''}`}
            modules={modules}
          />
          {fieldErrors.location_content && (
            <div className="invalid-feedback">
              {fieldErrors.location_content}
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Save Location</button>
      </form>
    </div>
  );
}

export default EditLocation;
