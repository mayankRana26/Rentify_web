import Listing from "../models/Listing.js";
import asyncHandler from "express-async-handler";
import { io } from "../index.js";

/**
 * @desc    Create a new listing
 * @route   POST /api/listings
 * @access  Private (Owner)
 */
export const createListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    mainCategory,
    subCategory,
    listingType,
    price,
    priceType,
    location,
  } = req.body;

  // 🔴 basic validation
  if (
    !title ||
    !description ||
    !mainCategory ||
    !subCategory ||
    !listingType ||
    !price ||
    !priceType ||
    !location
  ) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // 🔴 photos required
  if (!req.files || !req.files.photos || req.files.photos.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one photo");
  }

  const photos = req.files.photos.map((file) => file.path);
  const video = req.files.video ? req.files.video[0].path : null;

  const listing = await Listing.create({
    owner: req.user._id,
    title,
    description,
    mainCategory,
    subCategory,
    listingType,
    price,
    priceType,
    location,
    photos,
    video,
  });

  // 🔥 Populate owner before sending realtime
  const populatedListing = await Listing.findById(listing._id)
    .populate("owner", "name email");

  // 🔥 REAL-TIME BROADCAST
  io.emit("new-listing", populatedListing);

  res.status(201).json(populatedListing);
});

/**
 * @desc    Get all listings (with filters)
 * @route   GET /api/listings
 * @access  Public
 */
export const getAllListings = asyncHandler(async (req, res) => {
  const { category, query, type } = req.query;

  let filter = {};

  if (category) {
    filter.mainCategory = category;
  }

  if (type === "rent") filter.listingType = "Rent";
  if (type === "sell") filter.listingType = "Sale";

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { subCategory: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ];
  }

  const listings = await Listing.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json(listings);
});

/**
 * @desc    Get single listing
 * @route   GET /api/listings/:id
 * @access  Public
 */
export const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({
    _id: req.params.id,
    status: "active"
  }).populate("owner", "name email");

  if (!listing) {
    res.status(404);
    throw new Error("Listing not found");
  }

  res.json(listing);
});
