// src/components/Footer.jsx
import React from 'react';

/**
 * Footer Component - A simple footer displayed at the bottom of the page.
 * 
 * This component renders a footer element with some copyright information and
 * dynamically displays the current year using JavaScript's Date object.
 * 
 * @returns {JSX.Element} The footer section.
 */
function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-5">  {/* Bootstrap classes for styling the footer */}
      <div className="container p-4">  {/* Bootstrap container with padding */}
        <div className="text-center">  {/* Center-aligned text */}
          <p>© {new Date().getFullYear()} React Chef. All rights reserved.</p>  {/* Display current year and copyright text */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
