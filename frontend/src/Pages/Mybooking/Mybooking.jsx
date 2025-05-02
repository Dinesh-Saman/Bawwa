import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { FiEdit, FiTrash2, FiDownload, FiCalendar, FiClock, FiUser, FiMail, FiPhone } from "react-icons/fi";
import "./Mybooking.css";

const Mybooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get user email and admin status from localStorage when component mounts
    const email = localStorage.getItem('userEmail');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (email) {
      setUserEmail(email);
    }
    setIsAdmin(adminStatus);
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(response.data);
      
      // Filter appointments based on admin status
      if (isAdmin) {
        // Show all appointments for admin
        setFilteredAppointments(response.data);
      } else if (userEmail) {
        // Show only user's appointments for regular users
        const filtered = response.data.filter(app => app.email === userEmail);
        setFilteredAppointments(filtered);
      } else {
        setFilteredAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userEmail, isAdmin]); // Refetch when userEmail or isAdmin changes

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditing(appointment._id);
    setEditData(appointment);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${editing}`, editData);
      setEditing(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const generatePDF = (appointment) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(255, 122, 0);
    doc.text("Bawwa.lk", 105, 20, null, null, 'center');
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Appointment Confirmation", 105, 35, null, null, 'center');
    
    doc.setFontSize(12);
    doc.text(`Customer Name: ${appointment.name}`, 20, 55);
    doc.text(`Email: ${appointment.email}`, 20, 65);
    doc.text(`Contact: ${appointment.contact}`, 20, 75);
    doc.text(`Service: ${appointment.service}`, 20, 85);
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`, 20, 95);
    doc.text(`Time: ${appointment.time}`, 20, 105);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing Bawwa.lk for your pet care needs!", 105, 140, null, null, 'center');
    doc.text("Contact us at: support@bawwa.lk", 105, 150, null, null, 'center');
    
    doc.save(`${appointment.name}_appointment.pdf`);
  };

  return (
    <div className="mybooking-page">
      <div className="mybooking-container">
        <div className="header-section">
          <h2>{isAdmin ? "All Appointments" : "My Appointments"}</h2>
          <p>{isAdmin ? "Manage all pet care appointments" : "Manage your upcoming pet care appointments"}</p>
        </div>

        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <img src="/images/no-appointments.png" alt="No appointments" />
            <h3>
              {isAdmin ? "No appointments found in system" : 
               userEmail ? "No appointments found" : "Please login to view your appointments"}
            </h3>
            <p>
              {isAdmin ? "There are currently no appointments in the system." : 
               userEmail ? "You haven't booked any appointments yet." : "Your appointments will appear here after login."}
            </p>
          </div>
        ) : (
          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th><FiUser /> Name</th>
                  <th><FiMail /> Email</th>
                  <th><FiPhone /> Contact</th>
                  <th>Service</th>
                  <th><FiCalendar /> Date</th>
                  <th><FiClock /> Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    {editing === appointment._id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            name="name" 
                            value={editData.name} 
                            onChange={handleChange} 
                            placeholder="Full Name"
                          />
                        </td>
                        <td>
                          <input 
                            type="email" 
                            name="email" 
                            value={editData.email} 
                            onChange={handleChange} 
                            placeholder="Email"
                          />
                        </td>
                        <td>
                          <input 
                            type="tel" 
                            name="contact" 
                            value={editData.contact} 
                            onChange={handleChange} 
                            placeholder="Contact"
                          />
                        </td>
                        <td>
                          <select 
                            name="service" 
                            value={editData.service} 
                            onChange={handleChange}
                          >
                            <option value="Grooming">Grooming</option>
                            <option value="Boarding">Boarding</option>
                            <option value="Veterinary">Veterinary</option>
                            <option value="Vaccination">Vaccination</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="date" 
                            name="date" 
                            value={editData.date} 
                            onChange={handleChange} 
                          />
                        </td>
                        <td>
                          <input 
                            type="time" 
                            name="time" 
                            value={editData.time} 
                            onChange={handleChange} 
                          />
                        </td>
                        <td className="actions-cell">
                          <button className="save-btn-appointment" onClick={handleUpdate}>
                            Save
                          </button>
                          <button className="cancel-btn-appointment" onClick={() => setEditing(null)}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{appointment.name}</td>
                        <td>{appointment.email}</td>
                        <td>{appointment.contact}</td>
                        <td>
                          <span className={`service-tag ${appointment.service.toLowerCase()}`}>
                            {appointment.service}
                          </span>
                        </td>
                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                        <td>{appointment.time}</td>
                        <td className="actions-cell">
                          <button 
                            onClick={() => handleEdit(appointment)}
                            title="Edit appointment"
                            style={{marginRight:'10px'}}
                          >
                            <FiEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(appointment._id)}
                            title="Delete appointment"
                            style={{marginRight:'10px', backgroundColor:'red'}}
                          >
                            <FiTrash2 />
                          </button>
                          <button 
                            onClick={() => generatePDF(appointment)}
                            title="Download PDF"
                            style={{backgroundColor:'blue'}}
                          >
                            <FiDownload />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mybooking;