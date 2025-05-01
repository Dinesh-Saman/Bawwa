import React, { useState, useRef } from "react";
import { Dog, Cat, Upload, X, Venus, Mars, ChevronLeft, ChevronRight } from "lucide-react";
import { FaUser, FaPaw, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import bgImage from "../../assets/1.png";
import "./Register.css";

const Register = ({ onClose }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user: { firstName: "", lastName: "", email: "", phone: "" },
    pet: { name: "", type: "", breed: "", age: "", gender: "", birthdate: "", medicalConditions: "", image: null }
  });

  const [errors, setErrors] = useState({});

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      user: { ...prev.user, [name]: value }
    }));
  };

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      pet: { ...prev.pet, [name]: value }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({
          ...prev,
          pet: { ...prev.pet, image: reader.result }
        }));
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      pet: { ...prev.pet, image: null }
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.user.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.user.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.user.email.trim() || !/\S+@\S+\.\S+/.test(formData.user.email)) newErrors.email = "Valid email is required";
    if (!formData.user.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.pet.name.trim()) newErrors.petName = "Pet name is required";
    if (!formData.pet.breed.trim()) newErrors.petBreed = "Pet breed is required";
    if (!formData.pet.age.trim()) newErrors.petAge = "Pet age is required";
    if (!formData.pet.gender) newErrors.petGender = "Pet gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData.user,
          password: "defaultPassword123",
          pet: formData.pet,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("🎉 Registration Successful!");
        navigate('/login');
      } else {
        alert(`❗ Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  
    // Reset form
    setStep(1);
    setFormData({
      user: { firstName: "", lastName: "", email: "", phone: "" },
      pet: {
        name: "",
        type: "",
        breed: "",
        age: "",
        gender: "",
        birthdate: "",
        medicalConditions: "",
        image: null,
      },
    });
  };

  const petTypes = [
    { value: "dog", label: "Dog", icon: Dog },
    { value: "cat", label: "Cat", icon: Cat }
  ];

  const genderOptions = [
    { value: "male", label: "Male", icon: Mars },
    { value: "female", label: "Female", icon: Venus }
  ];

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="register-container">
          <div className="register-header">
            <h1>Create Your Account</h1>
            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                <span>1</span>
                <p>Owner Info</p>
              </div>
              <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                <span>2</span>
                <p>Pet Details</p>
              </div>
              <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
                <span>3</span>
                <p>Review</p>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form className="form-container">
              <h2><FaUser className="form-icon" /> Owner Information</h2>
              <div className="input-row">
                <div className="input-group">
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.user.firstName} 
                    onChange={handleUserChange} 
                    placeholder="First Name" 
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.user.lastName} 
                    onChange={handleUserChange} 
                    placeholder="Last Name" 
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.user.email} 
                    onChange={handleUserChange} 
                    placeholder="Email" 
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="input-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.user.phone} 
                    onChange={handleUserChange} 
                    placeholder="Phone Number" 
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={nextStep} className="next-button" style={{width:'100%'}}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="form-container">
              <h2><FaPaw className="form-icon" /> Pet Information</h2>
              
              <div className="input-group">
                <input 
                  type="text" 
                  name="name" 
                  value={formData.pet.name} 
                  onChange={handlePetChange} 
                  placeholder="Pet Name" 
                  className={errors.petName ? "error" : ""}
                />
                {errors.petName && <span className="error-message">{errors.petName}</span>}
              </div>
              
              <div className="input-group">
                <input 
                  type="text" 
                  name="breed" 
                  value={formData.pet.breed} 
                  onChange={handlePetChange} 
                  placeholder="Breed" 
                  className={errors.petBreed ? "error" : ""}
                />
                {errors.petBreed && <span className="error-message">{errors.petBreed}</span>}
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <input 
                    type="date" 
                    name="birthdate" 
                    value={formData.pet.birthdate} 
                    onChange={handlePetChange} 
                    className="date-input"
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="age" 
                    value={formData.pet.age} 
                    onChange={handlePetChange} 
                    placeholder="Age (if birthdate unknown)" 
                    className={errors.petAge ? "error" : ""}
                  />
                  {errors.petAge && <span className="error-message">{errors.petAge}</span>}
                </div>
              </div>

              <h3>Select Pet Type</h3>
              <div className="pet-type-container">
                {petTypes.map(({ value, label, icon: Icon }) => (
                  <button 
                    key={value} 
                    type="button" 
                    onClick={() => setFormData((prev) => ({ ...prev, pet: { ...prev.pet, type: value } }))} 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.8rem",
                      border: `1px solid ${formData.pet.type === value ? '#F97316' : '#e2e8f0'}`,
                      borderRadius: "8px",
                      background: formData.pet.type === value ? '#F97316' : 'white',
                      color: formData.pet.type === value ? 'white' : 'black',
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      flex: 1
                    }}
                  >
                    <Icon 
                      size={20} 
                      style={{
                        color: formData.pet.type === value ? 'white' : 'black'
                      }} 
                    /> 
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <h3>Select Gender</h3>
              <div className="gender-container" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {genderOptions.map(({ value, label, icon: Icon }) => (
                  <button 
                    key={value} 
                    type="button" 
                    onClick={() => setFormData((prev) => ({ ...prev, pet: { ...prev.pet, gender: value } }))} 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.8rem",
                      border: `1px solid ${formData.pet.gender === value ? '#F97316' : '#e2e8f0'}`,
                      borderRadius: "8px",
                      background: formData.pet.gender === value ? '#F97316' : 'white',
                      color: formData.pet.gender === value ? 'white' : 'black',
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      flex: 1
                    }}
                  >
                    <Icon 
                      size={18} 
                      style={{
                        color: formData.pet.gender === value ? 'white' : 'black'
                      }} 
                    /> 
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <h3>Upload Pet Image</h3>
              <div className="image-upload-container">
                <label className="upload-label">
                  <Upload size={20} /> Choose File
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" hidden />
                </label>
                {formData.pet.image && (
                  <div className="image-preview">
                    <img src={formData.pet.image} alt="Pet preview" />
                    <button type="button" onClick={removeImage} className="remove-image">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={prevStep} className="back-button" style={{width:'50%', marginRight:'10px'}}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button type="button" onClick={nextStep} className="next-button"  style={{width:'50%'}}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="review-container">
              <h2>Review Your Information</h2>
              
              <div className="review-section">
                <h3><FaUser /> Owner Details</h3>
                <div className="review-details">
                  <p><strong>Name:</strong> {formData.user.firstName} {formData.user.lastName}</p>
                  <p><strong>Email:</strong> {formData.user.email}</p>
                  <p><strong>Phone:</strong> {formData.user.phone}</p>
                </div>
              </div>
              
              <div className="review-section">
                <h3><FaPaw /> Pet Details</h3>
                <div className="review-details">
                  <p><strong>Name:</strong> {formData.pet.name}</p>
                  <p><strong>Type:</strong> {formData.pet.type.charAt(0).toUpperCase() + formData.pet.type.slice(1)}</p>
                  <p><strong>Breed:</strong> {formData.pet.breed}</p>
                  <p><strong>Birthdate:</strong> {formData.pet.birthdate || "Not specified"}</p>
                  <p><strong>Age:</strong> {formData.pet.age}</p>
                  <p><strong>Gender:</strong> {formData.pet.gender.charAt(0).toUpperCase() + formData.pet.gender.slice(1)}</p>
                </div>
                {formData.pet.image && (
                  <div className="pet-image-review">
                    <img src={formData.pet.image} alt="Pet" />
                  </div>
                )}
              </div>

              <div className="review-actions">
                <button type="button" onClick={prevStep} className="back-button" style={{width:'50%', marginRight:'10px'}}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  className="submit-button"
                  disabled={isSubmitting}
                  style={{width:'50%'}}
                >
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;