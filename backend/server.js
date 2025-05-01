import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRouter from './routes/userRoute.js';
import nutritionRoutes from './routes/nutritionRoutes.js'; 
import paymentRoutes from "./routes/Payment.js";
import accessoryRoutes from "./routes/Accessory.js";
import salesRoutes from "./routes/Sales.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("API Working");
});

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use('/api/user', userRouter);
app.use('/api/nutrition', nutritionRoutes);
app.use("/api", paymentRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/api/order', salesRoutes);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});