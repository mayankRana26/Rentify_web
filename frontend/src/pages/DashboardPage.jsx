// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import SellerDashboard from './SellerDashboard'; // Import Seller component
// import BuyerDashboard from './BuyerDashboard';   // Import Buyer component

// const DashboardPage = () => {
//   const [myListings, setMyListings] = useState([]);
//   const [incomingRequests, setIncomingRequests] = useState([]);
//   const [mySentRequests, setMySentRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user, token } = useAuth();

//   useEffect(() => {
//     // This function will fetch real data from your backend
//     const fetchData = async () => {
//       if (!token) return;
//       try {
//         // --- Dummy Data for Demonstration ---
//         setMyListings([ { _id: '1', title: 'My First Car', price: 500000 }]);
//         setIncomingRequests([ { _id: 'req1', listingTitle: 'My First Car', buyerName: 'Alice' } ]);
//         setMySentRequests([ { _id: 'sent1', listingTitle: 'Modern 2BHK Flat', status: 'Pending' } ]);
//       } catch (error) {
//         console.error("Failed to fetch dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [token]);

//   // Determine if the user has any activity
//   const hasSellerActivity = myListings.length > 0 || incomingRequests.length > 0;
//   const hasBuyerActivity = mySentRequests.length > 0;

//   if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}!</h1>

//       {/* If User has no activity at all */}
//       {!hasSellerActivity && !hasBuyerActivity && (
//         <div className="text-center bg-white p-10 rounded-lg shadow-md border">
//           <h2 className="text-2xl font-semibold text-gray-700">This is your central hub.</h2>
//           <p className="text-gray-500 mt-2">Find items to rent/buy or list your own to start earning.</p>
//           <div className="mt-6 flex justify-center gap-4">
//             <Link to="/browse" className="bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-black">
//               Browse Items
//             </Link>
//             <Link to="/create-listing" className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700">
//                + List an Item
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* Main dashboard layout */}
//       <div className="space-y-12">
//         {/* Render Seller Dashboard if there is seller activity */}
//         {hasSellerActivity && (
//           <SellerDashboard myListings={myListings} incomingRequests={incomingRequests} />
//         )}

//         {/* Render Buyer Dashboard if there is buyer activity */}
//         {hasBuyerActivity && (
//           <BuyerDashboard mySentRequests={mySentRequests} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;