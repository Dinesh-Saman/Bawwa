import { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    feedbackType: "Service Experience",
    details: "",
    rating: 0,
    suggestions: "",
    file: null,
    consent: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Details are required";
    } else if (formData.details.length < 10) {
      newErrors.details = "Details must be at least 10 characters";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please provide a rating";
    }

    if (!formData.consent) {
      newErrors.consent = "You must agree to allow us to use your feedback";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Feedback submitted:", formData);
      alert("Thank you for your feedback!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        feedbackType: "Service Experience",
        details: "",
        rating: 0,
        suggestions: "",
        file: null,
        consent: false,
      });
      setErrors({});
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h2>Share Your Feedback</h2>
          <p>We value your opinion to help us improve our services</p>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-row">
            <div className="form-group">
              <label>Your Name*</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error-input" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Your Email*</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "error-input" : ""}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Feedback Type</label>
            <select 
              name="feedbackType" 
              value={formData.feedbackType} 
              onChange={handleChange}
            >
              <option>Service Experience</option>
              <option>Website Usability</option>
              <option>Veterinarian Consultation</option>
              <option>Pet Grooming & Care</option>
              <option>Customer Support</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Your Experience*</label>
            <textarea
              name="details"
              placeholder="Tell us about your experience..."
              value={formData.details}
              onChange={handleChange}
              rows="4"
              className={errors.details ? "error-input" : ""}
            ></textarea>
            {errors.details && <span className="error-message">{errors.details}</span>}
          </div>

          <div className="form-group">
            <label>Rating*</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star ${star <= formData.rating ? "active" : ""}`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>

          <div className="form-group">
            <label>Suggestions for Improvement</label>
            <textarea
              name="suggestions"
              placeholder="What can we do better?"
              value={formData.suggestions}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Screenshot (Optional)</label>
            <div className="file-upload">
              <input 
                type="file" 
                name="file" 
                id="file-upload" 
                onChange={handleChange} 
                className="file-input"
              />
              <label htmlFor="file-upload" className="file-label">
                Choose File
              </label>
              {formData.file && <span className="file-name">{formData.file.name}</span>}
            </div>
          </div>

          <div className="form-group consent-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="consent"
                id="consent-checkbox"
                checked={formData.consent}
                onChange={handleChange}
                className={errors.consent ? "error-input" : ""}
              />
              <label >
                I agree to allow Bawwa.lk to use my feedback for service improvements
              </label>
            </div>
            {errors.consent && <span className="error-message">{errors.consent}</span>}
          </div>

          <button type="submit" className="feedback-submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;