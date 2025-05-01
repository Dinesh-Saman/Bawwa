import React, { useEffect, useState } from "react";
import { FiEdit, FiSave, FiTrash2, FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { FaPaw, FaDog, FaCat } from "react-icons/fa";
import "./userprofile.css";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/latest");
        const data = await res.json();
        if (res.ok) setUser(data);
        else console.error("User not found");
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch("http://localhost:5000/api/user/latest", {
        method: "DELETE",
      });
      const data = await res.json();
  
      if (res.ok) {
        alert("User deleted successfully!");
        setUser(null);
        navigate("/"); // Navigate to home page after successful deletion
      } else {
        alert("Failed to delete user: " + data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("pet.")) {
      const field = name.split(".")[1];
      setUser((prev) => ({ ...prev, pet: { ...prev.pet, [field]: value } }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (isLoading) return <div className="loading-spinner"></div>;
  if (!user) return <div className="no-profile">No profile found</div>;

  const { firstName, lastName, email, phone, pet } = user;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>
            <FiUser /> My Profile
          </h1>
          <p>Manage your account and pet information</p>
        </div>

        <div className="profile-content">
          <div className="pet-profile">
            <div className="pet-image-container">
              <img 
                src={pet.image || "https://source.unsplash.com/random/300x300/?pet"} 
                alt={pet.name} 
                className="pet-image"
              />
              <div className="pet-badge">
                {pet.type === 'dog' ? <FaDog /> : <FaCat />}
                <span>{pet.type}</span>
              </div>
            </div>

            <div className="pet-info">
              <h2>
                <FaPaw /> {pet.name}'s Details
              </h2>
              <div className="info-grid">
                {isEditing ? (
                  <>
                    <div className="info-item">
                      <label>Name</label>
                      <input name="pet.name" value={pet.name} onChange={handleChange} />
                    </div>
                    <div className="info-item">
                      <label>Age</label>
                      <input name="pet.age" value={pet.age} onChange={handleChange} />
                    </div>
                    <div className="info-item">
                      <label>Gender</label>
                      <select name="pet.gender" value={pet.gender} onChange={handleChange}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="info-item">
                      <label>Breed</label>
                      <input name="pet.breed" value={pet.breed} onChange={handleChange} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{pet.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age</span>
                      <span className="info-value">{pet.age} years</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender</span>
                      <span className="info-value">{pet.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Breed</span>
                      <span className="info-value">{pet.breed}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="owner-info">
            <h2>
              <FiUser /> Owner Information
            </h2>
            <div className="info-grid">
              {isEditing ? (
                <>
                  <div className="info-item">
                    <label>First Name</label>
                    <input name="firstName" value={firstName} onChange={handleChange} />
                  </div>
                  <div className="info-item">
                    <label>Last Name</label>
                    <input name="lastName" value={lastName} onChange={handleChange} />
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <input name="email" value={email} onChange={handleChange} />
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <input name="phone" value={phone} onChange={handleChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="info-item">
                    <span className="info-label">First Name</span>
                    <span className="info-value">{firstName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Name</span>
                    <span className="info-value">{lastName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/mybookings" className="btn appointments-btn">
            <FiCalendar /> Appointments
          </Link>
          <button className="btn edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <><FiSave /> Save</> : <><FiEdit /> Edit</>}
          </button>
          <button className="btn delete-btn-user" onClick={handleDelete}>
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;