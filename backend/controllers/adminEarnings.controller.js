import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/* =========================================
   📊 GET SELLER EARNINGS (ADMIN)
========================================= */
export const getSellerEarnings = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" });

    const result = [];

    for (let seller of sellers) {
      const transactions = await Transaction.find({
        seller: seller._id,
        status: "completed",
        paymentStatus: "paid",
      });

      // 🔥 Seller Net Earnings
      const totalEarnings = transactions.reduce(
        (acc, t) => acc + (t.sellerAmount || 0),
        0
      );

      // 🔥 Platform Revenue
      const totalPlatformRevenue = transactions.reduce(
        (acc, t) => acc + (t.platformFee || 0),
        0
      );

      // 🔥 Gross Volume (Total Sale Value)
      const grossVolume = transactions.reduce(
        (acc, t) => acc + (t.totalAmount || 0),
        0
      );

      // 🔥 Pending Payout
      const pendingTransactions = transactions.filter(
        (t) => t.payoutStatus !== "paid"
      );

      const pendingAmount = pendingTransactions.reduce(
        (acc, t) => acc + (t.sellerAmount || 0),
        0
      );

      result.push({
        sellerId: seller._id,
        name: seller.name,
        email: seller.email,

        // 💰 Financial Data
        totalEarnings,
        totalPlatformRevenue,
        grossVolume,
        pendingAmount,
        transactionsCount: transactions.length,

        // 🏦 Bank Details (from KYC)
        accountNumber: seller.kycDetails?.accountNumber || null,
        ifsc: seller.kycDetails?.ifsc || null,
        kycStatus: seller.kycStatus || "not_submitted",
      });
    }

    res.json(result);
  } catch (error) {
    console.error("ADMIN EARNINGS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   💸 MANUAL PAYOUT (ADMIN)
========================================= */
export const triggerManualPayout = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const transactions = await Transaction.find({
      seller: sellerId,
      status: "completed",
      paymentStatus: "paid",
      payoutStatus: { $ne: "paid" },
    });

    let payoutAmount = 0;

    for (let txn of transactions) {
      payoutAmount += txn.sellerAmount || 0;
      txn.payoutStatus = "paid";
      await txn.save();
    }

    res.json({
      message: "Payout marked as paid successfully",
      payoutAmount,
      totalTransactionsUpdated: transactions.length,
    });
  } catch (error) {
    console.error("PAYOUT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
