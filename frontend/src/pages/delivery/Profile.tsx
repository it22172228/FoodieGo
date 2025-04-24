import React, { useState } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
// import Footer from "../../components/delivery/Footer";

function Profile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    city: "Colombo",
    joined: "Jan 2024",
    profilePicture: "https://via.placeholder.com/150",
  });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profilePicture: URL.createObjectURL(file) });
    }
  };

  return (
    <div>
      <div className="flex min-h-[85vh] bg-[#FAFAFA] dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 bg-[#FAFAFA] dark:bg-gray-900 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 border border-[#E0E0E0] dark:border-gray-700">
            {/* Profile Picture */}
            <div className="flex flex-col items-center text-center">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-[#FF6B00] object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="mt-4 p-2 text-sm text-[#FF6B00] bg-transparent border-2 border-[#FF6B00] rounded-md cursor-pointer dark:text-orange-400 dark:border-orange-400"
              />
              <h2 className="text-xl font-semibold text-[#2D2D2D] dark:text-white mt-4">
                {user.name}
              </h2>
              <p className="text-sm text-[#888] dark:text-gray-400">Delivery Partner</p>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-[#2D2D2D] dark:text-white mb-2">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#2D2D2D] dark:text-gray-200">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong>City:</strong> {user.city}
                </p>
                <p>
                  <strong>Joined:</strong> {user.joined}
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="ml-20 mt-10 block bg-[#FF6B00] text-white px-6 py-2 rounded-lg hover:bg-[#e65a00] transition dark:bg-orange-500 dark:hover:bg-orange-600">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Profile;
