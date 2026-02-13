const AdminNavbar = () => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="h-14 bg-white shadow flex items-center justify-end px-6">
      <button
        onClick={logout}
        className="bg-black text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
