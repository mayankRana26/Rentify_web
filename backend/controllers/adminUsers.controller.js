import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Listing from "../models/Listing.js";




// USERS
export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "buyer" }).select("-password");
  res.json(users);
};

export const toggleUserBlock = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}` });
};

// SELLERS
export const getAllSellers = async (req, res) => {
  const sellers = await User.find({ role: "seller" }).select("-password");
  res.json(sellers);
};

export const toggleSellerBlock = async (req, res) => {
  const seller = await User.findById(req.params.id);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  seller.isBlocked = !seller.isBlocked;
  await seller.save();

  // 🔥 AUTO DISABLE / ENABLE LISTINGS
  await Listing.updateMany(
    { owner: seller._id },
    { status: seller.isBlocked ? "inactive" : "active" }
  );

  res.json({
    message: `Seller ${seller.isBlocked ? "blocked" : "unblocked"}`,
  });
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Transaction.find({
      buyer: req.params.id
    })
      .populate("listing", "title price")
      .populate("seller", "email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerDetails = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const seller = await User.findById(sellerId).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const listings = await Listing.find({ owner: sellerId });

    const transactions = await Transaction.find({ seller: sellerId });

    const revenue = await Transaction.aggregate([
      { $match: { seller: seller._id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      seller,
      totalListings: listings.length,
      totalTransactions: transactions.length,
      completedRevenue: revenue[0]?.total || 0,
      listings,
      transactions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL PENDING KYC
================================ */
export const getPendingKYC = async (req, res) => {
  try {
    const sellers = await User.find({
      kycStatus: "pending"
    });

    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   APPROVE / REJECT KYC
================================ */
export const updateKYCStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.kycStatus = status;

    if (status === "approved") {
      user.role = "seller"; // upgrade role
    }

    await user.save();

    res.json({ message: `KYC ${status}`, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
