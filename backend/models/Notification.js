import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["request", "accepted", "rejected", "deleted"],
      required: true,
    },

    link: {
      type: String,
      default: "/",
    },

    // 🔥 THIS WAS MISSING
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
