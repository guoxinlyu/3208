import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap styles

/**
 * Home Component - The landing page of the application.
 * 
 * This component provides an introduction to the app with a welcoming message and 
 * a list of possible use cases (museum tours, treasure hunts, etc.). It includes 
 * a button to navigate to the projects page and an image to enhance the visual appeal.
 * 
 * @returns {JSX.Element} The homepage with a welcoming message and a "Get Started" button.
 */
function Home() {
  return (
    <div className="container d-flex justify-content-between align-items-center my-5">  {/* Bootstrap container with flexbox layout and margin */}
      <div>
        <h1 className="mb-4">Welcome to StoryPath!</h1>  {/* Heading with margin-bottom using Bootstrap */}
        <p>Create engaging tours, hunts, and adventures!</p>  {/* Description of the app's purpose */}
        <p>Museum Tours</p>
        <p>Campus Tours</p>
        <p>Treasure Hunts</p>
        <p>And more!</p>  {/* List of possible use cases for the app */}
        <Link to="/projects" className="btn btn-primary">Get Started</Link>  {/* Bootstrap button linking to the projects page */}
      </div>

      {/* Responsive image with custom size */}
      <img 
        src="/picture/homepage.jpg" 
        alt="Homepage" 
        className="img-fluid ml-3"  
        style={{ width: '300px' }}  
      />
    </div>
  );
}

export default Home;

