import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import Transaction from "../models/Transaction.js";
import Commission from "../models/Commission.js";


import {
  initiateTransaction,
  getIncomingRequests,
  getSentRequests,
  acceptDeal,
  rejectDeal,
  payAdvance,
  getTransactionById,
  shipItem,
  payRemaining,
  completeOrder,
  verifyKYC
} from "../controllers/transactionController.js";

const router = express.Router();

/* ===============================
   BASIC TRANSACTION ROUTES
================================ */
router.post("/initiate", protect, initiateTransaction);
router.get("/sent", protect, getSentRequests);
router.get("/incoming", protect, getIncomingRequests);
router.get("/:id", protect, getTransactionById);

/* ===============================
   SELLER ACTIONS
================================ */
router.put("/:id/accept", protect, acceptDeal);
router.put("/:id/reject", protect, rejectDeal);
router.put("/:id/ship", protect, shipItem);

/* ===============================
   PAYMENT ROUTES
================================ */
router.post("/:id/pay", protect, payAdvance);
router.put("/:id/pay-remaining", protect, payRemaining);

/* ===============================
   COMPLETE ORDER (BUYER SIDE)
================================ */
router.put("/:id/complete-order", protect, completeOrder);

/* ===============================
   RENT DOCUMENT VERIFICATION
   (Seller verifies buyer docs)
================================ */
router.patch("/verify-buyer/:transactionId", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const txn = await Transaction.findById(req.params.transactionId);
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    // Sirf seller verify kare
    if (txn.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Sirf RENT ke liye
    if (txn.transactionType !== "Rent") {
      return res
        .status(400)
        .json({ message: "Verification only for Rent transactions" });
    }

    txn.verificationStatus = status;
    await txn.save();

    res.json({
      message: `Buyer verification ${status}`,
      transaction: txn,
    });
  } catch (err) {
    console.error("VERIFY BUYER ERROR:", err);
    res.status(500).json({ message: "Failed to update verification" });
  }
});

router.put("/verify/:id", protect, verifyKYC);

/* ===============================
   SELLER COMPLETE DEAL (RENT)
================================ */
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    txn.status = "completed";
    txn.paymentStatus = "paid";

    // SAFE COMMISSION
    let settings = await Commission.findOne();
    const rentPercentage = settings?.rentPercentage ?? 10;
    const salePercentage = settings?.salePercentage ?? 5;

    let commissionRate =
      txn.transactionType === "Rent"
        ? rentPercentage / 100
        : salePercentage / 100;

    txn.platformFee = txn.totalAmount * commissionRate;
    txn.sellerAmount = txn.totalAmount - txn.platformFee;

    await txn.save();

    res.json({ message: "Deal completed", transaction: txn });
  } catch (err) {
    res.status(500).json({ message: "Failed to complete deal" });
  }
});


export default router;
