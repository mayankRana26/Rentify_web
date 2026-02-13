import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pan: String,
  bank: {
    account: String,
    ifsc: String,
  },
  razorpayAccountId: String,
  kycStatus: { type: String, default: "pending" },
});

export default mongoose.model("Seller", sellerSchema);
