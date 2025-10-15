import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Header Component - A navigation bar for the application.
 * 
 * This component renders a Bootstrap-based navbar with links dynamically generated
 * from the `navLinks` prop. The current location is used to highlight the active link.
 * 
 * @param {string} brandText - The text displayed as the brand in the navbar.
 * @param {Array} navLinks - An array of objects representing the navigation links, each with a `path` and `text`.
 * 
 * @returns {JSX.Element} The header section with a navigation bar.
 */
function Header({ brandText, navLinks }) {
  const location = useLocation();  // Hook to get the current URL path

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">  {/* Bootstrap classes for a light-colored, responsive navbar */}
      <div className="container">  {/* Bootstrap container to center and contain the navbar elements */}
        <Link to="/" className="navbar-brand">{brandText}</Link>  {/* Brand text linking to the home page */}
        
        {/* Button to toggle the navbar on smaller screens */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Collapsible navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">  {/* Align the nav links to the right using 'ms-auto' */}
            {navLinks.map((link, index) => (
              <li className="nav-item" key={index}>  {/* Iterate through the navLinks prop and render each as a list item */}
                <Link 
                  to={link.path}  // Link to the specified path
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}  // Highlight the active link based on the current URL
                >
                  {link.text}  {/* Display the text for each link */}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
