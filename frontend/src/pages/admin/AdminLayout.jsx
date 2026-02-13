import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "block px-4 py-2 bg-indigo-600 text-white rounded"
      : "block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

<nav className="space-y-2">
  <NavLink to="/admin/dashboard" className={linkClass}>
    Dashboard
  </NavLink>

  <NavLink to="/admin/buyers" className={linkClass}>
    Buyers
  </NavLink>

  <NavLink to="/admin/sellers" className={linkClass}>
    Sellers
  </NavLink>

  <NavLink to="/admin/seller-earnings" className={linkClass}>
    Seller Earnings
  </NavLink>
    <NavLink to="/admin/kyc" className={linkClass}>
    KYC Requests
  </NavLink>
</nav>

      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
