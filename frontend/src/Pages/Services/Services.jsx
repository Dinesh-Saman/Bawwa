// Services.jsx (Enhanced)
import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";
// Import images
import groomingImg from "../../assets/grooming.png";
import trainingImg from "../../assets/training.png";
import boardingImg from "../../assets/boarding.png";
import lostPetImg from "../../assets/lostpets.png";
import vetCareImg from "../../assets/vet.png";
import vaccinationImg from "../../assets/vacical.png";

const Services = () => {
  const services = [
    {
      title: "Grooming",
      path: "/services/grooming",
      description: "Professional grooming services for your pets",
      image: groomingImg,
    },
    {
      title: "Training",
      path: "/services/training",
      description: "Expert training programs for all pet ages",
      image: trainingImg,
    },
    {
      title: "Pet Boarding",
      path: "/services/boarding",
      description: "Safe and comfortable boarding facilities",
      image: boardingImg,
    },
    {
      title: "Lost Pet",
      path: "/services/lostpet",
      description: "Helping you find your lost companions",
      image: lostPetImg,
    },
    {
      title: "Veterinary Care",
      path: "/services/veterinary",
      description: "Comprehensive health care services",
      image: vetCareImg,
    },
    {
      title: "Vaccination Calculator",
      path: "/services/vaccinationcal",
      description: "Plan your pet's vaccination schedule",
      image: vaccinationImg,
    },
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h1 className="services-title">Our Premium Services</h1>
          <p className="services-subtitle">Exceptional care for your beloved pets</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <article key={index} className="service-card">
              <div className="service-image-container">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="service-image" 
                  loading="lazy"
                />
              </div>
              <div className="service-content">
                <h2 className="service-title">{service.title}</h2>
                <p className="service-description">{service.description}</p>
                <Link 
                  to={service.path} 
                  className="service-link"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn More
                  <svg className="link-arrow" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;