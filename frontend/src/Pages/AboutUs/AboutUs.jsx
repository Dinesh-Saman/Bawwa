import React from 'react';
import "./aboutus.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">BawwaLK</h1>
        <div className="about-subtitle">Where Pets Become Family</div>
      </div>

      <div className="about-content">
        <div className="about-card">
          <p className="about-text">
            Welcome to <span className="highlight">BawwaLK</span> – your go-to destination for premium pet care and accessories. 
            We are passionate about creating a better lifestyle for your furry friends by offering high-quality products, 
            expert advice, and a community that truly cares.
          </p>
        </div>

        <div className="about-card">
          <p className="about-text">
            Founded with love for pets, BawwaLK was built by a team of pet lovers, for pet lovers. 
            Whether you're looking for stylish pet accessories, healthy food options, or grooming essentials, 
            we've got everything your pet needs under one paw-some roof!
          </p>
        </div>

        <div className="about-card">
          <p className="about-text">
            Our mission is to make every pet's life happier, healthier, and more joyful. 
            Join the BawwaLK community and give your pets the care they deserve!
          </p>
        </div>
      </div>

      <div className="about-divider">
        <div className="paw-print">🐾</div>
        <div className="paw-print">🐾</div>
        <div className="paw-print">🐾</div>
      </div>

      <div className="why-choose-us">
        <h2 className="why-title">Why Choose Us?</h2>
        <ul className="why-list">
          <li>
            <span className="why-icon">🐾</span>
            <span>Premium, handpicked pet products</span>
          </li>
          <li>
            <span className="why-icon">⭐</span>
            <span>Trusted by hundreds of pet parents</span>
          </li>
          <li>
            <span className="why-icon">📞</span>
            <span>Friendly customer support</span>
          </li>
          <li>
            <span className="why-icon">🚚</span>
            <span>Fast and secure delivery</span>
          </li>
        </ul>
      </div>

      <a href="#join" className="about-button">
        <span>Join the Community</span>
        <span className="button-icon">→</span>
      </a>
      
      <div className="about-footer">
        <p>Follow us on social media for more pet tips and updates!</p>
        <div className="social-icons">
          <span className="social-icon">🐶</span>
          <span className="social-icon">🐱</span>
          <span className="social-icon">🐰</span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;