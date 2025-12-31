import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/ToastifyUtils";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice.js";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const [loadingLastLogin, setLoadingLastLogin] = useState(false);
  const [hasCheckedLastLogin, setHasCheckedLastLogin] = useState(false);

  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(
        authActions.login({
          id: res.data.user._id,
        })
      );

      showSuccessToast(res.data.message || "Login successful");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);

      // try part end
    } catch (error) {
      setFromData({
        email: "",
        password: "",
      });

      showErrorToast(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formData.email) {
      setLastLogin(null);
      setHasCheckedLastLogin(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingLastLogin(true);
        setHasCheckedLastLogin(false);
        const res = await axios.post(`${API_URL}/api/v1/user/last/login`, {
          email: formData.email,
        });

        setLastLogin(res.data.lastLogin);
      } catch {
        setLastLogin(null);
      } finally {
        setLoadingLastLogin(false);
        setHasCheckedLastLogin(true);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.email]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div
          className={`w-md mx-auto p-6 sm:p-8 rounded-xl shadow-md border bg-white border-gray-200 ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-black">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-medium mb-1 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1 text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none"
                required
              />
            </div>

            <div className="text-sm text-gray-500 mb-3">
              {loadingLastLogin && (
                <p className="text-sm text-gray-400">Checking last login...</p>
              )}

              {!loadingLastLogin && lastLogin && (
                <div className="mb-3 rounded-md bg-gray-100 p-3 text-sm">
                  Welcome back
                  <div className="text-gray-900">
                    Last login: {new Date(lastLogin).toLocaleString()}
                  </div>
                </div>
              )}

              {hasCheckedLastLogin &&
                !loadingLastLogin &&
                lastLogin === null && (
                  <div className="mb-3 rounded-md bg-gray-100 p-3 text-sm">
                    <p className="text-sm text-gray-700">
                      This is your first login
                    </p>
                  </div>
                )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>

            <p className="text-md text-black text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
