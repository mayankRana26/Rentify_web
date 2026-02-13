import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(notifications);
});

router.get("/unread-count", protect, async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.json({ count });
});

router.put("/mark-read", protect, async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ message: "Marked read" });
});

export default router;
