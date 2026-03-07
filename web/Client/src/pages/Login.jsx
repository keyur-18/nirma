import { useState } from "react";
import { loginUser, getCurrentUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginUser(formData);

      const res = await getCurrentUser();
      setUser(res.data);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f5f8] px-4">

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">

        {/* Solar icon */}
        <div className="flex justify-center mb-4">
          <span className="text-3xl">🌤️</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-amber-600 mb-6">
          Solar Dashboard Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2.5 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-amber-400
            transition"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2.5 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-amber-400
            transition"
            onChange={handleChange}
            required
          />

          <button
            className="w-full bg-amber-500 text-white py-2.5 rounded-lg
            hover:bg-amber-600 transition duration-200 font-medium"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Don't have an account?{" "}
          <Link
            className="text-amber-600 font-medium hover:underline"
            to="/register"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;