import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-black text-white p-5">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/sellers">Sellers</NavLink>
        <NavLink to="/admin/listings">Listings</NavLink>
        <NavLink to="/admin/bookings">Bookings</NavLink>
        <NavLink to="/admin/seller-earnings">
          Seller Earnings
        </NavLink>
        <NavLink to="/admin/kyc">KYC Requests</NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
