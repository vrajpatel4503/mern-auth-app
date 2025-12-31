import React from "react";
import ProfileSidebar from "../components/Profile/ProfileSidebar.jsx";
import ProfileCard from "../components/Profile/ProfileCard.jsx";

const Profile = () => {
  return (
    <>
      <div className=" flex flex-row">
        <ProfileSidebar />
        <div className="w-full p-3">
          <ProfileCard />
        </div>
      </div>
    </>
  );
};

export default Profile;
