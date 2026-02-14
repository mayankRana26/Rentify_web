import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Get user & role from localStorage
const { user } = useAuth;
const role = user?.role;

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* BRAND SECTION */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white mb-4 block">
              Rentify<span className="text-indigo-500">.</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Simplifying the way you find your next home. Trusted by thousands of happy tenants and owners.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-500 transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
              Platform
            </h4>

            <ul className="space-y-4 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to={role === "seller" ? "/create-listing" : "/browse"}
                  className="hover:text-white transition-colors"
                >
                  {role === "seller" ? "Add Listing" : "Browse Items"}
                </Link>
              </li>

              <li>
                <Link
                  to={role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
              Support
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest listings.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-800 border-none text-white px-4 py-2 rounded-l-lg focus:ring-2 focus:ring-indigo-500 w-full outline-none"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors font-bold">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            &copy; {currentYear} Rentify. All rights reserved.
          </p>
          <p className="flex items-center text-gray-500 mt-4 md:mt-0">
            Made with <span className="text-red-500 mx-1">❤️</span> for your next home.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
