import User from "../models/User.js";
import Listing from "../models/Listing.js";
// import Booking from "../models/booking.model.js";
import Transaction from "../models/Transaction.js";


// DASHBOARD CARDS
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "buyer" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const activeListings = await Listing.countDocuments({ status: "active" });
const totalBookings = await Transaction.countDocuments();


    const revenue = await Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      totalUsers,
      totalSellers,
      activeListings,
      totalBookings,
      totalRevenue: revenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// MONTHLY REVENUE GRAPH
export const getMonthlyRevenue = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: { $ifNull: ["$totalAmount", 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log("Monthly Revenue Data:", data);

    res.json(data);
  } catch (err) {
    console.error("Revenue Error:", err);
    res.status(500).json({ message: err.message });
  }
};


