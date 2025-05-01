import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
// Import the images 
import dogImage from "../../assets/dog1.png";
import rabbitImage from "../../assets/rabbit1.png";
import catImage from "../../assets/cat1.png";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-images">
            <img src={dogImage} alt="Dog" className="hero-pet-image hero-pet-image-dog" />
            <img src={rabbitImage} alt="Rabbit" className="hero-pet-image hero-pet-image-rabbit" />
            <img src={catImage} alt="Cat" className="hero-pet-image hero-pet-image-cat" />
          </div>
          <div className="hero-text-content">
            <h2 className="hero-title">WHERE EVERY <br /> PET'S JOY BEGINS!</h2>
            <p className="hero-text">
              We know your pets are cherished members of your family. <br />
              That's why we provide loving, personalized pet sitting services tailored to their needs.
            </p>
            <button 
              className="book-button" 
              onClick={() => navigate('/bookNow')}
            >
              Book Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;