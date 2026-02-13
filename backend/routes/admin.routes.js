import express from "express";
import adminProtect from "../middlewares/adminAuth.middleware.js";

// controllers
import { adminLogin } from "../controllers/admin.controller.js";
import { getAdminStats, getMonthlyRevenue } from "../controllers/adminStats.controller.js";
import {
  getAllUsers,
  toggleUserBlock,
  getAllSellers,
  toggleSellerBlock,
  getUserBookings,
  getSellerDetails,
  getPendingKYC, 
  updateKYCStatus
} from "../controllers/adminUsers.controller.js";
import {
  getAllListings,
  updateListingStatus,
  deleteListing
} from "../controllers/adminListings.controller.js";
import {
  getAllBookings,
  getTotalRevenue
} from "../controllers/adminBookings.controller.js";
import {
  getSellerEarnings,
  triggerManualPayout
} from "../controllers/adminEarnings.controller.js";




const router = express.Router();

// 🔐 ADMIN LOGIN
router.post("/login", adminLogin);

// 📊 DASHBOARD STATS
router.get("/stats", adminProtect, getAdminStats);
router.get("/revenue/monthly", adminProtect, getMonthlyRevenue);

// 👥 USERS & SELLERS
router.get("/users", adminProtect, getAllUsers);
router.put("/user/block/:id", adminProtect, toggleUserBlock);

router.get("/sellers", adminProtect, getAllSellers);
router.put("/seller/block/:id", adminProtect, toggleSellerBlock);

// 🏠 LISTINGS
router.get("/listings", adminProtect, getAllListings);
router.put("/listing/status/:id", adminProtect, updateListingStatus);
router.delete("/listing/:id", adminProtect, deleteListing);

// 📅 BOOKINGS & PAYMENTS
router.get("/bookings", adminProtect, getAllBookings);
router.get("/revenue", adminProtect, getTotalRevenue);

router.get(
  "/user/:id/bookings",
  adminProtect,
  getUserBookings
);
router.get(
  "/seller/:id/details",
  adminProtect,
  getSellerDetails
);

router.get(
  "/seller-earnings",
  adminProtect,
  getSellerEarnings
);

router.post(
  "/payout/:sellerId",
  adminProtect,
  triggerManualPayout
);

router.get("/kyc/pending", adminProtect, getPendingKYC);
router.put("/kyc/:id", adminProtect, updateKYCStatus);


export default router;
