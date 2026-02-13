import { ShoppingBag, FileText } from 'lucide-react';
import centerBanner from '../../assets/centerBanner.png';
import { Link } from "react-router-dom";



const HeroBuyer = () => {

  
  return (
    <div className="relative w-full md:min-h-[350px] -mt-10 mb-0  flex items-center justify-center overflow-hidden font-sans">

      {/* --- BACKGROUND IMAGE --- */}
      <img 
        src={centerBanner} 
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-fit"
      />

      {/* --- COLOR OVERLAY (green tint) --- */}
      <div className="absolute inset-0 bg-[#667C70]/70 "></div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-20 text-center px-6 flex flex-col items-center">

        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
          Find the Best Items <br /> to Rent or Buy
        </h1>

        <p className="mt-4 text-white/90 text-lg md:text-xl drop-shadow-sm">
          Discover thousands of listings around you at affordable prices.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col mb-2 sm:flex-row gap-4">
          <Link to="/browse">
          <button className="group flex items-center gap-2 bg-[#3C3C96] hover:bg-[#323280] text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
            <ShoppingBag size={20} />
            Browse Items
          </button>
          </Link>
          <Link to="/buyer-dashboard">
          <button className="group flex items-center gap-2 border border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all shadow-md">
            <FileText size={20} />
            View My Requests
          </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HeroBuyer;
