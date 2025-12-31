import React, { useRef, useState } from "react";
import Loader from "../Loader";
import { showErrorToast, showSuccessToast } from "../../utils/ToastifyUtils";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const UpdateAvatar = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar: null,
  });

  const fileInputRef = useRef(null);

  // ---------- handle change -----------
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      // toast message if file exceed 200 KB
      if (file.size > 200 * 1024) {
        showErrorToast("Please upload an avatar that does not exceed 200 KB.");

        // clearing file from state
        setFormData((prev) => ({
          ...prev,
          [name]: null,
        }));

        // clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return;
      }

      // set file in state
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.avatar) {
      showErrorToast("Please select an avatar before updating.");
      return;
    }
    setLoading(true);

    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append("avatar", formData.avatar);

      const res = await axios.put(
        `${API_URL}/api/v1/user/update/avatar`,
        formDataToSubmit,
        {
          withCredentials: true,
        }
      );

      showSuccessToast(res.data.message || "Avatar updated successfully!");

      setFormData({ avatar: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setLoading(false);
    } catch (error) {
      console.log(`error in update user :- ${error}`);

      showErrorToast(
        error.response?.data?.message ||
          "Failed to update avatar. Please try again"
      );

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

      <div className="mb-4 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-3">Update Avatar</h2>

        {/* Hidden file input */}
        <input
          type="file"
          name="avatar"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
        />

        {/* Circular avatar */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 cursor-pointer flex items-center justify-center hover:border-blue-500 transition"
        >
          {formData.avatar ? (
            <img
              src={URL.createObjectURL(formData.avatar)}
              alt="Avatar Preview"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center">
              Click to
              <br />
              upload
            </span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 h-11 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Avatar
        </button>
      </div>
    </>
  );
};

export default UpdateAvatar;
