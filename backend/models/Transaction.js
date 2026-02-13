import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transactionType: { type: String, enum: ["Rent", "Sale"], required: true },

    status: {
      type: String,
      enum: [
        "requested",
        "payment_pending",
        "payment_done",
        "paid_after_cod",
        "shipped",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },

    totalAmount: Number,
    advanceAmount: Number,
    remainingAmount: Number,
    codExtraCharge: { type: Number, default: 10 },

    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    payoutStatus: {
  type: String,
  enum: ["pending", "paid"],
  default: "pending"
},
    paymentMode: {
      type: String,
      enum: ["online", "cod"],
    },
   verificationStatus: {
  type: String,
  enum: ["pending", "verified", "rejected"],
  default: null,
},
platformFee: {
  type: Number,
  default: 0
},
sellerAmount: {
  type: Number,
  default: 0
},

  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
