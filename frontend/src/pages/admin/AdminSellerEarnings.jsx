import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSellerEarnings = () => {
  const [data, setData] = useState([]);
  const [platformRevenue, setPlatformRevenue] = useState(0);
  const [grossVolume, setGrossVolume] = useState(0);

  const fetchEarnings = async () => {
    const res = await api.get("/admin/seller-earnings");
    setData(res.data);

    const totalPlatform = res.data.reduce(
      (acc, seller) => acc + (seller.totalPlatformRevenue || 0),
      0
    );

    const totalGross = res.data.reduce(
      (acc, seller) => acc + (seller.grossVolume || 0),
      0
    );

    setPlatformRevenue(totalPlatform);
    setGrossVolume(totalGross);
  };

  const handlePayout = async (sellerId) => {
    await api.post(`/admin/payout/${sellerId}`);
    fetchEarnings();
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Seller Earnings
      </h2>

      {/* Overall Summary */}
      <div className="mb-6 p-4 bg-gray-100 rounded shadow">
        <p className="font-semibold">
          💰 Platform Revenue: ₹{platformRevenue}
        </p>
        <p className="font-semibold">
          📊 Gross Volume: ₹{grossVolume}
        </p>
      </div>

      {data.map((seller) => (
        <div
          key={seller.sellerId}
          className="border p-4 rounded mb-4 shadow bg-white"
        >
          <h3 className="text-lg font-semibold">
            {seller.name}
          </h3>

          <p>Email: {seller.email}</p>

          {/* 🔥 BANK DETAILS (NEW) */}
          <div className="mt-3 p-3 bg-gray-50 rounded border">
            <p className="font-semibold text-sm text-gray-600 mb-1">
              🏦 Bank Details
            </p>
            <p className="text-sm">
              Account No:{" "}
              <span className="font-mono font-semibold">
                {seller.accountNumber || "Not Submitted"}
              </span>
            </p>
            <p className="text-sm">
              IFSC:{" "}
              <span className="font-mono font-semibold">
                {seller.ifsc || "Not Submitted"}
              </span>
            </p>
          </div>

          <div className="mt-4 space-y-1">
            <p>💵 Seller Earnings (Net): ₹{seller.totalEarnings}</p>
            <p>🏦 Platform Revenue from Seller: ₹{seller.totalPlatformRevenue || 0}</p>
            <p>📦 Gross Volume: ₹{seller.grossVolume || 0}</p>
            <p>⏳ Pending Payout: ₹{seller.pendingAmount}</p>
            <p>🔢 Transactions: {seller.transactionsCount}</p>
          </div>

          {seller.pendingAmount > 0 && (
            <button
              onClick={() => handlePayout(seller.sellerId)}
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
            >
              Release Payout
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminSellerEarnings;
