import React, { useEffect, useState } from "react";
import axios from "axios";
import "./useradmin.css";

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pet: {
      name: "",
      type: "",
      breed: "",
      age: "",
      gender: "",
      birthdate: "",
      medicalConditions: "",
      image: ""
    }
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: ""
  });

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/all");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setErrors({
      email: validateEmail(user.email) ? "" : "Invalid email format",
      phone: validatePhone(user.phone) ? "" : "Phone must be 10 digits"
    });
  };

  // Handle form changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers and limit to 10 digits
    let processedValue = value;
    if (name === "phone") {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [name]: processedValue });

    // Validate fields
    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(processedValue) ? "" : "Invalid email format"
      });
    } else if (name === "phone") {
      setErrors({
        ...errors,
        phone: validatePhone(processedValue) ? "" : "Phone must be 10 digits"
      });
    }
  };

  // Update user with validation check
  const handleUpdate = async () => {
    // Check if there are any validation errors
    if (errors.email || errors.phone) {
      alert("Please fix the validation errors before saving.");
      return;
    }

    // Additional check in case the user bypasses the input restrictions
    if (!validatePhone(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/user/${editingUser._id}`, formData);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">User Admin</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Pet Name</th>
            <th>Pet Age</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.pet?.name || "-"}</td>
              <td>{user.pet?.age || "-"}</td>
              <td>
                <button className="update-btn" onClick={() => handleEdit(user)}>Update</button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={errors.phone ? "error-input" : ""}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            {/* Add more pet fields if needed */}
            <div className="modal-actions">
              <button 
                onClick={handleUpdate}
                disabled={errors.email || errors.phone}
              >
                Save
              </button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;