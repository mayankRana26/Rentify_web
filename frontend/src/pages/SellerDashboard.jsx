import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import socket from "../socket";
import OrderStatus from "../components/OrderStatus";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    const { data } = await axios.get(`${API_URL}/api/listings`);
    setMyListings(data.filter((item) => item.owner?._id === user._id));
  };

  const fetchIncomingRequests = async () => {
    const { data } = await axios.get(`${API_URL}/api/transactions/incoming`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIncomingRequests(data);
  };

  const acceptRequest = async (id) => {
    await axios.put(
      `${API_URL}/api/transactions/${id}/accept`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    toast.success("Deal accepted");
  };

  const rejectRequest = async (id) => {
    await axios.put(
      `${API_URL}/api/transactions/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    toast.success("Request rejected");
  };

  const shipItem = async (id) => {
    await axios.put(
      `${API_URL}/api/transactions/${id}/ship`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    toast.success("Item shipped 🚚");
  };

  useEffect(() => {
    if (!token || !user) return;

    fetchListings();
    fetchIncomingRequests();
    setLoading(false);

    socket.connect();
    socket.emit("join", user._id);

    const handleUpdate = (updatedTxn) => {
      setIncomingRequests((prev) => {
        const exists = prev.find((t) => t._id === updatedTxn._id);
        if (exists) {
          return prev.map((t) => (t._id === updatedTxn._id ? updatedTxn : t));
        } else {
          return [updatedTxn, ...prev];
        }
      });
    };

    socket.on("order-update", handleUpdate);
    return () => socket.off("order-update", handleUpdate);
  }, [token, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Seller Dashboard
            </h2>
            <p className="text-gray-500 mt-1">
              Manage your listings and track incoming orders.
            </p>
          </div>
          <button
            onClick={() => navigate("/seller-form")}
            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            💳 Payment Account Settings
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        {/* MY LISTINGS GRID */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              My Listings{" "}
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
                {myListings.length}
              </span>
            </h3>
            <Link
              to="/create-listing"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
            >
              <span>+</span> Add New Listing
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 p-5 rounded-xl hover:shadow-lg transition-shadow"
              >
                <p className="font-bold text-gray-900 text-lg truncate">
                  {item.title}
                </p>
                <p className="text-indigo-600 font-semibold mt-1 text-xl">
                  ₹{item.price}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    ID: {item._id.slice(-6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INCOMING REQUESTS SECTION */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Incoming Requests{" "}
            <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
              {incomingRequests.length}
            </span>
          </h3>

          <div className="space-y-6">
            {incomingRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Item Image */}
                    <img
                      src={
                        req.listing?.photos?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt="item"
                      className="w-full md:w-32 h-32 object-cover rounded-xl border border-gray-100"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {req.listing?.title}
                          </h4>
                          <p className="text-2xl font-bold text-indigo-600 mt-1">
                            ₹{req.listing?.price}
                          </p>
                        </div>
                        {/* Status Badge */}
                        <div className="uppercase tracking-wider text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">
                          {req.status.replace("_", " ")}
                        </div>
                      </div>

                      {/* Buyer Card */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() =>
                            (window.location.href = `/buyer-profile/${req.buyer._id}`)
                          }
                        >
                          <img
                            src={
                              req.buyer?.profile?.avatar ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="buyer"
                            className="w-10 h-10 rounded-full border-2 border-indigo-50 group-hover:border-indigo-400 transition-colors"
                          />
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">
                              Buyer
                            </p>
                            <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                              {req.buyer?.name}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            Documentation Status
                          </p>
                          <span
                            className={`text-sm font-bold capitalize flex items-center gap-1.5 ${
                              req.verificationStatus === "verified"
                                ? "text-green-600"
                                : req.verificationStatus === "rejected"
                                  ? "text-red-600"
                                  : "text-amber-600"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                req.verificationStatus === "verified"
                                  ? "bg-green-600"
                                  : req.verificationStatus === "rejected"
                                    ? "bg-red-600"
                                    : "bg-amber-600 animate-pulse"
                              }`}
                            ></span>
                            {req.verificationStatus || "pending"}
                          </span>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        {(!req.verificationStatus || req.verificationStatus === "pending") && (
                          <>
                            <button
                              onClick={async () => {
                                await axios.put(
                                  `${API_URL}/api/transactions/verify/${req._id}`,
                                  {},
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                                toast.success("Buyer verified ✅");
                                fetchIncomingRequests();
                              }}
                              className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all text-sm"
                            >
                              Verify Docs
                            </button>
                          </>
                        )}

                        {req.status === "requested" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => acceptRequest(req._id)}
                              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-sm"
                            >
                              Accept Deal
                            </button>
                            <button
                              onClick={() => rejectRequest(req._id)}
                              className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {req.status === "payment_done" && (
                          <button
                            onClick={() => shipItem(req._id)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                          >
                            🚚 Ship Item Now
                          </button>
                        )}

                        {req.status === "shipped" &&
                          req.verificationStatus === "verified" && (
                            <button
                              onClick={async () => {
                                await axios.put(
                                  `${API_URL}/api/transactions/${req._id}/complete`,
                                  {},
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                                toast.success("Deal marked as completed ✅");
                              }}
                              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md"
                            >
                              Mark as Completed ✅
                            </button>
                          )}

                        {req.status === "shipped" &&
                          req.verificationStatus !== "verified" && (
                            <p className="text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-lg">
                              📦 Item Shipped (Pending Final Verification)
                            </p>
                          )}

                        {req.status === "completed" && (
                          <div className="w-full bg-green-50 text-green-700 border border-green-100 p-3 rounded-lg font-bold text-center">
                            🎉 Deal Successfully Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual Progress Bar Integration */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <OrderStatus status={req.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerDashboard;
