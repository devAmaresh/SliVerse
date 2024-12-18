import { useEffect, useState } from "react";
import ThemeToggler from "../../components/ThemeToggler";
import axios from "axios";
import { backend_url } from "../../utils/backend";
import Cookies from "js-cookie";
import { Button, Divider, message, Modal, notification, Skeleton } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`${backend_url}/api/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFetching(false);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [api, notificationHolder] = notification.useNotification();
  const handleOk = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${backend_url}/api/user-profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 204) {
        api.success({
          message: "Account deleted successfully",
          description: "We're sorry to see you go!",
        });
        setTimeout(() => {
          Cookies.remove("token");
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log("Failed to delete account:", error);
      messageApi.error("Failed to delete account");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    messageApi.info("Account deletion cancelled 😊 ");
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white p-6">
      {/* Header Section */}
      {contextHolder}
      {notificationHolder}
      <div className="flex justify-between items-center mb-8">
        <ThemeToggler />
      </div>
      <div className="max-w-lg mx-auto bg-white dark:bg-zinc-800 shadow-lg rounded-xl overflow-hidden">
        {/* Profile Section */}
        <div className="flex flex-col items-center bg-gradient-to-r  from-indigo-400 to-blue-500 dark:from-indigo-700 dark:to-blue-600  text-white p-6">
          {fetching ? (
            <>
              <Skeleton.Avatar size={90} className="mb-4" active />
            </>
          ) : (
            <>
              <img
                src={user.profile.profile_picture}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4"
              />
            </>
          )}

          <div className="text-sm font-medium flex items-center">
            {fetching ? (
              <Skeleton.Input style={{ width: 100 }} active />
            ) : (
              <>
                <User className="mr-2" />
                {user.username}
              </>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400">
              Name
            </label>
            <div className="text-lg font-semibold">
              {fetching ? (
                <Skeleton.Input style={{ width: 100 }} active />
              ) : (
                <>
                  {user.first_name} {user.last_name}
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400">
              Email Address
            </label>
            <div className="text-lg font-semibold">
              {fetching ? (
                <Skeleton.Input style={{ width: 100 }} active />
              ) : (
                user.email
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400">
              Account Created
            </label>
            <div className="text-lg font-semibold">
              {fetching ? (
                <>
                  <Skeleton.Input style={{ width: 100 }} active />
                </>
              ) : (
                <>{new Date(user.profile.created_at).toLocaleDateString()}</>
              )}
            </div>
          </div>
        </div>
      </div>

      <Divider />
      <div>
        <div className="text-red-500">Danger Zone</div>
        <div className="py-4">
          <Button danger onClick={showModal} icon={<DeleteOutlined />}>
            Delete Account
          </Button>
          <Modal
            open={isModalOpen}
            title="Delete Account"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <div>
              <div>Are you sure you want to delete your account?</div>
              <div className="mt-4 flex justify-end space-x-4">
                <Button
                  danger
                  onClick={handleOk}
                  icon={<DeleteOutlined />}
                  disabled={loading}
                  loading={loading}
                  type="dashed"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Settings;
