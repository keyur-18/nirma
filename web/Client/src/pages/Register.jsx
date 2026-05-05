import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Sun } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(formData);
      navigate("/");
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main card container */}
      <div className="w-full max-w-md z-10">
        
        {/* Glassmorphic card */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-3xl">
          
          {/* Header with icon */}
          <div className="flex justify-center mb-2">
            <div className="p-2.5 bg-linear-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg">
              <Sun className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Create Solar Account
          </h1>
          
          <p className="text-center text-gray-600 text-sm mb-6">
            Join thousands monitoring their solar energy
          </p>

          {/* Error message */}
          {errors.submit && (
            <div className="alert alert-error mb-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="text-sm text-red-700">{errors.submit}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold text-gray-700">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent rounded-xl transition-all duration-200 ${
                    errors.name ? "input-error" : ""
                  }`}
                  required
                  aria-label="Full Name"
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && <label className="label pt-1"><span className="label-text-alt text-error text-sm">{errors.name}</span></label>}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold text-gray-700">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent rounded-xl transition-all duration-200 ${
                    errors.email ? "input-error" : ""
                  }`}
                  required
                  aria-label="Email Address"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <label className="label pt-1"><span className="label-text-alt text-error text-sm">{errors.email}</span></label>}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold text-gray-700">Password</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 pr-12 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent rounded-xl transition-all duration-200 ${
                    errors.password ? "input-error" : ""
                  }`}
                  required
                  aria-label="Password"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && <label className="label pt-1"><span className="label-text-alt text-error text-sm">{errors.password}</span></label>}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="btn btn-primary w-full text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* Sign in link */}
          <p className="text-center text-gray-700 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700 link link-primary transition-colors"
            >
              Sign in here
            </Link>
          </p>

        </div>

        {/* Footer text */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Protected by industry-leading security
        </p>

      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

    </div>
  );
}

export default Register;