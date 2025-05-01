import express from "express";
import { bookAppointment, getAppointments, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/", getAppointments);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
