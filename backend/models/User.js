import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  pet: {
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    birthdate: { type: String },
    medicalConditions: { type: String },
    image: { type: String }
  }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
