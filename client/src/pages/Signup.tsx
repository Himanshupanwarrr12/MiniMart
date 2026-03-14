import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../utils/axios.config";
import { validateSignupForm, getPasswordStrength } from "../utils/validation";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateSignupForm(
      formData.fullName,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/signup", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        navigate("/products");
      } else {
        setErrors({ general: "Signup failed. Please try again." });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors({ general: error.message || "Signup failed. Please try again." });
      } else if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg px-8 py-12 flex flex-col gap-6">

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Mini<span className="text-gray-400">mart</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Create your account</p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${
                errors.fullName ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-16 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 font-medium transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password strength bar */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.widthClass}`} />
                </div>
                <p className="text-xs mt-1 text-gray-500 font-medium">
                  {passwordStrength.label} password
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-16 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 font-medium transition"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-900 font-semibold hover:underline underline-offset-2 transition"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;