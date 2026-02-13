// backend/controllers/userController.js
import User from "../models/User.js";

/* =========================
   GET MY PROFILE
========================= */
export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

/* =========================
   GET USER BY ID (FOR SELLER)
========================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* =========================
   UPDATE MY PROFILE
========================= */
export const updateMyProfile = async (req, res) => {
  const { name, phone, avatar, address } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (phone) user.profile.phone = phone;

  // 🔥 FIXED
  if (avatar) {
    user.profile.avatar = avatar;
  }

  if (address) {
    user.profile.address = {
      ...user.profile.address,
      ...address,
    };
  }

  await user.save();

  res.json({
    message: "Profile updated successfully",
    user: await User.findById(req.user._id).select("-password"),
  });
};


