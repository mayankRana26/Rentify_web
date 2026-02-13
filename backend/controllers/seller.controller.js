import User from "../models/User.js";

/* ===============================
   SUBMIT SELLER KYC
================================ */
export const submitSellerKYC = async (req, res) => {
  try {
    const userId = req.user._id;

    const { pan, account, ifsc, bankName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.kycDetails = {
      pan,
      accountNumber: account,
      ifsc,
      bankName
    };

    user.kycStatus = "pending";

    await user.save();

    res.json({
      message: "KYC submitted successfully. Await admin approval.",
      user
    });

  } catch (error) {
    console.error("SELLER KYC ERROR:", error);
    res.status(500).json({ message: "Failed to submit KYC" });
  }
};
