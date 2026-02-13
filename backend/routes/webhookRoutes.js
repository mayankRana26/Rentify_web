import express from "express";
const router = express.Router();

router.post("/razorpay", express.json(), (req, res) => {
  console.log("Webhook Event:", req.body.event);

  if (req.body.event === "payment.captured") {
    console.log("Payment Captured ✅");
  }

  if (req.body.event === "transfer.processed") {
    console.log("Seller Payout Done 💸");
  }

  res.status(200).send("OK");
});

export default router;
