import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BuyerProfile = () => {
  const { id } = useParams(); // buyer id
  const { token } = useAuth();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBuyer(data);
      } catch (err) {
        toast.error("Failed to load buyer profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBuyer();
  }, [id, token]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!buyer) return <div className="p-10 text-center">Buyer not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 font-medium"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row gap-6">
        {/* LEFT */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img
            src={
              buyer.profile?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="buyer"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <h2 className="mt-4 text-xl font-bold">{buyer.name}</h2>
          <p className="text-gray-500">{buyer.email}</p>

          <span className="mt-3 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            Buyer Account
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Contact Info</h3>

          <p><b>Phone:</b> {buyer.profile?.phone || "Not provided"}</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Address</h3>

          <p>{buyer.profile?.address?.line1 || "—"}</p>
          <p>
            {buyer.profile?.address?.city || ""}{" "}
            {buyer.profile?.address?.state || ""}
          </p>
          <p>{buyer.profile?.address?.pincode || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;
