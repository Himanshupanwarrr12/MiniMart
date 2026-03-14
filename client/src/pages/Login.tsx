import { useState } from "react";
import axiosInstance from "../utils/axios.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/slices/userSlice";

const Login = () => {
  const [email, setEmail] = useState("himanshu12@gmail.com");
  const [password, setPassword] = useState("Himanshu@12");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError("");

      const userData = await axiosInstance.post("/login", { email, password });
      dispatch(addUser(userData.data.data));
      localStorage.setItem("user", userData.data.data);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login Failed");
        console.log("Unexpected error type : ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg px-8 py-12 flex flex-col gap-6">

        {/* Logo / Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Mini<span className="text-gray-400">mart</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button type="button" className="text-xs text-gray-400 hover:text-gray-700 transition">
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-gray-900 font-semibold hover:underline underline-offset-2 transition"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;