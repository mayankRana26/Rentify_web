import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  rentPercentage: {
    type: Number,
    default: 10
  },
  salePercentage: {
    type: Number,
    default: 5
  }
}, { timestamps: true });

export default mongoose.model("Commission", commissionSchema);
