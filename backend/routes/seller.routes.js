import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { submitSellerKYC } from "../controllers/seller.controller.js";

const router = express.Router();

/* ===============================
   SELLER KYC SUBMIT
================================ */

router.post("/kyc", protect, (req,res,next)=>{
  console.log("KYC ROUTE HIT");
  next();
}, submitSellerKYC);


export default router;
