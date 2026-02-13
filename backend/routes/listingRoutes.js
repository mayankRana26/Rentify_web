// import express from 'express';
// import { createListing, getAllListings, getListingById, searchListings } from '../controllers/listingController.js';
// import { protect, isOwner } from '../middlewares/authMiddleware.js';
// import upload from '../config/cloudinary.js';

// const router = express.Router();

// router.route('/')
//     .get(getAllListings)
//     .post(
//         protect, 
//         isOwner, 
//         upload.fields([
//             { name: 'photos', maxCount: 5 },
//             { name: 'video', maxCount: 1 }
//         ]), 
//         createListing
//     );

// router.route('/:id')
//     .get(getListingById);
    
// router.get("/search", searchListings);
// router.get("/", getAllListings);

// export default router;

import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
} from "../controllers/listingController.js";
import { protect, isSeller } from "../middlewares/authMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

// 🔹 GET all listings (with query filters)
// 🔹 POST create listing
router
  .route("/")
  .get(getAllListings)
  .post(
    protect,
    isSeller,
    upload.fields([
      { name: "photos", maxCount: 5 },
      { name: "video", maxCount: 1 },
    ]),
    createListing
  );

// 🔹 GET single listing by id
router.route("/:id").get(getListingById);

export default router;
