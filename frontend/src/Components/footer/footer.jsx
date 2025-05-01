import React from "react";
import { useNavigate } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    navigate("/feedback");
  };

  return (
    <footer className="footer">
      <div className="footer-section">
        <h3 className="footer-title">OPEN HOURS</h3>
        <p>Mon - Fri: 9:00 AM to 6:00 PM</p>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">LOCATION</h3>
        <p>123 Maple Street, Springfield</p>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">CONTACT</h3>
        <p>648-432-2785</p>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">FEEDBACK</h3>
        <button 
          className="feedback-button"
          onClick={handleFeedbackClick}
        >
          Feedback Us
        </button>
      </div>
    </footer>
  );
};

export default Footer;