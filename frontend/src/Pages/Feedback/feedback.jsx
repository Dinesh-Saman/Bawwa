import { useState, useEffect } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
  });

  // Real-time validation for email
  useEffect(() => {
    if (touched.email) {
      let emailError = "";
      if (!formData.email.trim()) {
        emailError = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        emailError = "Please enter a valid email address (e.g., example@domain.com)";
      }
      setErrors(prev => ({ ...prev, email: emailError }));
    }
  }, [formData.email, touched.email]);

  // Real-time validation for phone
  useEffect(() => {
    if (touched.phone && formData.phone) {
      let phoneError = "";
      if (!/^\d{10}$/.test(formData.phone)) {
        phoneError = "Phone number must be exactly 10 digits";
      }
      setErrors(prev => ({ ...prev, phone: phoneError }));
    }
  }, [formData.phone, touched.phone]);

  const validate = () => {
    let newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., example@domain.com)";
    }

    // Phone validation - must be exactly 10 digits if provided
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Feedback details validation
    if (!formData.details.trim()) {
      newErrors.details = "Details are required";
    } else if (formData.details.length < 10) {
      newErrors.details = "Details must be at least 10 characters";
    }

    // Rating validation
    if (formData.rating === 0) {
      newErrors.rating = "Please provide a rating";
    }

    // Consent validation
    if (!formData.consent) {
      newErrors.consent = "You must agree to allow us to use your feedback";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Special handling for phone input
    if (name === "phone") {
      // Remove all non-digit characters and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: digitsOnly
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
      });
    }

    // Mark field as touched when changed
    if (['email', 'phone'].includes(name) && !touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (['email', 'phone'].includes(name)) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validate()) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Feedback submitted:", formData);
        alert("Thank you for your feedback!");
        
        // Reset form
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
        setTouched({
          email: false,
          phone: false,
        });
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit feedback. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h2>Share Your Feedback</h2>
          <p>We value your opinion to help us improve our services</p>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error-input" : ""}
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? "error-input" : ""}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              className={errors.phone ? "error-input" : ""}
              onKeyDown={(e) => {
                // Prevent non-numeric characters except control keys
                if (!/\d|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              pattern="\d{10}"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
            {formData.phone && formData.phone.length < 10 && (
              <span className="error-message">Phone number must be 10 digits</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="feedbackType">Feedback Type</label>
            <select 
              id="feedbackType"
              name="feedbackType" 
              value={formData.feedbackType} 
              onChange={handleChange}
            >
              <option value="Service Experience">Service Experience</option>
              <option value="Website Usability">Website Usability</option>
              <option value="Veterinarian Consultation">Veterinarian Consultation</option>
              <option value="Pet Grooming & Care">Pet Grooming & Care</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="details">Your Experience*</label>
            <textarea
              id="details"
              name="details"
              placeholder="Tell us about your experience..."
              value={formData.details}
              onChange={handleChange}
              rows="4"
              className={errors.details ? "error-input" : ""}
              required
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleRating(star);
                    }
                  }}
                  tabIndex="0"
                  aria-label={`Rate ${star} star`}
                />
              ))}
            </div>
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="suggestions">Suggestions for Improvement</label>
            <textarea
              id="suggestions"
              name="suggestions"
              placeholder="What can we do better?"
              value={formData.suggestions}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="file-upload">Upload Screenshot (Optional)</label>
            <div className="file-upload">
              <input 
                type="file" 
                id="file-upload"
                name="file" 
                onChange={handleChange} 
                className="file-input"
                accept="image/*,.pdf"
              />
              <label htmlFor="file-upload" className="file-label">
                Choose File
              </label>
              {formData.file && (
                <span className="file-name">
                  {formData.file.name.length > 20 
                    ? `${formData.file.name.substring(0, 15)}...${formData.file.name.split('.').pop()}` 
                    : formData.file.name}
                </span>
              )}
            </div>
          </div>

          <div className="form-group consent-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="consent-checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className={errors.consent ? "error-input" : ""}
                required
              />
              <label htmlFor="consent-checkbox">
                I agree to allow Bawwa.lk to use my feedback for service improvements
              </label>
            </div>
            {errors.consent && <span className="error-message">{errors.consent}</span>}
          </div>

          <button 
            type="submit" 
            className="feedback-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;