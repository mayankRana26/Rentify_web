import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ListingPage = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/listings/${id}`);
        setListing(data);
      } catch (err) {
        setError("Could not fetch listing details");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleTransaction = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/transactions/initiate`,
        { listingId: listing._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Request sent successfully");
      navigate("/buyer-dashboard");
    } catch {
      toast.error("You already requested this listing");
    }
  };

  if (loading)
    return <div className="text-center mt-24 text-xl">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-24 text-xl text-red-500">{error}</div>
    );

  if (!listing)
    return <div className="text-center mt-24">Listing not found</div>;

  const isOwner =
    user &&
    listing?.owner &&
    user._id === listing.owner._id;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {/* IMAGE SECTION */}
        <div className="flex justify-center bg-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-5xl p-4">
            {listing.photos?.slice(0, 5).map((photo, index) => (
              <div
                key={index}
                className={`flex items-center justify-center bg-white rounded-lg overflow-hidden ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={photo}
                  alt={listing.title}
                  className="max-h-[300px] w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT */}
            <div className="lg:w-2/3">
              <span
                className={`inline-block mb-3 px-3 py-1 text-sm font-semibold rounded-full text-white ${
                  listing.listingType === "Rent"
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}
              >
                FOR {listing.listingType.toUpperCase()}
              </span>

              <h1 className="text-3xl font-bold text-gray-800">
                {listing.title}
              </h1>

              <p className="text-gray-500 mt-2">📍 {listing.location}</p>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="lg:w-1/3">
              <div className="border rounded-xl p-6 bg-gray-50 sticky top-28">
                <p className="text-3xl font-bold text-indigo-600">
                  ₹{listing.price?.toLocaleString()}
                  {listing.listingType === "Rent" && (
                    <span className="text-base font-normal text-gray-600">
                      {" "}
                      /{listing.priceType}
                    </span>
                  )}
                </p>

                <div className="mt-5 border-t pt-4">
                  <p className="font-semibold text-gray-800">Owner</p>
                  <p className="text-gray-600">
                    {listing.owner?.name || "Unknown"}
                  </p>
                </div>

                {!isOwner && (
                  <button
                    onClick={handleTransaction}
                    className={`w-full mt-6 py-3 text-white rounded-lg font-semibold transition ${
                      listing.listingType === "Rent"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {listing.listingType === "Rent"
                      ? "Rent Now"
                      : "Buy Now"}
                  </button>
                )}

                {isOwner && (
                  <div className="mt-6 text-center bg-blue-100 text-blue-800 p-3 rounded-lg">
                    This is your listing
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
