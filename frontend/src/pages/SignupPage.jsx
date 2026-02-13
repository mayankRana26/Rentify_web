// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer"
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(formData);

      if (data.role === "buyer") navigate("/buyer");
      else if (data.role === "seller") navigate("/seller");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-50 p-8 rounded-xl shadow-lg border border-gray-200"
      >
        <h2 className="text-3xl text-blue-800 font-bold text-center mb-6">Ready to Begin?</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border p-2 rounded mb-4"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
