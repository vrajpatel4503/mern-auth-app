import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile.jsx";
import MangeProfile from "../components/Profile/MangeProfile.jsx";
import UpdatePassword from "../components/Profile/UpdatePassword.jsx";
import UpdateAvatar from "../components/Profile/UpdateAvatar.jsx";
import EditProfile from "../components/Profile/EditProfile.jsx";

const AppRoutes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Routes  */}
        <Route element={<Layout />}>
          <Route path="/edit/profile" element={<EditProfile />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/manage/profile" element={<MangeProfile />} />
        </Route>

        {/* Protected Routes  */}
        <Route element={<Layout />}>
          <Route path="/update/password" element={<UpdatePassword />} />
        </Route>

        {/* Protected Routes for  */}
        <Route element={<Layout />}>
          <Route path="/update/avatar" element={<UpdateAvatar />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
