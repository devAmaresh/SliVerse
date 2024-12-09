// PresentationCard.tsx
import React from "react";
import { MoreVertical, Clock } from "lucide-react";
import { formatTimeAgo } from "../utils/formatTimeAgo"; // Import the utility function

interface PresentationCardProps {
  title: string;
  thumbnail: string;
  dateTime: string;
}

const PresentationCard: React.FC<PresentationCardProps> = ({
  title,
  thumbnail,
  dateTime,
}) => {
  const lastUpdated = formatTimeAgo(dateTime); // Use the utility function to calculate the time ago

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow-lg hover:shadow-md transition-shadow duration-200">
      <div className="relative group">
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
            <MoreVertical className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
          </button>
        </div>
        <div className="flex items-center mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Last updated {lastUpdated}</span>{" "}
          {/* Display the formatted time */}
        </div>
      </div>
    </div>
  );
};

export default PresentationCard;
