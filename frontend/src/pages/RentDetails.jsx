import React from "react";
import VerificationStatus from "../components/VerificationStatus";

const RentDetails = () => {
  const verificationStatus = "pending"; // backend se aayega

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rent Item</h1>
      <VerificationStatus status={verificationStatus} />
    </div>
  );
};

export default RentDetails;
