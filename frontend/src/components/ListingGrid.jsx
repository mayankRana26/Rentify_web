// frontend/src/components/ListingGrid.jsx
import { useState, useEffect } from 'react'; // React ke hooks
import axios from 'axios'; // API call ke liye
import ListingCard from './ListingCard';

// Backend URL environment variable se lein
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ListingGrid = ({ currentFilter }) => {
  // Data, loading, aur error ke liye state banayein
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook API call ke liye use hota hai
  // Yeh component ke render hone par sirf ek baar chalega
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/listings`);
        setListings(data); // API se aaye data ko state mein set karein
      } catch (err) {
        setError('Failed to fetch listings. Please try again later.');
        console.error("Listings fetch karne mein error:", err);
      } finally {
        setLoading(false); // Loading ko false karein, chahe success ho ya error
      }
    };

    fetchListings();
  }, []); // [] ka matlab hai ki yeh effect sirf ek baar run hoga

  // Loading state handle karein
  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading items...</p>;
  }

  // Error state handle karein
  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  // Ab data ko filter karein (yeh logic pehle jaisa hi hai)
  const filteredListings = listings.filter(listing => {
    if (currentFilter === 'All') {
      return true;
    }
    return listing.listingType === currentFilter;
  });

  return (
    <>
      {filteredListings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No items found for this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
};

export default ListingGrid;