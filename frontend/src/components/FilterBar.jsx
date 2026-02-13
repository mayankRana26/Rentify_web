// frontend/src/components/FilterBar.jsx

const FilterBar = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-grow w-full">
        <input 
          type="text" 
          placeholder="What are you looking for?"
          className="border rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Category Filter */}
      <select className="border rounded-md py-2 px-4 w-full md:w-auto bg-white focus:outline-none">
        <option>All Categories</option>
        <option>Property</option>
        <option>Vehicle</option>
        <option>Electronics</option>
        <option>Furniture</option>
      </select>

      {/* Type Filter */}
      <select className="border rounded-md py-2 px-4 w-full md:w-auto bg-white focus:outline-none">
        <option>Rent or Sale</option>
        <option>For Rent</option>
        <option>For Sale</option>
      </select>

      <button className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700">
        Filter
      </button>
    </div>
  );
};

export default FilterBar;