import axios from "axios";

const SellerOrders = ({ orderId }) => {
  const updateStatus = async (status) => {
    await axios.patch(`/api/orders/verify-buyer/${orderId}`, {
      status,
    });
    alert(`Buyer ${status}`);
  };

  return (
    <div className="space-x-3">
      <button
        onClick={() => updateStatus("verified")}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Verify Buyer
      </button>

      <button
        onClick={() => updateStatus("rejected")}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Reject Buyer
      </button>
    </div>
  );
};

export default SellerOrders;
