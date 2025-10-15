import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import React Router for routing
import Header from './components/Header';  // Import the Header component
import Home from './components/Home';  // Import the Home component
import Footer from './components/Footer';  // Import the Footer component
import ProjectList from './components/ProjectList';  // Import the ProjectList component to display a list of projects
import AddProject from './components/AddProject';  // Import AddProject component to add new projects
import EditProject from './components/EditProject';  // Import EditProject component to edit existing projects
import ProjectDetail from './components/ProjectDetail';  // Import ProjectDetail component for project details view
import ProjectLocations from './components/ProjectLocations';  // Import ProjectLocations component to show project locations
import AddLocation from './components/AddLocation';  // Import AddLocation component to add new locations
import EditLocation from './components/EditLocation';  // Import EditLocation component to edit locations
import PreviewPage from './components/PreviewPage';  // Import PreviewPage component to preview the project
import 'leaflet/dist/leaflet.css';  // Import Leaflet CSS for map styling
import './App.css';  // Import custom app styles

/**
 * The App component serves as the main entry point for the React application.
 * It utilizes React Router to handle page navigation and renders different
 * components based on the route.
 * 
 * @returns {JSX.Element} The main layout and routing configuration for the application
 */
function App() {
  // Define navigation links for the header. These will be displayed in the app's navigation bar.
  const navLinks = [
    { path: '/', text: 'Home' },  // Navigation link for the Home page
    { path: '/projects', text: 'Projects' }  // Navigation link for the Projects page
  ];

  return (
    <Router>  {/* Wrap the application in Router to enable route handling */}
      <div className="app-container">  {/* Main container for the app layout */}
        {/* Render the Header component and pass the brand text and navigation links */}
        <Header brandText="STORYPATH" navLinks={navLinks} />  
        
        <div className="content-container">  {/* Container for dynamically loaded page content */}
          {/* Define the routes and their corresponding components */}
          <Routes>
            {/* Route for the Home page */}
            <Route path="/" element={<Home />} />
            {/* Route for the Project List page */}
            <Route path="/projects" element={<ProjectList />} />
            {/* Route for the Add Project page */}
            <Route path="/add-project" element={<AddProject />} />
            {/* Route for the Project Detail page (shows details of a specific project) */}
            <Route path="/project/:id" element={<ProjectDetail />} />
            {/* Route for editing an existing project */}
            <Route path="/edit-project/:id" element={<EditProject />} />
            {/* Route for viewing the list of locations associated with a project */}
            <Route path="/view-location/:id" element={<ProjectLocations />} />
            {/* Route for adding a new location to a project */}
            <Route path="/project/:projectId/add-location" element={<AddLocation />} />
            {/* Route for editing an existing location */}
            <Route path="/project/:projectId/location/:locationId/edit" element={<EditLocation />} />
            {/* Route for previewing a project and its associated locations */}
            <Route path="/project/:id/preview" element={<PreviewPage />} />
          </Routes>
        </div>

        {/* Render the Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;  // Export the App component as the default export of this file






