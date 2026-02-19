import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../utils/axios.config";
import { validateLoginForm } from "../utils/validation";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    const validation = validateLoginForm(
      formData.email,
      formData.password
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        navigate("/products");
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.message || "Login failed. Please try again.";
        setErrors({ general: message });
      } else if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#000000] mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to your account
          </p>
        </div>

        {errors.general && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 text-sm rounded-lg bg-white border transition focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] text-[#000000] placeholder-gray-400 ${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-[#4ECDC4]"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1.5">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full px-4 py-3 pr-11 text-sm rounded-lg bg-white border transition focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] text-[#000000] placeholder-gray-400 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-[#4ECDC4]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1.5">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000000] hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">
              New to our platform?
            </span>
          </div>
        </div>

        <Link
          to="/signup"
          className="block w-full text-center py-3 rounded-lg border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white font-semibold transition-all duration-200"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
