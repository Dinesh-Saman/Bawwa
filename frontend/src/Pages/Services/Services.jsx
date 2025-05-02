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
      title: "Pet Diet Plans",
      path: "/services/diet-plan",
      description: "Professional pet diet plans for your pets",
      image: "https://img.petfoodindustry.com/files/base/wattglobalmedia/all/image/2016/11/pfi.Pet-food-research-1612PETresearch.png?auto=format%2Ccompress&fit=max&q=70&w=1200",
    },
    {
      title: "Nutrition Calculator",
      path: "/services/nutrition-calculator",
      description: "Nutrition Calculator for your pets.",
      image: "https://www.healthifyme.com/blog/wp-content/uploads/2022/05/Shutterstock_1505303738-1.jpg",
    },
    {
      title: "Recipe Suggestions",
      path: "/services/recipe-suggestions",
      description: "Recipe Suggestions for Your Pets",
      image: "https://t3.ftcdn.net/jpg/08/50/99/66/360_F_850996636_mMJS5odEMYKtj2QOh2rQ2184IE2VQ9u4.jpg",
    },
    {
      title: "Lost Pet",
      path: "/services/lostpet",
      description: "Helping you find your lost companions",
      image: "https://www.yarrah.com/thumbnail/fa/c7/c1/1644326846/Yarrah-missing-pet_1920x1920.jpg",
    },
    {
      title: "Nutrition Plans",
      path: "/services/nutrition-plans",
      description: "Nutrition Plans for your pets.",
      image: "https://mlo1wbhvgmgt.i.optimole.com/w:1024/h:538/q:mauto/f:best/https://pethero.co.za/wp-content/uploads/2023/07/pet-nutrition.jpg",
    },
    {
      title: "Vaccination Calculator",
      path: "/services/vaccinationcal",
      description: "Plan your pet's vaccination schedule",
      image: "https://supertails.com/cdn/shop/articles/dog-vaccination-cover-img-1698735072252.webp?v=1698735557",
    },
    {
      title: "Pet Model",
      path: "/services/pet-model",
      description: "Helping you find your lost companions",
      image: "https://preview.free3d.com/img/2018/04/2206062814886364264/e26d18gd.jpg",
    },
    {
      title: "Pet Image 3D",
      path: "/services/pet-3d",
      description: "Nutrition Plans for your pets.",
      image: "https://www.3dptk.com/images/806/LABRADOR-DOG-1.jpg",
    },
    {
      title: "Pet Accessories",
      path: "/shop/accessories",
      description: "Plan your pet's vaccination schedule",
      image: "https://img.freepik.com/free-photo/pet-accessories-still-life-with-chew-bone-toys_23-2148949561.jpg?semt=ais_hybrid&w=740",
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