import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <header className="navbar">
      <h1 className="logo">BawwaLK</h1>
      <nav className="nav-links">
        <Link to="/" className="nav-item">HOME</Link>
        
        <div 
          className="nav-item dropdown"
          onMouseEnter={() => setIsServicesOpen(true)}
          onMouseLeave={() => setIsServicesOpen(false)}
        >
          <Link to="/services">SERVICES</Link>
        </div>

        <div 
          className="nav-item dropdown"
          onMouseEnter={() => setIsShopOpen(true)}
          onMouseLeave={() => setIsShopOpen(false)}
        >
          <Link to="/shop/accessories">SHOP</Link>
        </div>

        <Link to="/aboutus" className="nav-item">ABOUT US</Link>
        <Link to="/team" className="nav-item">TEAM</Link>

        <div 
          className="nav-item dropdown"
          onMouseEnter={() => setIsBlogOpen(true)}
          onMouseLeave={() => setIsBlogOpen(false)}
        >
        </div>
      </nav>
      <div className="button-container">
        <button 
          className="book-now"
          onClick={() => navigate('/login')} // Added navigation
        >
          Sign In
        </button>
        <button 
          className="book-now"
          onClick={() => navigate('/userprofile')} // Added navigation
        >
          My Profile
        </button>
      </div>
    </header>
  );
};

export default Navbar;