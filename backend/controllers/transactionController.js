import Transaction from "../models/Transaction.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Commission from "../models/Commission.js";
import sendNotification from "../utils/sendNotification.js";
import { io } from "../index.js";


  //  BUYER → Initiate Transaction

export const initiateTransaction = async (req, res) => {
  try {
    const { listingId } = req.body;
    const buyerId = req.user._id;

 const listing = await Listing.findById(listingId);
if (!listing) {
  return res.status(404).json({ message: "Listing not found" });
}

const seller = await User.findById(listing.owner);

if (seller.isBlocked) {
  return res.status(403).json({
    message: "Seller is blocked. You cannot purchase this item."
  });
}

if (listing.status !== "active") {
  return res.status(400).json({
    message: "This listing is not available."
  });
}



    const exists = await Transaction.findOne({
      listing: listingId,
      buyer: buyerId,
    });

    if (exists) {
      return res.status(400).json({ message: "Already requested" });
    }

   const txn = await Transaction.create({
  listing: listingId,
  buyer: buyerId,
  seller: listing.owner,
  status: "requested",
  transactionType: listing.listingType,
  totalAmount: listing.price,

  // 👇 SIRF RENT KE LIYE
  verificationStatus:
    listing.listingType === "Rent" ? "pending" : null,
});

    await sendNotification({
      userId: listing.owner,
      title: "New Request 📩",
      message: `New request for "${listing.title}"`,
      type: "request",
      link: "/seller-dashboard",
      transactionId: txn._id,
    });

    io.to(listing.owner.toString()).emit("order-update", txn);

    res.status(201).json(txn);
  } catch (err) {
    console.error("INITIATE ERROR:", err);
    res.status(500).json({ message: "Failed to create request" });
  }
};

/* =====================================================
   SELLER → Get Incoming Requests
===================================================== */
export const getIncomingRequests = async (req, res) => {
  const data = await Transaction.find({ seller: req.user._id })
    .populate("buyer", "name email")
    .populate("listing", "title price photos");

  res.json(data);
};

/* =====================================================
   BUYER → Get Sent Requests
===================================================== */
export const getSentRequests = async (req, res) => {
  const data = await Transaction.find({ buyer: req.user._id })
    .populate("seller", "name email")
    .populate("listing", "title price photos");

  res.json(data);
};

/* =====================================================
   GET TRANSACTION BY ID
===================================================== */
export const getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
      .populate("listing", "title price photos")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    const userId = req.user._id.toString();

    if (
      txn.buyer._id.toString() !== userId &&
      txn.seller._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(txn);
  } catch (err) {
    console.error("GET TXN ERROR:", err);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
};

/* =====================================================
   SELLER → Accept Deal
===================================================== */
export const acceptDeal = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
      .populate("listing", "title price");

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    txn.status = "payment_pending";
    txn.advanceAmount = txn.totalAmount / 2;
    txn.paymentStatus = "pending";
    await txn.save();

    io.to(txn.buyer.toString()).emit("order-update", txn);
    io.to(txn.seller.toString()).emit("order-update", txn);

    res.json({ message: "Deal accepted", transaction: txn });
  } catch (err) {
    console.error("ACCEPT ERROR:", err);
    res.status(500).json({ message: "Failed to accept deal" });
  }
};

/* =====================================================
   SELLER → Reject Deal
===================================================== */
export const rejectDeal = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    txn.status = "cancelled";
    await txn.save();

    io.to(txn.buyer.toString()).emit("order-update", txn);
    io.to(txn.seller.toString()).emit("order-update", txn);

    res.json({ message: "Deal rejected", transaction: txn });
  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ message: "Failed to reject deal" });
  }
};

/* =====================================================
   BUYER → Pay Advance / COD / Full
===================================================== */
export const payAdvance = async (req, res) => {
  try {
    const { mode } = req.body;

    const txn = await Transaction.findById(req.params.id);

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (mode === "cod") {
      txn.paymentMode = "cod";
      txn.paymentStatus = "pending";
      txn.status = "payment_done";
    }

    if (mode === "full") {
      txn.paymentMode = "online";
      txn.paymentStatus = "paid";
      txn.status = "payment_done";
    }

    await txn.save();

    io.to(txn.buyer.toString()).emit("order-update", txn);
    io.to(txn.seller.toString()).emit("order-update", txn);

    res.json({ message: "Payment updated", transaction: txn });
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ message: "Payment failed" });
  }
};

/* =====================================================
   COD → Final Payment (Auto Complete)
===================================================== */


export const payRemaining = async (req, res) => {
  const txn = await Transaction.findById(req.params.id);

  if (!txn) return res.status(404).json({ message: "Not found" });

  txn.paymentStatus = "paid";
  txn.status = "completed";

  // ✅ COMMISSION CALCULATION START
// 🔥 SAFE COMMISSION LOGIC
let settings = await Commission.findOne();

const rentPercentage = settings?.rentPercentage ?? 10;
const salePercentage = settings?.salePercentage ?? 5;

let commissionRate =
  txn.transactionType === "Rent"
    ? rentPercentage / 100
    : salePercentage / 100;

const platformFee = txn.totalAmount * commissionRate;
const sellerAmount = txn.totalAmount - platformFee;

txn.platformFee = platformFee;
txn.sellerAmount = sellerAmount;



console.log("Commission Applied:", {
  rate: commissionRate,
  platformFee,
  sellerAmount
});


  // ✅ COMMISSION CALCULATION END

  await txn.save();

  res.json({ message: "COD payment done & order completed", transaction: txn });
};


/* =====================================================
   SELLER → Ship Item
===================================================== */
export const shipItem = async (req, res) => {
  const txn = await Transaction.findById(req.params.id);

  if (!txn) return res.status(404).json({ message: "Not found" });

  txn.status = "shipped";
  await txn.save();

  io.to(txn.buyer.toString()).emit("order-update", txn);
  io.to(txn.seller.toString()).emit("order-update", txn);

  res.json({ message: "Item shipped", transaction: txn });
};
export const completeOrder = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (txn.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    

    txn.status = "completed";
    txn.paymentStatus = "paid";

    // 🔥 SAFE COMMISSION LOGIC
    let settings = await Commission.findOne();

const rentPercentage = settings?.rentPercentage ?? 10;
const salePercentage = settings?.salePercentage ?? 5;

let commissionRate =
  txn.transactionType === "Rent"
    ? rentPercentage / 100
    : salePercentage / 100;

const platformFee = txn.totalAmount * commissionRate;
const sellerAmount = txn.totalAmount - platformFee;

txn.platformFee = platformFee;
txn.sellerAmount = sellerAmount;


    console.log("Commission Applied:", {
      rate: commissionRate,
      platformFee,
      sellerAmount
    });

    await txn.save();

    io.to(txn.buyer.toString()).emit("order-update", txn);
    io.to(txn.seller.toString()).emit("order-update", txn);

    res.json({ message: "Order completed successfully", transaction: txn });

  } catch (err) {
    console.error("COMPLETE ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to complete order" });
  }
};

/* =====================================================
   SELLER → Mark KYC as Verified
===================================================== */
export const verifyKYC = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Sirf seller hi verify kar sakta hai
    if (txn.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    txn.verificationStatus = "verified";
    await txn.save();

    io.to(txn.buyer.toString()).emit("order-update", txn);
    io.to(txn.seller.toString()).emit("order-update", txn);

    res.json({
      message: "KYC marked as verified",
      transaction: txn
    });

  } catch (error) {
    console.error("VERIFY KYC ERROR:", error);
    res.status(500).json({ message: "Failed to verify KYC" });
  }
};
