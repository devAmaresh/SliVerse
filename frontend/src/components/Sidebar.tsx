import { Button, Modal, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./sidebar.css";
import { PlusOutlined } from "@ant-design/icons";
import AddSlide from "./AddSlide";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";

interface SidebarProps {
  slides: any[];
  currentSlideIndex: number;
  handleSlideChange: (index: number) => void;
  handleReorderSlides: (newSlides: any[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  slides,
  currentSlideIndex,
  handleSlideChange,
  handleReorderSlides,
}) => {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { id } = useParams();
  const token = Cookies.get("token");

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

  // Use useCallback to prevent unnecessary re-renders of this function
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        const previousIndex = Math.max(currentSlideIndex - 1, 0);
        handleSlideChange(previousIndex);
      } else if (event.key === "ArrowDown") {
        const nextIndex = Math.min(currentSlideIndex + 1, slides.length - 1);
        handleSlideChange(nextIndex);
      }
    },
    [currentSlideIndex, slides.length, handleSlideChange]
  );

  // Attach event listener only once and clean up properly
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  // Handle reorder logic
  const handleDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!destination) return;

    // If the item has been moved to a different position
    if (destination.index !== source.index) {
      // Create a copy of the current slides in case of a failure
      const originalSlides = [...slides];
      const reorderedSlides = Array.from(slides);
      const [removed] = reorderedSlides.splice(source.index, 1);
      reorderedSlides.splice(destination.index, 0, removed);

      // Update the slides state locally
      handleSlideChange(destination.index);
      handleReorderSlides(reorderedSlides);

      try {
        // Make an API call to reorder the slides on the server
        const response = await axios.post(
          `${backend_url}/api/project/${id}/reorder-slides/`,
          { new_order: reorderedSlides.map((slide) => slide.id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          console.log("Slides reordered successfully");
        }
      } catch (error) {
        // If the API call fails, revert the slides to the original order
        console.error(
          "Failed to reorder slides. Reverting to the original order."
        );
        handleReorderSlides(originalSlides);
        handleSlideChange(source.index); // Revert the current slide index back
      }
    }
  };

  return (
    <aside
      className={`w-1/4 bg-gray-100 dark:bg-stone-800 flex flex-col mt-[70px] mb-3 rounded-br-lg rounded-tr-lg`}
    >
      {/* Scrollable Slide List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-sidebar"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {slides.map((slide, index) => (
                <Draggable
                  key={index}
                  draggableId={String(index)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={(el) => {
                        slideRefs.current[index] = el;
                        provided.innerRef(el);
                      }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
                          {slide?.content?.key_message ||
                            "No content available"}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
