import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminKYC = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingKYC = async () => {
    try {
      const res = await api.get("/admin/kyc/pending");
      setSellers(res.data);
    } catch (error) {
      console.error("Failed to fetch KYC", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/kyc/${id}`, { status });
      fetchPendingKYC();
    } catch (error) {
      console.error("Failed to update KYC", error);
    }
  };

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  if (loading) {
    return <div className="p-6">Loading KYC requests...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Seller KYC Approvals
      </h2>

      {sellers.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded">
          No pending KYC requests.
        </div>
      ) : (
        sellers.map((seller) => (
          <div
            key={seller._id}
            className="border p-5 rounded-lg shadow mb-4 bg-white"
          >
            <h3 className="text-lg font-semibold">
              {seller.name}
            </h3>

            <p>Email: {seller.email}</p>

            <div className="mt-3 text-sm space-y-1">
              <p>PAN: {seller.kycDetails?.pan}</p>
              <p>Account: {seller.kycDetails?.accountNumber}</p>
              <p>IFSC: {seller.kycDetails?.ifsc}</p>
              <p>Bank: {seller.kycDetails?.bankName || "N/A"}</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => updateStatus(seller._id, "approved")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(seller._id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  ); 
};

export default AdminKYC;
