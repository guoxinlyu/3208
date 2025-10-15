import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define a custom map marker icon using the image from public/picture directory
const customIcon = new L.Icon({
  iconUrl: '/picture/icons8-location-50.png',  // Ensure the path points to the image in the public/picture directory
  iconSize: [50, 50],  // Set the size of the custom icon
  iconAnchor: [25, 50],  // Anchor the icon so that it is centered at the bottom
  popupAnchor: [0, -50]  // Anchor the popup above the icon
});

/**
 * LocationPicker Component - A map-based location picker using Leaflet and React-Leaflet.
 * 
 * This component allows users to click on the map to select a location (latitude and longitude).
 * The selected location is displayed with a custom marker, and the coordinates are passed to the parent component.
 * 
 * @param {Function} onLocationSelect - Callback function to pass the selected latitude and longitude to the parent component.
 * @param {Array} initialPosition - Initial position of the marker, provided by the parent component (optional).
 * 
 * @returns {JSX.Element} A map interface for selecting a location.
 */
const LocationPicker = ({ onLocationSelect, initialPosition }) => {
  // State to store the current selected position, defaulting to Brisbane coordinates if none are provided
  const [position, setPosition] = useState(initialPosition || [27.4975, 153.013276]);

  /**
   * MapClickHandler - A helper function to handle map click events.
   * 
   * When the user clicks on the map, it updates the marker's position and calls the `onLocationSelect` callback with the new coordinates.
   */
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;  // Extract latitude and longitude from the click event
        setPosition([lat, lng]);  // Update the selected position
        onLocationSelect([lat, lng]);  // Pass the coordinates to the parent component
      }
    });
    return null;  // This component does not render any JSX
  };

  /**
   * useEffect - Updates the map's position when a new initial position is provided.
   * 
   * If the parent component passes a new initial position, update the map marker to that location.
   */
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);  // Update the marker to the new initial position
    }
  }, [initialPosition]);  // Re-run this effect if the initialPosition changes

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>  {/* Initialize map with center and zoom level */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
      />
      <MapClickHandler />  {/* Add the click handler to the map */}
      {position && (
        <Marker position={position} icon={customIcon}>  {/* Display the custom icon marker at the selected position */}
          <Popup>Selected location: {position[0]}, {position[1]}</Popup>  {/* Show the coordinates in a popup */}
        </Marker>
      )}
    </MapContainer>
  );
};

export default LocationPicker;



