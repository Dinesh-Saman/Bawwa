import Appointment from "../models/Appointment.js";

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { name, email, contact, service, date, time } = req.body;
    const newAppointment = new Appointment({ name, email, contact, service, date, time });
    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully!", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Appointment updated successfully!", appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
