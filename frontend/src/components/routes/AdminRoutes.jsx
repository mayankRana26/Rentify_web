import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  // agar admin login nahi hai → admin login page
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // admin logged in → allow access
  return children;
};

export default AdminRoutes;
