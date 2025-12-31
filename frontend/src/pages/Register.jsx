import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/ToastifyUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    avatar: null,
  });

  const fileInputRef = useRef(null);

  // ---------- handle change -----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------- handle avatar change -----------
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

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
    setLoading(true);

    try {
      const formDataToSubmit = new FormData();

      const formField = ["fullName", "email", "password", "phoneNumber"];

      formField.forEach((field) => {
        formDataToSubmit.append(field, formData[field]);
      });

      if (formData.avatar) {
        formDataToSubmit.append("avatar", formData.avatar);
      }

      const res = await axios.post(
        `${API_URL}/api/v1/user/register`,
        formDataToSubmit
      );

      showSuccessToast(res.data.message || "Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      // try part end
    } catch (error) {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        avatar: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showErrorToast(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div
          className={`max-w-lg mx-auto p-6 w-96 sm:p-8 rounded-xl shadow-md border bg-white border-gray-200 ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar */}
            <div>
              {/* Hidden file input */}
              <input
                type="file"
                name="avatar"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Circular avatar */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-28 h-28 mx-auto rounded-full border-2 border-dashed border-gray-300 cursor-pointer flex items-center justify-center hover:border-blue-500 transition"
              >
                {formData.avatar ? (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-400 text-center">
                    Click to
                    <br />
                    upload
                  </span>
                )}
              </div>
              <p className="text-sm mb-2 mt-2 text-gray-600">
                Note: Please upload an image within 200 KB
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1 text-black">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-medium mb-1 text-black">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Register
            </button>

            <p className="text-center text-sm text-black">
              Already have an account?
              <Link to="/login" className="text-blue-500 hover:underline ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
