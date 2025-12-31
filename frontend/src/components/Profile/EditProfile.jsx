import React, { useState } from "react";
import axios from "axios";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/ToastifyUtils.jsx";
import Loader from "../Loader.jsx";
import ProfileSidebar from "./ProfileSidebar.jsx";
import UpdatePhoneNumber from "./UpdatePhoneNumber.jsx";
import UpdateAvatar from "./UpdateAvatar.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/user/update/email`,
        { email },
        { withCredentials: true }
      );
      showSuccessToast(res.data.message || "Email updated successfully!");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to update email");
    } finally {
      setLoading(false);
      setEmail("")
    }
  };

  const handlePasswordSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/user/update/password`,
        { password },
        { withCredentials: true }
      );
      showSuccessToast(res.data.message || "Password updated successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
      setPassword("")
    }
  };

  return (
    <>
      <ProfileSidebar />

      <main className=" pt-14 md:pt-6 mb-6 ml-0 min-h-screen pb-[140px] px-4 ">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
            <Loader />
          </div>
        )}

        <div className="flex justify-center ">
          <div className="w-full max-w-2xl bg-white border rounded-xl shadow p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
              Edit Profile
            </h1>

            {/* Update Avatar */}
            <UpdateAvatar />

            <hr className="my-6" />

            {/* Update Email */}
            <div className="mb-2">
              <h2 className="text-lg font-semibold mb-2">Update Email</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter new email"
                  className="flex-1 p-3 md:h-12 border rounded-lg px-4 focus:outline-none"
                />

                <button
                  onClick={handleEmailSubmit}
                  className="h-12 min-w-40 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update Email
                </button>
              </div>
            </div>

            <hr className="my-6" />

            {/* Update Password */}
            <div className="mb-2">
              <h2 className="text-lg font-semibold mb-2">Update Password</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="flex-1 p-3 md:h-12 border rounded-lg px-4 focus:outline-none"
                />

                <button
                  onClick={handlePasswordSubmit}
                  className="h-12 min-w-40 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
              </div>
            </div>

            <hr className="my-6" />

            {/* Update Phone */}
            <UpdatePhoneNumber />
          </div>
        </div>
      </main>
    </>
  );
};

export default EditProfile;
