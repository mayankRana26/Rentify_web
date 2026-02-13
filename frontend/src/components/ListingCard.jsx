// frontend/src/components/ListingCard.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-lg shadow-md overflow-hidden relative border"
    >
      {/* Dynamic Tag for Rent or Sale */}
      <div className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full z-10 ${listing.listingType === 'Rent' ? 'bg-blue-500' : 'bg-green-500'}`}>
        FOR {listing.listingType.toUpperCase()}
      </div>
      
      <Link to={`/listing/${listing._id}`}>
        <div className="w-full h-56">
          <img
            src={listing.photos[0] || 'https://via.placeholder.com/400x250'}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 font-medium">{listing.category}</p>
          <h3 className="text-lg font-semibold text-gray-800 truncate mt-1">{listing.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{listing.location}</p>
          
          {/* Dynamic Price Display */}
          <p className="text-xl font-bold text-indigo-600 mt-4">
            ₹{listing.price.toLocaleString()}
            {listing.listingType === 'Rent' && <span className="text-sm font-normal text-gray-500"> /{listing.priceType}</span>}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingCard;