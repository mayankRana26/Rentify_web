import { useNavigate, useSearchParams } from "react-router-dom";

import mobile2 from "./../assets/mobile2.png";
import car from "./../assets/car.png";
import bike from "./../assets/bike.png";
import electronics from "./../assets/electronics.png";
import furniture from "./../assets/furniture.png";
import prop from "./../assets/prop.png";
import job from "./../assets/job.png";
import pet from "./../assets/pet.png";

const CATEGORY_TILES = [
  { title: "Mobiles", image: mobile2, category: "Mobiles", query: "Mobile Phones" },
  { title: "Cars", image: car, category: "Cars & Vehicles", query: "Cars" },
  { title: "Bikes", image: bike, category: "Cars & Vehicles", query: "Bikes" },
  { title: "Electronics", image: electronics, category: "Electronics & Appliances", query: "Electronics" },
  { title: "Furniture", image: furniture, category: "Furniture", query: "Furniture" },
  { title: "Properties", image: prop, category: "Properties", query: "Houses" },
  { title: "Jobs", image: job, category: "Jobs", query: "Jobs" },
  { title: "Pets", image: pet, category: "Pets", query: "Dogs" },
];

const CategoryTiles = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeQuery = searchParams.get("query");

  const handleClick = (item) => {
    navigate(
      `/browse?category=${encodeURIComponent(item.category)}&query=${encodeURIComponent(item.query)}`
      
    );
  };

  const isActive = (item) =>
    item.category === activeCategory && item.query === activeQuery;

  return (
    <div className="bg-white py-4 shadow-2xl -mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {CATEGORY_TILES.map((item) => (
            <div
              key={item.title}
              onClick={() => handleClick(item)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`w-20 h-20 rounded-md p-1 flex items-center justify-center transition
                  ${
                    isActive(item)
                      ? "bg-blue-200 ring-2 ring-blue-400"
                      : "bg-white hover:bg-blue-100"
                  }
                `}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                />
              </div>

              <p
                className={`mt-1 text-xs sm:text-sm font-medium text-center
                  ${
                    isActive(item)
                      ? "text-blue-700"
                      : "text-gray-700 hover:text-blue-600"
                  }
                `}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTiles;
