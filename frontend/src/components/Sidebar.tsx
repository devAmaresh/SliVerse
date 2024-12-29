// src/components/Sidebar.tsx
import { Button, Modal, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./sidebar.css";
import { PlusOutlined } from "@ant-design/icons";
import AddSlide from "./AddSlide";
// import useTheme from "../store/theme";
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
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll the current slide into view whenever it changes
  useEffect(() => {
    const currentSlideElement = slideRefs.current[currentSlideIndex];
    if (currentSlideElement) {
      currentSlideElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSlideIndex]);

  // Key controls for navigating slides
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        const previousIndex = Math.max(currentSlideIndex - 1, 0);
        handleSlideChange(previousIndex);
      } else if (event.key === "ArrowDown") {
        const nextIndex = Math.min(currentSlideIndex + 1, slides.length - 1);
        handleSlideChange(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlideIndex, slides.length, handleSlideChange]);
  // const theme = useTheme((state: any) => state.theme);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <aside
      className={`w-1/4 bg-gray-100 dark:bg-stone-800 flex flex-col mt-[70px] mb-3 rounded-br-lg rounded-tr-lg`}
    >
      {/* Scrollable Slide List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-sidebar ">
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className={`p-4 rounded-lg shadow cursor-pointer flex items-center ${
              index === currentSlideIndex
                ? "bg-zinc-200 dark:bg-neutral-900 border border-indigo-500"
                : "bg-white dark:bg-stone-700"
            }`}
            onClick={() => handleSlideChange(index)}
          >
            {/* Slide Number with fixed width */}
            <div className="mr-2">
              <Tag color="lime" className="text-center">
                {index + 1}
              </Tag>
            </div>

            {/* Slide Content */}
            <div className="flex-1 truncate text-ellipsis">
              <div className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                {slide?.content?.heading || `Slide ${index + 1}`}
              </div>
              <div
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {slide?.content?.key_message || "No content available"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Slide Button */}
      <div className="p-4 pt-2 text-center">
        <Tooltip title="Add Slide" placement="right">
          <Button
            type="dashed"
            onClick={showModal}
            className=""
            icon={<PlusOutlined />}
          />
        </Tooltip>
        <Modal
          title="Add Slide"
          open={open}
          onOk={hideModal}
          onCancel={hideModal}
          footer={false}
          width={1000}
          destroyOnClose
        >
          <AddSlide />
        </Modal>
      </div>
    </aside>
  );
};

export default Sidebar;
