import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await login(formData.email, formData.password);

      // 🔁 Redirect back if protected route
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
        return;
      }

      // ✅ FIXED ROLE LOGIC
      if (userData.role === "seller") {
        navigate("/seller", { replace: true });
      } else {
        navigate("/buyer", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-50 p-8 rounded-xl shadow-lg border"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-6"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          No account?{" "}
          <Link to="/signup" className="text-indigo-600 underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
