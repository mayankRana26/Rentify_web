import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import OrderStatus from "../components/OrderStatus";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BuyerDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/transactions/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(data.reverse());
    } catch (error) {   
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/transactions/${id}/complete-order`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Delivery confirmed ✅");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    if (!token || !user) return;

    fetchRequests();

    socket.connect();
    socket.emit("join", user._id);

    socket.on("order-update", (updatedTxn) => {
      setRequests((prev) =>
        prev.map((t) => (t._id === updatedTxn._id ? updatedTxn : t))
      );
    });

    return () => {
      socket.off("order-update");
      socket.disconnect();
    };
  }, [token, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Purchases
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Track your requests and manage your payments.
          </p>
        </header>

        {requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-400 text-xl font-medium">No requests yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-indigo-600 font-semibold hover:underline"
            >
              Start browsing listings
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((txn) => (
              <div
                key={txn._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                          Order #{txn._id.slice(-6)}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                          txn.verificationStatus === "verified" ? "text-green-600 bg-green-50" : 
                          txn.verificationStatus === "rejected" ? "text-red-600 bg-red-50" : "text-amber-600 bg-amber-50"
                        }`}>
                          Docs: {txn.verificationStatus || "Pending"}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {txn.listing?.title}
                      </h2>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">
                        ₹{txn.listing?.price?.toLocaleString()}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {txn.status === "payment_pending" && (
                        <button
                          onClick={() => navigate(`/payment/${txn._id}`)}
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
                        >
                          💳 Continue to Pay
                        </button>
                      )}

                      {txn.status === "shipped" && txn.paymentMode === "cod" && (
                        <button
                          onClick={() => navigate(`/payment/${txn._id}`)}
                          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
                        >
                          Pay Now (₹10 Extra)
                        </button>
                      )}

                      {txn.status === "shipped" && txn.paymentMode !== "cod" && (
                        <button
                          onClick={() => confirmDelivery(txn._id)}
                          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-100 transition-all"
                        >
                          Confirm Delivery 📦
                        </button>
                      )}

                      {txn.status === "completed" && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                          <span className="text-lg font-bold italic">Completed</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking Section */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-tight">Delivery Status</span>
                      <span className="text-sm text-gray-400">Update in real-time</span>
                    </div>
                    <OrderStatus status={txn.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;