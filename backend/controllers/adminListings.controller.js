import Listing from "../models/Listing.js";

export const getAllListings = async (req, res) => {
  const listings = await Listing.find({ status: "active" })
  res.json(listings);
};

export const updateListingStatus = async (req, res) => {
  const { status } = req.body;

  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  listing.status = status;
  await listing.save();

  res.json({ message: "Listing status updated" });
};

export const deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Listing deleted" });
};
