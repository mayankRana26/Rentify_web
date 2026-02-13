import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Heroseller from "../components/seller/Heroseller";
import SellerListingsGrid from "../components/SellerListingsGrid";

const API_URL = import.meta.env.VITE_API_URL;

const SellerPage = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchMyListings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/listings`);

        // 🔥 Sirf current seller ki listings
        const filtered = data.filter(
          (item) => item.owner?._id === user._id
        );

        setMyListings(filtered);
      } catch (err) {
        console.error("SELLER LISTINGS ERROR:", err);
      }
    };

    fetchMyListings();
  }, [user]);

  return (
    <div className="py-10 px-2 mx-auto">
      <Heroseller />

      {/* 🔥 Ab data pass ho raha hai */}
      <SellerListingsGrid listings={myListings} />
    </div>
  );
};

export default SellerPage;
