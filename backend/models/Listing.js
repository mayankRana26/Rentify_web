import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainCategory: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    listingType: {
      type: String,
      enum: ["Rent", "Sale"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceType: {
      type: String,
      enum: ["per month", "per day", "one-time"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
    video: {
      type: String,
      default: null,
    },
    status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active"
}
  },
  { timestamps: true }
);

// 🔥 TEXT SEARCH INDEX (IMPORTANT)
listingSchema.index({
  title: "text",
  location: "text",
  subCategory: "text",
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
