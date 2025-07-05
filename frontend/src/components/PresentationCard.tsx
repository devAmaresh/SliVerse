import React from "react";
import { MoreVertical, Clock, Star } from "lucide-react";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { useNavigate } from "react-router-dom";
import { Popover, message, Tag } from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  LockFilled,
  UnlockFilled,

} from "@ant-design/icons";
import useProjectDelete from "../hooks/useProjectDelete";
import useProjectUpdate from "../hooks/useProjectUpdate";
import "./card.css";

interface PresentationCardProps {
  project_id: string;
  title: string;
  thumbnail: string;
  dateTime: string;
  is_public: boolean;
  is_favorite: boolean;
  xml_content?: string;
}

const PresentationCard: React.FC<PresentationCardProps> = ({
  project_id,
  title,
  thumbnail,
  dateTime,
  is_public,
  is_favorite,
}) => {
  const lastUpdated = formatTimeAgo(dateTime);
  const navigate = useNavigate();
  const {
    deleteProject,
    loading: deleteLoading,
    error,
    success,
  } = useProjectDelete();
  const { toggleFavorite, loading: favoriteLoading } = useProjectUpdate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    await deleteProject(project_id);
    if (success) {
      messageApi.success("Project deleted successfully.");
    } else if (error) {
      messageApi.error(error);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking favorite
    await toggleFavorite(project_id, is_favorite);
  };

  const content = (
    <div className="">
      <div
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600 hover:opacity-70 hover:cursor-pointer flex items-center px-1 rounded"
      >
        {deleteLoading ? (
          <LoadingOutlined className="mr-2" />
        ) : (
          <DeleteOutlined className="mr-2" />
        )}
        <div className="">Delete</div>
      </div>
    </div>
  );

  return (
    <>
      {contextHolder}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-lg hover:shadow-md transition-shadow duration-200">
        <div
          className="relative group hover:cursor-pointer"
          onClick={() => {
            navigate(`/dash/${project_id}`);
          }}
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-28 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-t-xl" />

          {/* Favorite Star - Top Left */}
          {is_favorite && (
            <div className="absolute top-2 left-2">
              <div className="bg-yellow-500 text-white p-1 rounded-full shadow-md">
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>
          )}
        </div>

        <div className="py-4 px-3">
          <div className="flex items-start justify-between">
            <div className="font-medium text-zinc-800 dark:text-zinc-100 two-line-truncate flex-1">
              {title}
            </div>
            {/* Favorite toggle button in card header */}
            <button
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className="ml-2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
            >
              {favoriteLoading ? (
                <LoadingOutlined className="w-4 h-4 text-zinc-400" />
              ) : is_favorite ? (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              ) : (
                <Star className="w-4 h-4 text-zinc-400 hover:text-yellow-500" />
              )}
            </button>
          </div>

          <div className="py-2 flex gap-2">
            {is_public ? (
              <Tag color="blue" icon={<UnlockFilled />}>
                Public
              </Tag>
            ) : (
              <Tag color="purple" icon={<LockFilled />}>
                Private
              </Tag>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center w-[75%]">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-xs truncate">
                Last updated {lastUpdated}
              </span>
            </div>

            <Popover
              content={content}
              trigger={["click"]}
              placement="topRight"
              overlayClassName="presentation-card-popover"
            >
              <button
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
              </button>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default PresentationCard;
