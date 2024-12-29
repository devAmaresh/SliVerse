import {
  Button,
  Input,
  message,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
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
import handleDownloadPPT from "../utils/handleDownloadPPT";
const dash_nav = ({ handleThemeChange }: { handleThemeChange: any }) => {
  const { Paragraph, Text } = Typography;
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const id = useParams().id;
  const showModal = () => {
    setOpen(true);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { is_public, setPublic } = useSlidesStore();
  const token = Cookies.get("token");
  const [isPptLoading, setPptLoading] = useState(false);
  const { slides, title } = useSlidesStore();
  const handleDownload = async () => {
    setPptLoading(true);
    try {
      await handleDownloadPPT({ slides, title });
    } catch (error) {
      messageApi.error("Error downloading PPT");
      console.log(error);
    } finally {
      setPptLoading(false);
    }
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const res = await axios.patch(
        `${backend_url}/api/projects/${id}/`,
        {
          is_public: !is_public,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        {
          res.data.is_public
            ? messageApi.success("Project is now public!")
            : messageApi.success("Project is now private!");
        }
        setPublic(res.data.is_public);
        // setOpen(false);
      } else {
        messageApi.error("Failed ! Try again later.");
      }
    } catch (e) {
      console.log(e);
      messageApi.error("Failed ! Try again later.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const shareLink = `${window.location.origin}/present/${id}`;
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
          <div className="text-sm tracking-wide dark:text-zinc-300 max-w-44 lg:max-w-80 text-ellipsis truncate">
            <Tooltip title={title} trigger={["click"]}>
              {title}
            </Tooltip>
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
            okButtonProps={{ disabled: is_public }}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={null}
          >
            <div>
              {!is_public && (
                <>
                  <Paragraph>
                    Your presentation is currently private. This means it can
                    only be viewed by you. If you want to share it with others,
                    click the button below to make it public.
                  </Paragraph>
                </>
              )}
            </div>
            <div>
              {is_public && (
                <>
                  <Paragraph>
                    Your presentation is public! Share the link below with
                    anyone to allow them to view your presentation.
                  </Paragraph>
                  <div className="text-center">
                    <Text
                      copyable={{
                        text: `${shareLink}`,
                      }}
                    >
                      <Input className="p-2 w-1/2" value={shareLink} readOnly />
                    </Text>
                  </div>
                </>
              )}
            </div>
            <div className="text-center mt-4">
              <Button
                onClick={handleOk}
                danger={!is_public}
                loading={confirmLoading}
                disabled={confirmLoading}
              >
                {is_public ? "Make Private" : "Make Public"}
              </Button>
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
            onClick={handleDownload}
            icon={<DownloadOutlined />}
            disabled={isPptLoading}
            loading={isPptLoading}
          >
            PPT
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default dash_nav;
