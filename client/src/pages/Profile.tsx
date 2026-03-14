import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { addUser } from "../store/slices/userSlice";
import axiosInstance from "../utils/axios.config";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  general?: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess("");
    setErrors({});

    try {
      const { data } = await axiosInstance.put("/profile", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      dispatch(addUser(data.data));
      localStorage.setItem("user", JSON.stringify(data.data));
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Failed to update profile" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
    setErrors({});
    setEditing(false);
  };

  // Avatar initials
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg px-8 py-12 flex flex-col gap-6">

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold select-none">
            {initials}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <span className="inline-block mt-1 text-xs font-medium px-3 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                errors.firstName ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Buttons */}
          {!editing ? (
            <button
              type="button"
              onClick={() => { setEditing(true); setSuccess(""); }}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};

export default Profile;