import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import EditProfile from "./EditProfile";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/ToastifyUtils";
import Loader from "../Loader";

const API_URL = import.meta.env.VITE_API_URL;

const MangeProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${API_URL}/api/v1/user/delete/account`, {
        withCredentials: true,
      });
      showSuccessToast(res.data.message || "Successfully delete account");
      navigate("/login");

      // try part end
    } catch (error) {
      console.log(`Error in handleDelete :- ${error}`);
      showErrorToast(
        error.response?.data?.message ||
          "Failed to Delete account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      <div className=" flex flex-row">
        <ProfileSidebar />
        <div className="mt-10 border md:w-full border-red-300 rounded-xl bg-red-50 p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <IoIosWarning size={24} />
            <h2 className="text-lg font-semibold">Delete Account</h2>
          </div>

          {/* Warning Text */}
          <p className="text-sm text-gray-700 leading-relaxed mb-5">
            Deleting your account is a{" "}
            <span className="font-semibold">permanent action</span>. Once
            deleted, all your profile data, login access, and related
            information will be permanently removed. This action{" "}
            <span className="font-semibold">cannot be undone</span>.
          </p>

          {/* Action Button */}
          <button
            className="w-full h-12 flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleDelete}
          >
            <FaTrashAlt />
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
};

export default MangeProfile;
