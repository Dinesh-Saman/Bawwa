import React, { useState } from "react";
import axios from "axios";
import "./Booknow.css";

const Booknow = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    service: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }

    if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits.";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Email must contain '@'.";
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      newErrors.date = "Appointment date cannot be in the past.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setIsEmailValid(value.includes("@"));
    }
    if (name === "contact") {
      setIsContactValid(/^\d{10}$/.test(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/appointments/book", formData);
      setIsSuccess(true);
      console.log(response.data);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: "", email: "", contact: "", service: "", date: "", time: "" });
        setErrors({});
        setIsEmailValid(false);
        setIsContactValid(false);
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booknow-page">
      <div className="booknow-container">
        <h2 className="booknow-title">Book Your Appointment</h2>
        
        {isSuccess ? (
          <div className="success-message">
            <h3>Appointment Booked Successfully!</h3>
            <p>We've sent a confirmation to your email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booknow-form">
            <div className="booknow-row">
              <div className="booknow-column">
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter your email" 
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contact">Contact:</label>
                  <input 
                    type="tel" 
                    id="contact" 
                    name="contact" 
                    value={formData.contact} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter 10-digit number" 
                    maxLength="10"
                    disabled={!isEmailValid} 
                  />
                  {errors.contact && <span className="error-text">{errors.contact}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter your full name" 
                    disabled={!isContactValid} 
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              </div>

              <div className="booknow-column">
                <div className="form-group">
                  <label htmlFor="service">Service Type:</label>
                  <select 
                    id="service" 
                    name="service" 
                    value={formData.service} 
                    onChange={handleChange} 
                    required 
                    disabled={!isContactValid} 
                  >
                    <option value="">Select Service</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Veterinary">Veterinary</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Training">Training</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Appointment Date:</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleChange} 
                    required 
                    min={new Date().toISOString().split("T")[0]} 
                    disabled={!isContactValid} 
                  />
                  {errors.date && <span className="error-text">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">Appointment Time:</label>
                  <input 
                    type="time" 
                    id="time" 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange} 
                    required 
                    disabled={!isContactValid} 
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="booknow-button" 
                disabled={!isContactValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner"></span>
                ) : (
                  "Book Now"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Booknow;