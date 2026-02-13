import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // 🔥 HARD VALIDATION (VERY IMPORTANT)
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100, // paise
      currency: "INR",
      receipt: `rentify_${Date.now()}`,
    });

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: error.message });
  }
};
