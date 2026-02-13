import React from "react";

const VerificationStatus = ({ status }) => {
  const statusText = {
    pending: "Pending Verification",
    verified: "Verified",
    rejected: "Rejected",
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    verified: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm max-w-md">
      <h2 className="text-lg font-semibold mb-2">
        Identity Verification
      </h2>

      <button
        disabled
        className="w-full py-2 mb-3 bg-gray-200 text-gray-700 rounded"
      >
        Documents will be collected offline
      </button>

      <div
        className={`inline-block px-3 py-1 rounded-full text-sm ${statusColor[status]}`}
      >
        Status: {statusText[status]}
      </div>
    </div>
  );
};

export default VerificationStatus;
