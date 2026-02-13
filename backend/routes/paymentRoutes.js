import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);

export default router;
