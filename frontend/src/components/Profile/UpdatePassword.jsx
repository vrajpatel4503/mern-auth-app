import ProfileSidebar from "./ProfileSidebar";

const UpdatePassword = () => {
  return (
    <>
      <div className=" flex flex-row">
        <ProfileSidebar />
        <div className="w-full p-3">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Update Email</h2>

            <div className="flex gap-3">
              <input
                type="email"
                name="email"
                // value={email}
                // onChange={handleChange}
                placeholder="Enter new email"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
              />
              <button
                className="px-5 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
                // onClick={handleEmailSubmit}
              >
                Update Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
