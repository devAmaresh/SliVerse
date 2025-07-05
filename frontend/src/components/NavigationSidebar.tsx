import React, { useState, useEffect, useRef, memo } from "react";
import AddSlide from "./AddSlide";
import { Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import useSlideStore from "../store/useSlidesStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useParams } from "react-router-dom";

interface SlideData {
  id: string;
  slide_number: number;
  content: any;
  layout_type: string;
  dominant_color: string;
  img_url?: string;
  xml_content: string;
  section_layout: string;
}

interface NavigationSidebarProps {
  slides: SlideData[];
  selectedSlide: number;
  onSlideClick: (index: number) => void;
  title: string;
}

// Memoized slide item to prevent unnecessary re-renders
const SlideItem = memo(
  ({
    slide,
    index,
    isSelected,
    onClick,
    onDelete,
    provided,
    isDragging,
  }: {
    slide: SlideData;
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
    provided: any;
    isDragging: boolean;
  }) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        group relative rounded-xl transition-all duration-200 overflow-hidden cursor-pointer
        ${
          isSelected
            ? "bg-gray-800 ring-2 ring-blue-500 shadow-lg"
            : "bg-gray-900 hover:bg-gray-800"
        }
        ${isDragging ? "shadow-2xl scale-105 rotate-2 z-50" : ""}
      `}
      onClick={onClick}
    >
      {/* Delete Button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-600/80 hover:bg-red-600 backdrop-blur-sm border border-red-500/30 text-white p-1 rounded transition-colors duration-200"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Slide Preview */}
      <div className="aspect-[16/9] relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg m-2">
        {slide.img_url ? (
          <img
            src={slide.img_url}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${slide.dominant_color}20, ${slide.dominant_color}10)`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                backgroundColor: slide.dominant_color,
              }}
            >
              {index + 1}
            </div>
          </div>
        )}

        {/* Slide Number Overlay */}
        <div className="absolute bottom-2 left-2">
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200
              ${
                isSelected
                  ? "bg-blue-500 text-white scale-110"
                  : "bg-black/50 text-white"
              }
            `}
          >
            {index + 1}
          </div>
        </div>

        {/* Layout Type Badge */}
        <div className="absolute top-2 right-8">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
            {slide.layout_type}
          </div>
        </div>
      </div>

      {/* Slide Info */}
      <div className="px-3 pb-3">
        <h3
          className={`
            text-sm font-medium truncate text-left transition-colors duration-200
            ${isSelected ? "text-white" : "text-gray-300"}
          `}
        >
          {slide.content.heading ||
            slide.content.title ||
            `Slide ${index + 1}`}
        </h3>
        <p
          className={`
            text-xs mt-1 truncate text-left transition-colors duration-200
            ${isSelected ? "text-gray-300" : "text-gray-400"}
          `}
        >
          {slide.content.key_message || "No content available"}
        </p>
      </div>

      {/* Active Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
      )}
    </div>
  )
);

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  slides,
  selectedSlide,
  onSlideClick,
}) => {
  const { id: projectId } = useParams<{ id: string }>();
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const { slides: allSlides, setSlides } = useSlideStore();
  const token = Cookies.get("token");

  // Refs for slide elements in sidebar
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll the current slide into view whenever it changes
  useEffect(() => {
    const currentSlideElement = slideRefs.current[selectedSlide];
    if (currentSlideElement) {
      currentSlideElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedSlide]);



  const handleDeleteSlide = async (slideId: string) => {
    if (!slideId) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${backend_url}/api/slide-edit/${slideId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the slides store by removing the deleted slide
      const updatedSlides = allSlides.filter((s) => s.id !== slideId);
      setSlides(updatedSlides);

      setShowDeleteConfirm(false);
      setSlideToDelete(null);
    } catch (error) {
      console.error("Error deleting slide:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle reorder logic with improved error handling
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    // If the item has been moved to a different position
    if (destination.index !== source.index) {
      // Create a copy of the current slides in case of a failure
      const originalSlides = [...slides];
      const reorderedSlides = Array.from(slides);
      const [removed] = reorderedSlides.splice(source.index, 1);
      reorderedSlides.splice(destination.index, 0, removed);

      // Update the slides state locally for better UX
      setSlides(reorderedSlides);
      onSlideClick(destination.index);

      try {
        setIsReordering(true);
        // Make an API call to reorder the slides on the server
        const response = await axios.post(
          `${backend_url}/api/project/${projectId}/reorder-slides/`,
          { new_order: reorderedSlides.map((slide) => slide.id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          console.log("Slides reordered successfully");
        }
      } catch (error) {
        // If the API call fails, revert the slides to the original order
        console.error(
          "Failed to reorder slides. Reverting to the original order.",
          error
        );
        setSlides(originalSlides);
        onSlideClick(source.index); // Revert the current slide index back
      } finally {
        setIsReordering(false);
      }
    }
  };

  const confirmDelete = (slideId: string) => {
    setSlideToDelete(slideId);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="w-[280px] bg-[#1A1A1A] border-r border-gray-800 flex flex-col h-[90%] mt-16">
      <div className="px-6 py-8 border-b border-gray-800">
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddSlide(!showAddSlide)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{showAddSlide ? "Cancel" : "Add Slide"}</span>
          </button>
        </div>

        {/* Reordering Indicator */}
        {isReordering && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-blue-400 text-xs">
            <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span>Saving order...</span>
          </div>
        )}
      </div>

      {/* Add Slide Modal */}
      {showAddSlide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">
                    Add New Slide
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Create AI-generated content for your presentation
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddSlide(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <AddSlide />
            </div>

            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400 flex items-center space-x-2">
                  <span>💡</span>
                  <span>
                    Tip: Use descriptive titles for better AI-generated content
                  </span>
                </div>
                <button
                  onClick={() => setShowAddSlide(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && slideToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Delete Slide</h3>
                <p className="text-gray-400 text-sm">
                  Slide {slides.findIndex((s) => s.id === slideToDelete) + 1}
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete this slide? This action cannot be
              undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSlideToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSlide(slideToDelete)}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List with Drag and Drop */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-4 space-y-2 transition-colors duration-200 ${
                  snapshot.isDraggingOver ? "bg-blue-600/5" : ""
                }`}
              >
                {slides.map((slide, index) => (
                  <Draggable
                    key={slide.id.toString()}
                    draggableId={slide.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          slideRefs.current[index] = el;
                          provided.innerRef(el);
                        }}
                      >
                        <SlideItem
                          slide={slide}
                          index={index}
                          isSelected={selectedSlide === index}
                          onClick={() => onSlideClick(index)}
                          onDelete={() => confirmDelete(slide.id.toString())}
                          provided={provided}
                          isDragging={snapshot.isDragging}
                        />
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>
            Slide {selectedSlide + 1} of {slides.length}
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
