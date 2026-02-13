import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchTxn = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTxn(data);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchTxn();
  }, [id, token]);

  const loadRazorpay = async (amount, mode = "full") => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/payments/create-order`,
        {
          amount,
           // 🔥 IMPORTANT
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        name: "Rentify",
        description: "Payment",
        order_id: data.order.id,

        handler: async () => {
          toast.success("Payment Successful 💰");

          if (mode === "full") {
            await axios.post(
              `${API_URL}/api/transactions/${id}/pay`,
              { mode: "full" },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } else {
            await axios.put(
              `${API_URL}/api/transactions/${id}/pay-remaining`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }

          navigate("/buyer-dashboard");
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!txn) return <div className="p-10 text-center">Transaction not found</div>;

  if (txn.paymentStatus === "paid") {
    return (
      <div className="p-10 text-center">
        <p className="text-green-600 font-semibold">
          Payment already completed ✅
        </p>
        <button
          onClick={() => navigate("/buyer-dashboard")}
          className="mt-4 px-6 py-2 bg-black text-white rounded"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

        <p className="mb-2">
          <strong>Item:</strong> {txn.listing?.title}
        </p>

        <p className="mb-4">
          <strong>Total Amount:</strong> ₹{txn.totalAmount}
        </p>

        <div className="space-y-3">

          {/* COD + SHIPPED */}
          {txn.status === "shipped" && txn.paymentMode === "cod" && (
            <button
              onClick={() => loadRazorpay(Number(txn.totalAmount) + 10, "cod")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Pay Now (₹10 Extra)
            </button>
          )}

          {/* NORMAL PAYMENT */}
          {txn.status !== "shipped" && (
            <>
              <button
                onClick={() => loadRazorpay(Number(txn.totalAmount), "full")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                Pay Now (Full Payment)
              </button>

              <button
                onClick={async () => {
                  await axios.post(
                    `${API_URL}/api/transactions/${id}/pay`,
                    { mode: "cod" },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success("Cash on Delivery selected");
                  navigate("/buyer-dashboard");
                }}
                className="w-full bg-gray-800 text-white py-3 rounded-lg"
              >
                Cash On Delivery
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
