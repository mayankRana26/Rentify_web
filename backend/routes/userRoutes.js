import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  getUserById
} from "../controllers/userController.js";

import upload from "../config/cloudinary.js";
const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put(
  "/me",
  protect,
  upload.single("avatar"),
  updateMyProfile
);

router.get("/:id", protect, getUserById);



export default router;
