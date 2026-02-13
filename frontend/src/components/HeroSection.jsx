import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Tag, Star } from "lucide-react"; // Import Icons
import heroImage from "../assets/bike.png"; 

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login", { state: { from: path } });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 bg-white">
      
      {/* LEFT CONTENT */}
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Rent, Buy Or Sell Anything <br />
          Online All In One <span className="text-blue-600">Marketplace</span>
        </h1>

        <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
          Discover Affordable Rentals, Buy Quality Products, Or Sell Your Items 
          Easily On Rentify. A Secure Platform To Connect Buyers And Sellers Near You.
        </p>

        <div className="flex flex-wrap gap-4">
          {/* RENT BUTTON */}
          <button
            onClick={() => handleNavigation("/browse")}
            className="flex items-center gap-2 bg-[#0000FF] hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-all"
          >
            <ShoppingCart size={20} />
            Rent Items
          </button>
          
          {/* SELL BUTTON */}
          <button
            onClick={() => handleNavigation("/seller")}
            className="flex items-center gap-2 bg-[#0000FF] hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-all"
          >
            Sell Items
            <Tag size={20} />
          </button>
        </div>

        {/* RATING SECTION */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img 
                key={i}
                src={`https://i.pravatar.cc/100?img=${i+10}`} 
                className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                alt="user" 
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#4F75FF] flex items-center justify-center text-[10px] text-white font-bold">
              15K
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#FACC15" color="#FACC15" />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Rated 5.0/5.0 by users</p>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="flex-1 w-full">
        <img 
          src={heroImage} 
          alt="Two men shaking hands over a motorcycle" 
          className="w-full h-auto rounded-xl shadow-sm object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;