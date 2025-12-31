import React, { useState } from "react";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/ToastifyUtils";
import Loader from "../Loader";

const API_URL = import.meta.env.VITE_API_URL;

const UpdatePhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePhoneNumberSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/user/update/phoneNumber`,
        { phoneNumber },
        { withCredentials: true }
      );
      showSuccessToast(
        res.data.message || "Phone number updated successfully!"
      );
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update phone number"
      );
    } finally {
      setLoading(false);
      setPhoneNumber("")
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      <div className="mb-2">
        <h2 className="text-lg font-semibold mb-2">Update Phone Number</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={phoneNumber}
            onChange={handleChange}
            placeholder="Enter new phone number"
            className="flex-1 p-3 md:h-12 border rounded-lg px-4 focus:outline-none"
          />

          <button
            onClick={handlePhoneNumberSubmit}
            className="
      h-12 min-w-40 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update Phone
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdatePhoneNumber;
