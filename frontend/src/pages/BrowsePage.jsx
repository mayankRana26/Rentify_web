import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BrowsePage = () => {
  const [items, setItems] = useState([]);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // ✅ Get query params
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  // ✅ Fetch listings with filters
  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (query) params.append("query", query);
      if (type) params.append("type", type);

      const { data } = await axios.get(
        `${API_URL}/api/listings?${params.toString()}`
      );

      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load listings");
    }
  };

  // ✅ Re-fetch when filters change
  useEffect(() => {
    fetchItems();
  }, [category, query, type]);

  // ✅ Socket realtime logic (unchanged)
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewListing = (listing) => {
      setItems((prev) => {
        const exists = prev.find((i) => i._id === listing._id);
        if (exists) return prev;

        // 🔥 Important: respect active filter
        if (category && listing.mainCategory !== category) return prev;

        if (
          query &&
          !(
            listing.title.toLowerCase().includes(query.toLowerCase()) ||
            listing.subCategory.toLowerCase().includes(query.toLowerCase()) ||
            listing.location.toLowerCase().includes(query.toLowerCase())
          )
        )
          return prev;

        if (type === "rent" && listing.listingType !== "Rent") return prev;
        if (type === "sell" && listing.listingType !== "Sale") return prev;

        return [listing, ...prev];
      });
    };

    socket.on("new-listing", handleNewListing);

    return () => {
      socket.off("new-listing", handleNewListing);
    };
  }, [category, query, type]);

  const handleQuickAction = async (listingId) => {
    if (!user) return navigate("/login");

    try {
      await axios.post(
        `${API_URL}/api/transactions/initiate`,
        { listingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Request sent successfully 🚀");
      navigate("/buyer-dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {items.length === 0 && (
        <p className="text-center text-gray-500 mb-6">
          No listings found 😔
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow">
            <img
              src={item.photos?.[0]}
              alt={item.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-indigo-600 font-bold">₹{item.price}</p>

              <button
                onClick={() => handleQuickAction(item._id)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
              >
                {item.listingType === "Rent" ? "Rent Now" : "Buy Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
