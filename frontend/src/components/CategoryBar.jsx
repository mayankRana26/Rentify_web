import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import categories from "./data/categories";

const CategoryBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const boxRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 flatten items for search
  const allItems = categories.flatMap((cat) => cat.items);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allItems
      .filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8);

    setSuggestions(filtered);
  }, [search]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToBrowse = (category, query = "") => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("query", query);

    navigate(`/browse?${params.toString()}`);
    setOpen(false);
    setSuggestions([]);
    setSearch("");
  };

  return (
    <div className="sticky top-18 z-40 bg-white border-t shadow">
      <div className="flex items-center px-4 py-3 gap-4">

        {/* ALL CATEGORIES */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-1 font-medium"
          >
            All Categories
            <ChevronDown
              size={18}
              className={`transition ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute top-9 left-0 w-[850px] bg-white border shadow-lg p-6 grid grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.title}>
                  <h4
                    onClick={() => goToBrowse(cat.title)}
                    className="font-semibold cursor-pointer hover:text-blue-600"
                  >
                    {cat.title}
                  </h4>

                  <ul className="mt-2 space-y-1 text-sm">
                    {cat.items.map((item) => (
                      <li
                        key={item}
                        onClick={() => goToBrowse(cat.title, item)}
                        className="cursor-pointer hover:text-blue-500"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex-1 relative" ref={boxRef}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!search.trim()) return;
              goToBrowse("", search);
            }}
            className="flex items-center bg-gray-100 px-4 py-2 rounded-full"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent w-full outline-none"
            />
            <Search size={18} />
          </form>

          {suggestions.length > 0 && (
            <div className="absolute mt-2 bg-white border shadow rounded w-full max-w-xl z-50">
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => goToBrowse("", item)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
