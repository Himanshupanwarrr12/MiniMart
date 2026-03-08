import { Outlet } from "react-router-dom";
import Navbar from "./ui/Navbar";
import { useEffect } from "react";
import axiosInstance from "./utils/axios.config";

const AppLayout = () => {
  useEffect(() => {
    try {
      const fetchProfile = async () => {
        const data = await axiosInstance.get("/profile");
        console.log("data : ",data)
      };
      fetchProfile();
    } catch (error) {
      console.log("error during fetch profile", error);
    }
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
