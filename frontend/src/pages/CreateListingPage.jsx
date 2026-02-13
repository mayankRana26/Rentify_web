import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ;

const CATEGORY_DATA = {
  "Cars & Vehicles": [
    "Cars",
    "Bikes",
    "Motorcycles",
    "Scooters",
    "Spare Parts",
    "Bicycles",
    "Commercial & Other Vehicles",
  ],
  Properties: [
    "For Sale: Houses & Apartments",
    "For Rent: Houses & Apartments",
    "Lands & Plots",
    "New Projects",
    "For Rent: Shops & Offices",
    "For Sale: Shops & Offices",
    "PG & Guest Houses",
  ],
  "Electronics & Appliances": [
    "TVs, Video - Audio",
    "Kitchen & Other Appliances",
    "Computers & Laptops",
    "Cameras & Lenses",
    "Games & Entertainment",
    "Fridges",
    "Computer Accessories",
    "Hard Disks, Printers & Monitors",
    "ACs",
    "Washing Machines",
  ],
  Mobiles: ["Mobile Phones", "Accessories", "Tablets"],
  Jobs: [
    "Data entry & Back office",
    "Sales & Marketing",
    "BPO & Telecaller",
    "Driver",
    "Office Assistant",
    "Delivery & Collection",
    "Teacher",
    "Cook",
    "Receptionist & Front office",
    "Operator & Technician",
    "IT Engineer & Developer",
    "Hotel & Travel Executive",
    "Accountant",
    "Warehouse Staff",
    "Designer",
    "Other Jobs",
  ],
  Furniture: [
    "Sofa & Dining",
    "Beds & Wardrobes",
    "Home Decor & Garden",
    "Kids Furniture",
    "Other Household Items",
  ],
  Fashion: ["Men", "Women", "Kids"],
  Pets: [
    "Fishes & Aquarium",
    "Pet Food & Accessories",
    "Dogs",
    "Other Pets",
  ],
};

const CreateListingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainCategory: "Cars & Vehicles",
    subCategory: "",
    listingType: "Rent",
    price: "",
    priceType: "per month",
    location: "",
  });

  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => setPhotos([...e.target.files]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = new FormData();

    Object.keys(formData).forEach((key) =>
      dataToSubmit.append(key, formData[key])
    );

    photos.forEach((p) => dataToSubmit.append("photos", p));
    if (video) dataToSubmit.append("video", video);

    try {
      await axios.post(`${API_URL}/api/listings`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/seller-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          List Your Item
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </p>
        )}

        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          required
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          required
        />

        <select
          name="mainCategory"
          value={formData.mainCategory}
          onChange={(e) =>
            setFormData({
              ...formData,
              mainCategory: e.target.value,
              subCategory: "",
            })
          }
          className="w-full mb-4 px-4 py-2 border rounded-lg bg-white"
        >
          {Object.keys(CATEGORY_DATA).map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          name="subCategory"
          value={formData.subCategory}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg bg-white"
          required
        >
          <option value="">Select Sub Category</option>
          {CATEGORY_DATA[formData.mainCategory].map((sub) => (
            <option key={sub}>{sub}</option>
          ))}
        </select>

        <select
          name="listingType"
          value={formData.listingType}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg bg-white"
        >
          <option value="Rent">For Rent</option>
          <option value="Sale">For Sale</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          required
        />

        <select
          name="priceType"
          value={formData.priceType}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg bg-white"
        >
          {formData.listingType === "Rent" ? (
            <>
              <option value="per month">Per Month</option>
              <option value="per day">Per Day</option>
            </>
          ) : (
            <option value="one-time">One-time</option>
          )}
        </select>

       {/* PHOTO UPLOAD */}
<div className="mb-4">
  <input
    type="file"
    id="photoInput"
    multiple
    accept="image/*"
    onChange={handlePhotoChange}
    className="hidden"
    required
  />

  <button
    type="button"
    onClick={() => document.getElementById("photoInput").click()}
    className="w-full bg-gray-100 border border-gray-300 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
  >
    Choose Item Photos
  </button>

  {/* Selected Preview Count */}
  {photos.length > 0 && (
    <p className="text-sm text-gray-600 mt-2">
      {photos.length} photo(s) selected
    </p>
  )}
</div>


    <div className="mb-6">
  <input
    type="file"
    id="videoInput"
    accept="video/*"
    onChange={handleVideoChange}
    className="hidden"
  />

  <button
    type="button"
    onClick={() => document.getElementById("videoInput").click()}
    className="w-full bg-gray-100 border border-gray-300 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
  >
    Choose Item Video (Optional)
  </button>

  {video && (
    <p className="text-sm text-gray-600 mt-2">
      Video selected: {video.name}
    </p>
  )}
</div> 

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          {loading ? "Submitting..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;
