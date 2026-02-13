const OrderStatus = ({ status }) => {
  const steps = [
    "requested",
    "payment_pending",
    "payment_done",
    "shipped",
    "completed",
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3 text-xs">
      {steps.map((s) => (
        <span
          key={s}
          className={`px-3 py-1 rounded-full ${
            s === status
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {s.replace("_", " ")}
        </span>
      ))}
    </div>
  );
};

export default OrderStatus;
