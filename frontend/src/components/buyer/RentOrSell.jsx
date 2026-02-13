import React from "react";
import { Warehouse, ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RentOrSell = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10 border-b-4 border-gray-200 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        What do you want to do?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* RENT */}
        <div
          onClick={() => navigate("/browse?type=rent")}
          className="group p-8 rounded-2xl bg-gray-100 shadow-3xl hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full">
              <Warehouse size={40} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Rent Items
              </h3>
              <p className="text-gray-500 mt-1">
                Find items available for rent near you.
              </p>
            </div>
          </div>

          <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium">
            Browse Rent Items
          </button>
        </div>

        {/* SELL */}
        <div
          onClick={() => navigate("/browse?type=sell")}
          className="group p-8 rounded-2xl bg-gray-100 shadow-3xl hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-full">
              <ShoppingBasket size={40} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Buy Items
              </h3>
              <p className="text-gray-500 mt-1">
                Explore items available for direct purchase.
              </p>
            </div>
          </div>

          <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium">
            Browse Items for Sale
          </button>
        </div>

      </div>
    </div>
  );
};

export default RentOrSell;
