import { useNavigate } from "react-router-dom";

const SellerListingsGrid = ({ listings }) => {
  const navigate = useNavigate();

  if (!listings || listings.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No listings yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={item.photos?.[0]}
            alt={item.title}
            className="h-48 w-full object-cover"
          />

          <div className="p-4">
            <h3 className="font-semibold text-lg truncate">
              {item.title}
            </h3>

            <p className="text-gray-500 text-sm truncate">
              {item.location}
            </p>

            <p className="text-indigo-600 font-bold mt-1">
              ₹{item.price}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/listing/${item._id}`)}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              >
                View
              </button>

              <button
                className="flex-1 px-3 py-2 rounded-md text-sm text-white bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerListingsGrid;
