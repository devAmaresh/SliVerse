import { Badge, Button, Modal, Tooltip } from "antd";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  ThunderboltOutlined,
  DragOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import AddSlide from "./AddSlide";
import "./sidebar.css";

interface XMLSlide {
  id: string;
  slide_number: number;
  content: {
    heading: string;
    layout_type?: string;
    section_layout?: string;
  };
  xml_content?: string;
  layout_type?: string;
  section_layout?: string;
  img_url: string;
  dominant_color: string;
}

interface SidebarProps {
  slides: XMLSlide[];
  currentSlideIndex: number;
  handleSlideChange: (index: number) => void;
  handleReorderSlides: (newSlides: XMLSlide[]) => void;
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

  const reorderSlides = useCallback(
    async (newOrder: string[]) => {
      try {
        await axios.post(
          `${backend_url}/api/project/${id}/reorder-slides/`,
          { new_order: newOrder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error reordering slides:", error);
      }
    },
    [id, token]
  );

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleReorderSlides(items);

    const newOrder = items.map((slide) => slide.id);
    reorderSlides(newOrder);

    if (currentSlideIndex === result.source.index) {
      handleSlideChange(result.destination.index);
    } else if (
      currentSlideIndex > result.source.index &&
      currentSlideIndex <= result.destination.index
    ) {
      handleSlideChange(currentSlideIndex - 1);
    } else if (
      currentSlideIndex < result.source.index &&
      currentSlideIndex >= result.destination.index
    ) {
      handleSlideChange(currentSlideIndex + 1);
    }
  };

  const isXMLSlide = (slide: XMLSlide) => {
    return slide.xml_content && slide.layout_type;
  };

  const getLayoutLabel = (slide: XMLSlide) => {
    if (isXMLSlide(slide)) {
      return slide.layout_type?.toUpperCase() || "XML";
    }
    return "BASIC";
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-100 h-screen flex flex-col shadow-lg">
      {/* Elegant Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Slides
          </h2>
          <Badge
            count={slides.length}
            style={{
              backgroundColor: "#3b82f6",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
          />
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <ThunderboltOutlined className="mr-2" />
            AI-Enhanced
          </div>
        </div>
      </div>

      {/* Slides List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {slides.map((slide, index) => (
                  <Draggable
                    key={slide.id}
                    draggableId={slide.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          slideRefs.current[index] = el;
                        }}
                        {...provided.draggableProps}
                        className={`
                          relative group rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
                          ${
                            currentSlideIndex === index
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg scale-105"
                              : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }
                          ${snapshot.isDragging ? "shadow-2xl scale-110 rotate-2" : ""}
                        `}
                        onClick={() => handleSlideChange(index)}
                      >
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-gray-100"
                        >
                          <DragOutlined className="text-gray-400 text-sm" />
                        </div>

                        <div className="p-4">
                          {/* Slide Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`
                                  w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                                  ${currentSlideIndex === index ? "bg-blue-500" : "bg-gray-400"}
                                `}
                              >
                                {index + 1}
                              </div>
                              <ThunderboltOutlined
                                style={{
                                  color: isXMLSlide(slide) ? "#10b981" : "#d1d5db",
                                  fontSize: "16px",
                                }}
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              {currentSlideIndex === index && (
                                <PlayCircleOutlined className="text-blue-500 text-lg animate-pulse" />
                              )}
                              <span
                                className={`
                                  px-2 py-1 text-xs font-medium rounded-full
                                  ${
                                    isXMLSlide(slide)
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }
                                `}
                              >
                                {getLayoutLabel(slide)}
                              </span>
                            </div>
                          </div>

                          {/* Slide Preview */}
                          <div className="space-y-3">
                            <h3
                              className={`
                              font-semibold text-sm leading-tight line-clamp-2
                              ${
                                currentSlideIndex === index
                                  ? "text-blue-900"
                                  : "text-gray-800"
                              }
                            `}
                            >
                              {slide.content?.heading || `Slide ${index + 1}`}
                            </h3>

                            {/* Image Preview */}
                            {slide.img_url && (
                              <div className="relative overflow-hidden rounded-lg">
                                <img
                                  src={slide.img_url}
                                  alt={`Slide ${index + 1}`}
                                  className="w-full h-16 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div
                                  className="absolute inset-0 opacity-20 mix-blend-multiply"
                                  style={{ backgroundColor: slide.dominant_color }}
                                />
                              </div>
                            )}

                            {/* Content Preview */}
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">
                                {isXMLSlide(slide) ? (
                                  <div className="flex items-center space-x-1">
                                    <ThunderboltOutlined style={{ color: "#10b981" }} />
                                    <span>Enhanced Layout</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <span>Standard Format</span>
                                  </div>
                                )}
                              </div>

                              {currentSlideIndex === index && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Active Slide Indicator */}
                        {currentSlideIndex === index && (
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          Drag slides to reorder • {slides.length} total
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
