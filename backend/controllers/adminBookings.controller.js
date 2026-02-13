// import Booking from "../models/booking.model.js";
import Transaction from "../models/Transaction.js";


export const getAllBookings = async (req, res) => {
  const bookings = await Transaction.find()
    .populate("buyer", "name email")
    .populate("seller", "name email")
    .populate("listing", "title price");

  res.json(bookings);
};


export const getTotalRevenue = async (req, res) => {
  const revenue = await Transaction.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  res.json({ totalRevenue: revenue[0]?.total || 0 });
};
