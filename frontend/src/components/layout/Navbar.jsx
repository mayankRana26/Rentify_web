import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  // 👉 ADMIN DASHBOARD ENTRY POINT
  const goToAdmin = () => {
    navigate("/admin/login");
    setIsOpen(false);
  };

  const role = user?.role;

  // Helper to highlight active link
  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600"
      : "text-gray-600 hover:text-indigo-600";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight"
          >
            Rentify
          </Link>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="flex items-center space-x-4 md:hidden">
            {user && <NotificationBell />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <div className="flex items-center space-x-6">
                  {role === "buyer" && (
                    <>
                      <Link to="/buyer" className={`font-semibold transition-colors ${isActive("/buyer")}`}>Home</Link>
                      <Link to="/browse" className={`font-semibold transition-colors ${isActive("/browse")}`}>Browse</Link>
                      <Link to="/buyer-dashboard" className={`font-semibold transition-colors ${isActive("/buyer-dashboard")}`}>Dashboard</Link>
                    </>
                  )}
                  {role === "seller" && (
                    <>
                      <Link to="/seller" className={`font-semibold transition-colors ${isActive("/seller")}`}>Home</Link>
                      <Link to="/create-listing" className={`font-semibold transition-colors ${isActive("/create-listing")}`}>Add Listing</Link>
                      <Link to="/seller-dashboard" className={`font-semibold transition-colors ${isActive("/seller-dashboard")}`}>Dashboard</Link>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-4 border-l pl-6 ml-2 border-gray-100">
                  <NotificationBell />
                  <ProfileMenu />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-5">
                <Link to="/login" className="font-semibold text-gray-600 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 text-white bg-indigo-600 rounded-full font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* 👉 ADMIN BUTTON (ALWAYS VISIBLE) */}
            <button
              onClick={goToAdmin}
              className="px-4 py-2 text-sm font-bold border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition-all"
            >
              Admin
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  {role === "buyer" && (
                    <>
                      <Link to="/buyer" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 px-2">Home</Link>
                      <Link to="/browse" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 px-2">Browse Items</Link>
                      <Link to="/buyer-dashboard" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 px-2">Dashboard</Link>
                    </>
                  )}
                  {role === "seller" && (
                    <>
                      <Link to="/seller" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 px-2">Home</Link>
                      <Link to="/create-listing" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 px-2">Add Listing</Link>
                      <Link to="/seller-dashboard" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 px-2">Dashboard</Link>
                    </>
                  )}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between px-2">
                    <ProfileMenu />
                    <button onClick={handleLogout} className="text-red-600 font-bold">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 px-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center font-bold text-gray-700 py-2">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-3 text-white bg-indigo-600 rounded-xl font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* 👉 MOBILE ADMIN BUTTON */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={goToAdmin}
                  className="w-full text-center font-bold text-indigo-600 py-2"
                >
                  Admin Dashboard
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
