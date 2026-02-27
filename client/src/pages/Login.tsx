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

      const userData = await axiosInstance.post("/login", {
        email,
        password,
      });
      console.log("User Data : ", userData.data.data);
      dispatch(addUser(userData.data.data));
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Welcome back.</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Inputs */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 whitespace-nowrap">
            first time here?
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-black font-semibold underline underline-offset-2 hover:opacity-70 transition"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
