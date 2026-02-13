// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
// import ListingCard from '../components/ListingCard'; // Updated Component
import HeroSection from '../components/HeroSection';


const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/listings`); // Updated API endpoint
        setListings(data);
      } catch (error) {
        console.error("Listings fetch karne mein error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading Listings...</div>;

  return (
    <div>
      <HeroSection />
    </div>
  );
};

export default HomePage;