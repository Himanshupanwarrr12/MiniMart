import { Outlet } from "react-router-dom";
import Navbar from "./ui/Navbar";
import { useEffect } from "react";
import axiosInstance from "./utils/axios.config";
import { useDispatch } from "react-redux";
import { addUser } from "./store/slices/userSlice";

const AppLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) dispatch(addUser(JSON.parse(storedUser)));
    } catch (error: unknown) {
      console.warn("Invalid user data in localStorage, clearing...", error);
      localStorage.removeItem("user");
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/profile");
        const user = data.data;
        dispatch(addUser(user));
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.log("error during fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
export default AppLayout;
