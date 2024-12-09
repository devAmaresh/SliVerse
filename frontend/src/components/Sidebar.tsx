// src/components/Sidebar.tsx
import { Tag } from "antd";
import React from "react";

interface SidebarProps {
  slides: any[];
  currentSlideIndex: number;
  handleSlideChange: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  slides,
  currentSlideIndex,
  handleSlideChange,
}) => {
  return (
    <aside className="w-1/4 bg-gray-100 dark:bg-stone-800 border-r overflow-y-auto mt-16">
      <div className="p-4">
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow cursor-pointer flex items-center ${
                index === currentSlideIndex
                  ? "bg-zinc-200 dark:bg-neutral-900 border border-indigo-500"
                  : "bg-white dark:bg-stone-700"
              }`}
              onClick={() => handleSlideChange(index)}
            >
              {/* Slide Number with fixed width */}
              <div className="mr-2">
                <Tag color="lime" className=" text-center">
                  {index + 1}
                </Tag>
              </div>

              {/* Slide Content */}
              <div className="flex-1 truncate text-ellipsis">
                <div className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                  {slide.heading || `Slide ${index + 1}`}
                </div>
                <div
                  className="text-xs text-gray-600 dark:text-gray-400"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {slide.key_message || "No content available"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
