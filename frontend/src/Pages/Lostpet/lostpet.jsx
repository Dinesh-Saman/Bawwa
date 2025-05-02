import React, { useState } from "react";
import { FaPaw, FaPhone, FaMapMarkerAlt, FaDownload, FaPaperPlane } from "react-icons/fa";
import jsPDF from "jspdf";
import "./lostpet.css";
import dog from "../../assets/2.jpeg";
import cat from "../../assets/3.jpg";

const LostPet = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [lostPets, setLostPets] = useState([
    {
      id: 1,
      name: "Buddy",
      location: "Central Park, Malabe",
      contact: "(071) 456-7890",
      image: dog,
      description: "Golden retriever with red collar, very friendly",
    },
    {
      id: 2,
      name: "Luna",
      location: "Sunset Blvd, Kaduwela",
      contact: "(076) 654-3210",
      image: cat,
      description: "Black cat with white paws, shy but affectionate",
    },
  ]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Pet name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.contact.trim()) {
      errors.contact = "Contact information is required";
    } else {
      // Remove any non-digit characters for validation
      const digitsOnly = formData.contact.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        errors.contact = "Contact number must be exactly 10 digits";
      }
    }
    if (!formData.description.trim()) errors.description = "Description is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const newPet = {
        id: lostPets.length + 1,
        name: formData.name,
        location: formData.location,
        contact: formData.contact,
        description: formData.description,
        image: image || "",
      };

      setLostPets([newPet, ...lostPets]);
      alert("Lost pet reported successfully!");
      generatePoster();
      setFormData({ name: "", location: "", contact: "", description: "" });
      setImage(null);
      setErrors({});
    }
  };

  const generatePoster = () => {
    if (!image || !formData.name || !formData.location || !formData.contact || !formData.description) {
      alert("Please complete all fields and upload an image before generating the poster");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [400, 600],
    });

    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;

          // Background
          doc.setFillColor("#fffbe6");
          doc.rect(0, 0, 400, 600, "F");

          // Border
          doc.setDrawColor("#000");
          doc.setLineWidth(2);
          doc.rect(10, 10, 380, 580);

          // Title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(28);
          doc.setTextColor("#e63946");
          const title = "LOST PET";
          const titleWidth = doc.getTextWidth(title);
          doc.text(title, (400 - titleWidth) / 2, 40);

          // Pet Image
          doc.addImage(base64Image, "JPEG", 100, 60, 200, 160);

          // Info Section
          doc.setFillColor("#ffffff");
          doc.roundedRect(30, 240, 340, 250, 10, 10, "F");

          let y = 270;
          const lineGap = 30;

          // Info Text
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor("#1d3557");
          doc.text("Name:", 40, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor("#000");
          doc.text(formData.name, 120, y);

          y += lineGap;
          doc.setFont("helvetica", "bold");
          doc.setTextColor("#1d3557");
          doc.text("Last Seen:", 40, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor("#000");
          doc.text(formData.location, 120, y);

          y += lineGap;
          doc.setFont("helvetica", "bold");
          doc.setTextColor("#1d3557");
          doc.text("Contact:", 40, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor("#000");
          doc.text(formData.contact, 120, y);

          y += lineGap;
          doc.setFont("helvetica", "bold");
          doc.setTextColor("#1d3557");
          doc.text("Description:", 40, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor("#000");
          const descLines = doc.splitTextToSize(formData.description, 280);
          doc.text(descLines, 120, y);

          // Reward Box
          doc.setFillColor("#ff0000");
          doc.setTextColor("#fff");
          doc.roundedRect(120, 520, 160, 40, 8, 8, "F");
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("REWARD OFFERED", 145, 545);

          doc.save(`${formData.name}_LostPetPoster.pdf`);
        };
        reader.readAsDataURL(blob);
      });
  };

  return (
    <div className="lost-pet-page">
      <div className="lost-pet-container">
        <div className="report-section">
          <div className="section-header">
            <h1><FaPaw /> Report a Lost Pet</h1>
            <p>Help us reunite pets with their families</p>
          </div>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <div className="form-group">
                <label>Pet Image</label>
                <div className="image-upload">
                  {image ? (
                    <img src={image} alt="Preview" className="pet-image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <FaPaw className="upload-icon" />
                      <span>Click to upload pet photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-input-label"></label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Pet Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter pet's name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label><FaMapMarkerAlt /> Last Seen Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where was the pet last seen?"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-group">
            <label><FaPhone /> Contact Information*</label>
            <input
              type="tel" 
              name="contact"
              value={formData.contact}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                if (digitsOnly.length <= 10) {
                  handleChange({
                    target: {
                      name: 'contact',
                      value: e.target.value
                    }
                  });
                }
              }}
              placeholder="Your phone number (10 digits)"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.contact && <span className="error-message">{errors.contact}</span>}
          </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your pet (color, size, distinctive features, etc.)"
              ></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <FaPaperPlane /> Submit Report
              </button>
              <button type="button" onClick={generatePoster} className="download-btn" style={{backgroundColor:'#FF5733', borderRadius:'5px', height:'50px', marginTop:'20px'}}>
                <FaDownload /> Generate Poster
              </button>
            </div>
          </form>
        </div>

        <div className="lost-pets-section">
          <div className="section-header">
            <h2><FaPaw /> Recently Lost Pets</h2>
            <p>Help these pets find their way home</p>
          </div>

          {lostPets.length > 0 ? (
            <div className="lost-pets-grid">
              {lostPets.map((pet) => (
                <div key={pet.id} className="pet-card">
                  <img src={pet.image} alt={pet.name} className="pet-image" />
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-location"><FaMapMarkerAlt /> {pet.location}</p>
                    <p className="pet-contact"><FaPhone /> {pet.contact}</p>
                    <p className="pet-description">{pet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-pets">
              <p>No lost pets reported yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LostPet;