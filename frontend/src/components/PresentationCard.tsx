import React from "react";
import { MoreVertical, Clock } from "lucide-react";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { useNavigate } from "react-router-dom";
import { Popover, message } from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import useProjectDelete from "../hooks/useProjectDelete"; // Import the custom hook

interface PresentationCardProps {
  project_id: string;
  title: string;
  thumbnail: string;
  dateTime: string;
}

const PresentationCard: React.FC<PresentationCardProps> = ({
  project_id,
  title,
  thumbnail,
  dateTime,
}) => {
  const lastUpdated = formatTimeAgo(dateTime);
  const navigate = useNavigate();
  const { deleteProject, loading, error, success } = useProjectDelete();
  const [messageApi, contextHolder] = message.useMessage();
  const handleDelete = async () => {
    await deleteProject(project_id);
    if (success) {
      messageApi.success("Project deleted successfully.");
    } else if (error) {
      messageApi.error(error);
    }
  };

  const content = (
    <div className="">
      <div
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600 hover:cursor-pointer flex items-center"
      >
        {loading ? (
          <>
            <LoadingOutlined />
          </>
        ) : (
          <DeleteOutlined />
        )}

        <div className="ml-2 tracking-wide">Delete </div>
      </div>
    </div>
  );

  return (
    <>
      {contextHolder}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow-lg hover:shadow-md transition-shadow duration-200">
        <div
          className="relative group hover:cursor-pointer"
          onClick={() => {
            navigate(`/dash/${project_id}`);
          }}
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-t-xl" />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 truncate">
              {title}
            </h3>
            <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full">
              <Popover
                content={content}
                trigger={["click"]}
                placement="topRight"
              >
                <MoreVertical className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
              </Popover>
            </button>
          </div>
          <div className="flex items-center mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>Last updated {lastUpdated}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PresentationCard;
