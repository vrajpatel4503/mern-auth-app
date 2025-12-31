import React, { useState } from "react";
import { FaUser, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/ToastifyUtils.jsx";

const API_URL = import.meta.env.VITE_API_URL;

// MUST MATCH footer height exactly
const FOOTER_HEIGHT = "120px";
const SIDEBAR_WIDTH = "18rem"; // w-72

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      showSuccessToast(res.data.message || "Logout successful");
      navigate("/login");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Logout failed");
    }
  };

  const navClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-100"
    }`;

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 border-b bg-white z-50">
        <button onClick={() => setIsOpen(true)}>
          <FaBars size={22} />
        </button>
        <span className="ml-4 font-semibold">My Account</span>
      </header>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="hidden md:flex fixed top-0 left-0 bg-white border-r z-40 flex-col"
        style={{
          width: SIDEBAR_WIDTH,
          height: `calc(100vh - ${FOOTER_HEIGHT})`,
        }}
      >
        <div className="p-5 border-b text-center">
          <h2 className="text-xl font-semibold">My Account</h2>
        </div>

        <div className="flex flex-col justify-between h-full p-4">
          <div className="space-y-3">
            <NavLink to="/profile" className={navClass}>
              <FaUser /> Profile
            </NavLink>

            <NavLink to="/edit/profile" className={navClass}>
              <FaCog /> Edit Profile
            </NavLink>

            <NavLink to="/manage/profile" className={navClass}>
              <FaCog /> Manage Profile
            </NavLink>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg bg-red-200 hover:bg-red-500 hover:text-white transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MOBILE SLIDE SIDEBAR ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="w-72 bg-white h-full p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold">My Account</h2>
              <button onClick={() => setIsOpen(false)}>
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <NavLink
                to="/profile"
                className={navClass}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </NavLink>

              <NavLink
                to="/edit/profile"
                className={navClass}
                onClick={() => setIsOpen(false)}
              >
                Edit Profile
              </NavLink>

              <NavLink
                to="/manage/profile"
                className={navClass}
                onClick={() => setIsOpen(false)}
              >
                Manage Profile
              </NavLink>
            </div>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-red-200"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSidebar;
