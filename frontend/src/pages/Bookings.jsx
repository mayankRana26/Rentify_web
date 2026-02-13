import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    adminApi.get("/bookings").then(res => setBookings(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Bookings</h1>

      {bookings.map(b => (
        <div
          key={b._id}
          className="bg-white p-3 mb-2 rounded shadow"
        >
          <p>User: {b.userId?.email}</p>
          <p>Amount: ₹{b.amount}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Bookings;
