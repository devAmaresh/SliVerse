import { Button, message, Modal, Select, Typography } from "antd";
import {
  DownloadOutlined,
  LinkOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { themes } from "../utils/theme";
import { ChevronRight, Home } from "lucide-react";
import useSlidesStore from "../store/useSlidesStore";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeToggle } from "../pages/landing/components/ThemeToggle";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
const dash_nav = ({
  handleThemeChange,
  download_ppt,
  loading_ppt,
}: {
  handleThemeChange: any;
  download_ppt: any;
  loading_ppt: boolean;
}) => {
  const { Paragraph, Text } = Typography;
  const title = useSlidesStore((state: any) => state.title);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const id = useParams().id;
  const showModal = () => {
    setOpen(true);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const token = Cookies.get("token");

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const res = await axios.patch(
        `${backend_url}/api/projects/${id}/`,
        {
          is_public: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        messageApi.success("Project is now public!");
        setIsPublic(true);
        // setOpen(false);
      } else {
        messageApi.error("Failed to make project public!");
      }
    } catch (e) {
      console.log(e);
      messageApi.error("Failed to make project public!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <nav className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 shadow-md fixed top-0 left-0 w-full z-50">
      {contextHolder}
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Amaverse.ai
        </div> */}
        <div className="flex justify-center items-center">
          <Home
            size={20}
            onClick={() => {
              navigate("/dashboard");
            }}
            className="hover:cursor-pointer hover:opacity-80 mr-4"
          />

          <ChevronRight size={24} color="gray" className="mr-4" />
          <div className="text-sm tracking-wide dark:text-zinc-300">
            {title}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <label htmlFor="theme" className="font-medium">
            Theme:
          </label>
          <Select
            defaultValue="classic"
            style={{ width: 120 }}
            onChange={handleThemeChange}
            options={Object.keys(themes).map((key) => ({
              value: key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
            }))}
          />
          <Button icon={<LinkOutlined />} onClick={showModal}>
            Share
          </Button>
          <Modal
            title="Share PPT Link"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div>
              This will set the project to public and generate a link for the
              PPT.
            </div>
            <div>
              {isPublic && (
                <>
                  <Text
                    copyable={{
                      text: `${window.location.origin}/present/${id}`,
                    }}
                  >
                    <input
                      value={`${window.location.origin}/present/${id}`}
                      readOnly
                      className="dark:bg-black dark:text-white w-44 rounded-md border border-blue-500 focus:outline-none p-2"
                    />
                  </Text>
                </>
              )}
            </div>
          </Modal>
          <Button
            onClick={() => {
              window.open(`/present/${id}`, "_blank");
            }}
            icon={<PlayCircleOutlined />}
          >
            Present
          </Button>
          <Button
            onClick={download_ppt}
            icon={<DownloadOutlined />}
            disabled={loading_ppt}
            loading={loading_ppt}
          >
            PPT
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default dash_nav;
