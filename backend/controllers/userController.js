import userModel from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Register User
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, pet } = req.body;
    const { name, type, breed, age, gender, birthdate, medicalConditions, image } = pet; // Assuming 'pet' is an object

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Hash password before saving (assuming password is required)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      pet: {
        name,
        type,
        breed,
        age,
        gender,
        birthdate,
        medicalConditions,
        image,
      },
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLatestUser = async (req, res) => {
  try {
    const latestUser = await userModel.findOne().sort({ _id: -1 });
    if (!latestUser) return res.status(404).json({ message: "No user found" });
    res.status(200).json(latestUser);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

// DELETE user
const deleteLatestUser = async (req, res) => {
  try {
    const latestUser = await userModel.findOne().sort({ _id: -1 });
    if (!latestUser) {
      return res.status(404).json({ message: "No user found" });
    }

    await userModel.findByIdAndDelete(latestUser._id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await userModel.find();
    console.log("Users found:", users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user by ID (backend)
const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, getLatestUser, deleteLatestUser, getAllUsers, deleteUser, updateUser };
