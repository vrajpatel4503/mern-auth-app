import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../utils/ToastifyUtils.jsx";
import Loader from "../Loader.jsx";
import axios from "axios";

const API_URl = import.meta.env.VITE_API_URL;

const ProfileCard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${API_URl}/api/v1/user/user/details`, {
          withCredentials: true,
        });

        setData(res.data.user);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.log(`Error in profileCard :- ${error}`);
        setTimeout(() => {
          setLoading(false);
          showErrorToast(
            error.response?.data?.message ||
              "Failed to fetch profile. Please try again"
          );
          navigate("/profile");
        }, 2000);
      }
    };
    fetchUserDetails();
  });

  if (loading)
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <Loader />
    </div>
  );

  if (!data)
    return (
      <div className="w-full flex justify-center items-center py-10">
        <p className="text-lg">Failed to load profile.</p>
      </div>
    );

  return (
    <div className="w-full flex justify-center my-22 md:my-7 items-start py-6 px-4 sm:px-0">
      <div className="border border-gray-300 rounded-xl w-full sm:w-96 max-w-lg p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

        {/* Avatar */}
        <img
          src={data.avatar?.url}
          alt="user avatar"
          className="w-24 h-24 rounded-full mx-auto mb-6 border object-cover"
        />

        <div className="space-y-4 text-base sm:text-lg">
          <div className="flex justify-between flex-wrap">
            <strong>Full Name:</strong>
            <span>{data.fullName}</span>
          </div>
          <hr />

          <div className="flex justify-between flex-wrap">
            <strong>Email:</strong>
            <span className="break-all">{data.email}</span>
          </div>
          <hr />

          <div className="flex justify-between flex-wrap">
            <strong>Phone Number:</strong>
            <span>{data.phoneNumber}</span>
          </div>
          <hr />

          <div className="flex justify-between flex-wrap">
            <strong>Joined At:</strong>
            <span>{new Date(data.joinedAt).toISOString().slice(0, 10)}</span>
          </div>
          <hr />

          <div className="flex justify-between flex-wrap items-center">
            <strong>isOnline:</strong>
            <span
              className={`px-2 py-1 rounded-full text-white ${
                data.isOnline ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {data.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
