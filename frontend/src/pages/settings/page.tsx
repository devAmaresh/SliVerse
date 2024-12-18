import { useEffect, useState } from "react";
import ThemeToggler from "../../components/ThemeToggler";
import axios from "axios";
import { backend_url } from "../../utils/backend";
import Cookies from "js-cookie";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-xl font-semibold flex items-center space-x-2">
          <span>Settings</span>
        </div>
        <ThemeToggler />
      </div>

      {user ? (
        <div className="max-w-lg mx-auto bg-white dark:bg-zinc-800 shadow-lg rounded-xl overflow-hidden">
          {/* Profile Section */}
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-400 dark:from-blue-700 dark:to-purple-600 text-white p-6">
            <img
              src={user.profile.profile_picture}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4"
            />
            <p className="text-sm font-medium">@{user.username}</p>
          </div>

          {/* Account Details */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400">
                Name
              </label>
              <div className="text-lg font-semibold">
                {user.first_name} {user.last_name}
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400">
                Email Address
              </label>
              <div className="text-lg font-semibold">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400">
                Account Created
              </label>
              <div className="text-lg font-semibold">
                {new Date(user.profile.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
