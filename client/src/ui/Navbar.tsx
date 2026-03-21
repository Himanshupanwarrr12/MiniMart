import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { removeUser } from "../store/slices/userSlice";
import axiosInstance from "../utils/axios.config";

interface NavbarProps {
  username?: string;
  cartCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({username = "guest ",cartCount = 0,}) => {
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(removeUser());
      localStorage.removeItem("user");
      setAccountOpen(false);
      navigate("/login");
    }
  };

  const handleMenuClick = (item: string) => {
    if (item === "Sign Out") {
      handleLogout();
    } else if (item === "Profile") {
      navigate("/profile");
      setAccountOpen(false);
    } else if (item === "Settings") {
      navigate("");
      setAccountOpen(false);
    }
  };

  return (
    <nav className="bg-gray-900 text-white w-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700">
        <div className="flex items-center">
          <span
            className="text-4xl font-extrabold tracking-tight text-white cursor-pointer select-none"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "-1px" }}
            onClick={() => navigate("/")}
          >
            Mini<span className="text-gray-400">mart</span>
          </span>
        </div>

        <div className="flex-1 mx-10 hidden md:flex">
          <div className="flex w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-black text-sm rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-900 bg-gray-100 border-2 border-gray-300"
            />
            <button className="bg-indigo-900 hover:bg-indigo-950 transition-colors px-4 py-2 rounded-r-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setAccountOpen((p) => !p)}
              className="flex flex-col items-start px-3 py-1 rounded hover:outline-1 hover:outline-white transition-all"
            >
              <span className="text-xs text-gray-400">Hello,</span>
              <span className="text-sm font-bold flex items-center gap-1">
                {user?.firstName || username ? user?.firstName : (
                  <div className="w-16 h-3 bg-gray-600 rounded animate-pulse" />
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${accountOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white text-black rounded shadow-lg z-50 text-sm">
                <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700">
                  My Account
                </div>
                {["Profile", "Settings", "Sign Out"].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      item === "Sign Out" ? "font-medium" : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex flex-col items-start px-3 py-1 rounded hover:outline-1 hover:outline-white transition-all"
          onClick={()=> navigate("/orders")}>
            <span className="text-xs text-gray-400">Returns &</span>
            <span className="text-sm font-bold flex items-center gap-1">
              <Package size={14} />
              Orders
            </span>
          </button>

          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:outline-1 hover:outline-white transition-all relative"
            onClick={() => navigate("/cart")}
          >
            <div className="relative">
              <ShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 flex items-center gap-6 px-6 py-2 text-sm overflow-x-auto">
        {["All Departments", "Today's Deals", "New Arrivals", "Electronics", "Groceries", "Clothing", "Home & Kitchen"].map(
          (item) => (
            <button
              key={item}
              className="whitespace-nowrap hover:text-white text-gray-300 hover:underline transition-colors"
            >
              {item}
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;