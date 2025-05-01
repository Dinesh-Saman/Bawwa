import React, { useState, useRef, useContext } from "react";
import { Dog, Cat, Upload, X, Venus, Mars } from "lucide-react";
import { FaUser, FaPaw, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import "./Register.css";
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  

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

  
  
  const petTypes = [
    { value: "dog", label: "Dog", icon: Dog },
    { value: "cat", label: "Cat", icon: Cat }
  ];

  const genderOptions = [
    { value: "male", label: "Male", icon: Mars },
    { value: "female", label: "Female", icon: Venus }
  ];

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
    if (!formData.pet.birthday.trim()) newErrors.petName = "Pet Birthday is required";
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

  // Inside your component
  const navigate = useNavigate();
  
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
        navigate('/login'); // Navigate to login page after successful registration
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
      user: { firstName: "", lastName
  

  return (
    <div className="register-container">
      {step === 1 && (
        <form>
          <h2>Owner Information</h2>
          <input type="text" name="firstName" value={formData.user.firstName} onChange={handleUserChange} placeholder="First Name" />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
          <input type="text" name="lastName" value={formData.user.lastName} onChange={handleUserChange} placeholder="Last Name" />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
          <input type="email" name="email" value={formData.user.email} onChange={handleUserChange} placeholder="Email" />
          {errors.email && <p className="error">{errors.email}</p>}
          <input type="tel" name="phone" value={formData.user.phone} onChange={handleUserChange} placeholder="Phone Number" />
          {errors.phone && <p className="error">{errors.phone}</p>}
          <button type="button" onClick={nextStep}>Next</button>
        </form>
      )}

      {step === 2 && (
        <form>
          <h2>Pet Information</h2>
          <input type="text" name="name" value={formData.pet.name} onChange={handlePetChange} placeholder="Pet Name" />
          {errors.petName && <p className="error">{errors.petName}</p>}
          <input type="text" name="breed" value={formData.pet.breed} onChange={handlePetChange} placeholder="Breed" />
          <input type="text" name="birthday" value={formData.pet.birthday} onChange={handlePetChange} placeholder="Birthday" />
          <input type="text" name="age" value={formData.pet.age} onChange={handlePetChange} placeholder="Age" />
          <h3>Select Gender</h3>
<div className="gender-container">
  {genderOptions.map(({ value, label, icon: Icon }) => (
    <button key={value} type="button" onClick={() => setFormData((prev) => ({ ...prev, pet: { ...prev.pet, gender: value } }))} className={`gender-button ${formData.pet.gender === value ? "active" : ""}`}>
      <Icon /> {label}
    </button>
  ))}
</div>
{errors.petGender && <p className="error">{errors.petGender}</p>}
          <h3>Select Pet Type</h3>
            <div className="pet-type-container">
              {petTypes.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setFormData((prev) => ({ ...prev, pet: { ...prev.pet, type: value } }))} className={`pet-type-button ${formData.pet.type === value ? "active" : ""}`}>
                  <Icon /> {label}
                </button>
              ))}
            </div>
          <h3>Upload Pet Image</h3>
            <label className="upload-label">
              <Upload /> Upload Image
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden />
            </label>
            {formData.pet.image && <img src={formData.pet.image} alt="Pet" />}
            {formData.pet.image && <button type="button" onClick={removeImage}><X /> Remove Image</button>}
          <button type="button" onClick={prevStep}>Back</button>
          <button type="button" onClick={nextStep}>Next</button>
        </form>
      )}

      {step === 3 && (
        <div className="review-container">
        <h2>Review Your Information</h2>
        <p><strong>User:</strong>Nmae - {formData.user.firstName} {formData.user.lastName} <br></br>Email- {formData.user.email} <br></br>Tele no -  {formData.user.phone}</p>
        <p><strong>Pet:</strong> Name - {formData.pet.name} <br></br> Birthday -{formData.pet.birthdate}<br></br>Breed - {formData.pet.breed}<br></br> Age - {formData.pet.age} </p>
        {formData.pet.image && <img src={formData.pet.image} alt="Pet" />}
        <button type="button" onClick={handleSubmit}>
  Complete Registration
</button>

        <button type="button" onClick={prevStep}>Back</button>
      </div>
    )}

    </div>
  );
};

export default Register;