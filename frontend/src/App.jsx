// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Page Components
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import ListingPage from "./pages/ListingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateListingPage from "./pages/CreateListingPage";

// Auth Component
import PrivateRoute from "./components/auth/PrivateRoute";
import BuyerPage from "./pages/BuyerPage";
import SellerPage from "./pages/SellerPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import CategoryBar from "./components/CategoryBar";

// 🔥 AUTH CONTEXT
import { useAuth } from "./context/AuthContext";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import BuyerProfile from "./pages/BuyerProfile";
import SellerForm from "./pages/SellerForm";

// 🔹 LEGAL PAGES
import HelpCenter from "./pages/HelpCenter";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// 🔹 ADMIN PAGES
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminRoutes from "./components/routes/AdminRoutes";
import Sellers from "./pages/admin/Sellers";
import Buyers from "./pages/admin/Buyers";
import AdminLayout from "./pages/admin/AdminLayout";
import BuyerBookings from "./pages/admin/BuyerBookings";
import SellerDetails from "./pages/admin/SellerDetails";
import { Toaster } from "react-hot-toast";
import AdminSellerEarnings from "./pages/admin/AdminSellerEarnings";
import AdminKYC from "./pages/admin/AdminKYC";
// import AdminRoutes from "./routes/AdminRoutes";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // optional loader

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
          <Toaster position="top-right" />
        {/* 🔥 Category bar only for logged-in buyers/sellers */}
        {user && <CategoryBar />}

        <main className="flex-grow">
          <Routes>
            {/* 🌍 PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 📄 LEGAL / INFO */}
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* 🔐 USER PROTECTED ROUTES */}
            <Route element={<PrivateRoute />}>
              <Route path="/buyer" element={<BuyerPage />} />
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="/seller" element={<SellerPage />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/buyer-profile/:id" element={<BuyerProfile />} />
              <Route path="/seller-form" element={<SellerForm />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
            </Route>

            {/* 🛡️ ADMIN ROUTES (SEPARATE AUTH SYSTEM) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
  path="/admin"
  element={
    <AdminRoutes>
      <AdminLayout />
    </AdminRoutes>
  }
> 

  <Route path="dashboard" element={<Dashboard />} />
  <Route path="buyers" element={<Buyers />} />
  <Route path="buyers/:id" element={<BuyerBookings />} />
<Route path="/admin/seller/:id" element={<SellerDetails />} />
<Route
  path="seller-earnings"
  element={<AdminSellerEarnings />}
/>

  <Route path="sellers" element={<Sellers />} />
  <Route path="kyc" element={<AdminKYC />} />

</Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
