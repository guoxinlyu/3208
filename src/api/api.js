const BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3Mzk1MDIifQ.hU87a2GSb3PiZOZC7YNNqpDgYLoVoUVFTn4yhoHacJo'; // JWT token for authentication

/**
 * General API request function.
 * Handles different HTTP methods for interacting with the API.
 * 
 * @param {string} endpoint - The API endpoint to interact with.
 * @param {string} [method='GET'] - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - Optional body of the request, typically used for POST or PUT.
 * @returns {Promise} - Resolves to the API response data, or throws an error if the request fails.
 */
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',  // Ensure the content type is JSON
      'Authorization': `Bearer ${JWT_TOKEN}`  // JWT for authorization
    },
  };

  if (body) {
    options.body = JSON.stringify(body);  // Add the body to the request if provided
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);  // Make the API request

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();  // Parse the response as JSON if applicable
    } else {
      return null;  // Return null if there's no response body
    }

  } catch (error) {
    console.error("API request failed:", error);  // Log any errors
    throw error;  // Rethrow the error so it can be handled by the caller
  }
};

/**
 * Fetches all projects from the API.
 * 
 * @returns {Promise<object[]>} - A promise that resolves to an array of project objects.
 */
export const getAllProjects = async () => {
  return apiRequest('/project', 'GET');
};

/**
 * Fetches a project by its ID.
 * 
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - A promise that resolves to the project data.
 */
export const getProjectById = async (id) => {
  return apiRequest(`/project?id=eq.${id}`, 'GET');
};

/**
 * Creates a new project.
 * 
 * @param {object} project - The project data to be created.
 * @returns {Promise<object>} - A promise that resolves to the created project data.
 */
export const createProject = async (project) => {
  console.log('Creating project with data:', project);  // Debug log for the project data being created
  return apiRequest('/project', 'POST', project);
};

/**
 * Updates an existing project by its ID.
 * 
 * @param {string} id - The ID of the project to update.
 * @param {object} project - The updated project data.
 * @returns {Promise<object>} - A promise that resolves to the updated project data.
 */
export const updateProject = async (id, project) => {
  const projectData = {
    id,
    title: project.title,
    description: project.description,
    instructions: project.instructions,
    initial_clue: project.initial_clue,
    homescreen_display: project.homescreen_display,
    participant_scoring: project.participant_scoring,
    is_published: project.is_published,
    username: "s4739502"  // The fixed username
  };

  return apiRequest(`/project?id=eq.${id}`, 'PUT', projectData);
};

/**
 * Deletes a project by its ID.
 * 
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<void>} - A promise that resolves when the project is deleted.
 */
export const deleteProject = async (id) => {
  console.log(`Attempting to delete project with id: ${id}`);  // Debug log for deletion
  return apiRequest(`/project?id=eq.${id}`, 'DELETE');
};

/**
 * Fetches all locations for a given project ID.
 * 
 * @param {string} projectId - The ID of the project to retrieve locations for.
 * @returns {Promise<object[]>} - A promise that resolves to an array of location objects.
 */
export const getLocationsByProjectId = async (projectId) => {
  return apiRequest(`/location?project_id=eq.${projectId}`, 'GET');
};

/**
 * Creates a new location.
 * 
 * @param {object} location - The location data to be created.
 * @returns {Promise<object>} - A promise that resolves to the created location data.
 */
export const createLocation = async (location) => {
  console.log('Creating location with data:', location);  // Debug log for the location data being created
  return apiRequest('/location', 'POST', location);
};

/**
 * Updates an existing location by its ID.
 * 
 * @param {string} id - The ID of the location to update.
 * @param {object} location - The updated location data.
 * @returns {Promise<object>} - A promise that resolves to the updated location data.
 */
export const updateLocation = async (id, location) => {
  const locationData = {
    id,  // Include locationId
    location_name: location.location_name,
    location_trigger: location.location_trigger,
    location_position: location.location_position,
    score_points: location.score_points,
    clue: location.clue,
    location_content: location.location_content,
    project_id: location.project_id,  // Include projectId
    username: "s4739502"  // Fixed username
  };

  console.log("Sending locationData:", locationData);  // Debug log for the location data
  return apiRequest(`/location?id=eq.${id}`, 'PUT', locationData);
};

/**
 * Deletes a location by its ID.
 * 
 * @param {string} id - The ID of the location to delete.
 * @returns {Promise<void>} - A promise that resolves when the location is deleted.
 */
export const deleteLocation = async (id) => {
  console.log(`Attempting to delete location with id: ${id}`);  // Debug log for deletion
  return apiRequest(`/location?id=eq.${id}`, 'DELETE');
};

/**
 * Fetches a location by its ID.
 * 
 * @param {string} id - The ID of the location to retrieve.
 * @returns {Promise<object>} - A promise that resolves to the location data.
 */
export const getLocationById = async (id) => {
  return apiRequest(`/location?id=eq.${id}`, 'GET');
};
