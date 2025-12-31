import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import ProfileSidebar from "../Profile/ProfileSidebar.jsx";

const SIDEBAR_WIDTH = "18rem"; // 72
const FOOTER_HEIGHT = "80px";

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Main Content */}
      <main
        className="
          pt-14 md:pt-6 ml-0 md:ml-72 min-h-screen px-4 "
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="
          fixed bottom-0 left-0 md:left-72 right-0 h-20 bg-white border-t"
      >
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
