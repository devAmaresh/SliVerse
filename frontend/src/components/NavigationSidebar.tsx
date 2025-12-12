import React, { useState, memo, useCallback, useRef, useEffect } from "react";
import AddSlide from "./AddSlide";
import { Trash2, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import useSlideStore from "../store/useSlidesStore";
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
  onSlideClick: (index: number) => void;
  title: string;
}

interface SlideItemProps {
  slide: SlideData;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

// Optimized SlideItem with lazy image loading and strict memo
const SlideItem = memo(
  ({
    slide,
    index,
    isFirst,
    isLast,
    isSelected,
    onClick,
    onDelete,
    onMoveUp,
    onMoveDown,
  }: SlideItemProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    // Lazy load images using IntersectionObserver
    useEffect(() => {
      if (!slide.img_url || !itemRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "100px" }
      );

      observer.observe(itemRef.current);
      return () => observer.disconnect();
    }, [slide.img_url]);

    // Preload image when visible
    useEffect(() => {
      if (imageVisible && slide.img_url && !imageLoaded) {
        const img = new Image();
        img.src = slide.img_url;
        img.onload = () => setImageLoaded(true);
      }
    }, [imageVisible, slide.img_url, imageLoaded]);

    const slideTitle = slide.content.heading || slide.content.title || "Untitled Slide";

    return (
      <div
        ref={itemRef}
        className={`group relative h-40 rounded-xl transition-all duration-200 overflow-hidden cursor-pointer border ${
          isSelected 
            ? "bg-zinc-800 border-blue-500 ring-2 ring-blue-500/50" 
            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850"
        }`}
        onClick={onClick}
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      >
        {/* HOVER CONTROLS (Right Side) */}
        <div className="absolute right-2 top-2 bottom-2 w-8 flex flex-col justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 bg-red-600/90 text-white rounded-md hover:bg-red-500 shadow-lg backdrop-blur-sm"
            title="Delete Slide"
          >
            <Trash2 size={12} />
          </button>

          {/* Reorder Buttons */}
          <div className="flex flex-col space-y-1">
            {!isFirst && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                className="p-1.5 bg-zinc-700/90 text-zinc-200 rounded-md hover:bg-blue-600 hover:text-white shadow-lg backdrop-blur-sm transition-colors"
                title="Move Up"
              >
                <ChevronUp size={14} />
              </button>
            )}
            
            {!isLast && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                className="p-1.5 bg-zinc-700/90 text-zinc-200 rounded-md hover:bg-blue-600 hover:text-white shadow-lg backdrop-blur-sm transition-colors"
                title="Move Down"
              >
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Slide Preview Content */}
        <div className="h-28 relative bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg m-2 overflow-hidden border border-white/5">
          {slide.img_url && imageVisible ? (
            imageLoaded ? (
              <img
                src={slide.img_url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 animate-pulse" />
            )
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${slide.dominant_color}20, ${slide.dominant_color}10)`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: slide.dominant_color }}
              >
                {index + 1}
              </div>
            </div>
          )}

          {/* Slide Number Badge */}
          <div className="absolute bottom-2 left-2">
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
              {index + 1}
            </div>
          </div>

          {/* Layout Badge */}
          <div className="absolute bottom-2 right-2">
            <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-zinc-300 backdrop-blur-sm capitalize">
              {slide.layout_type}
            </div>
          </div>
        </div>

        {/* Slide Title */}
        <div className="px-3 pb-2">
          <h3 className={`text-xs font-medium truncate transition-colors ${
            isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
          }`}>
            {slideTitle}
          </h3>
        </div>
      </div>
    );
  },
  // Strict comparison to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isFirst === nextProps.isFirst &&
      prevProps.isLast === nextProps.isLast &&
      prevProps.index === nextProps.index &&
      prevProps.slide.id === nextProps.slide.id &&
      prevProps.slide.img_url === nextProps.slide.img_url &&
      prevProps.slide.dominant_color === nextProps.slide.dominant_color &&
      prevProps.slide.layout_type === nextProps.slide.layout_type
    );
  }
);

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  onSlideClick,
}) => {
  const { id: projectId } = useParams<{ id: string }>();
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);

  const { slides, setSlides } = useSlideStore();
  const token = Cookies.get("token");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Debounced reorder to prevent API spam
  const reorderTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMoveSlide = useCallback(
    async (index: number, direction: "up" | "down") => {
      if (isReordering) return;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= slides.length) return;

      // Optimistic update
      const newSlides = [...slides];
      [newSlides[index], newSlides[newIndex]] = [
        newSlides[newIndex],
        newSlides[index],
      ];

      setSlides(newSlides);
      setSelectedSlide(newIndex);
      onSlideClick(newIndex);

      // Debounce backend sync
      clearTimeout(reorderTimeoutRef.current);
      reorderTimeoutRef.current = setTimeout(async () => {
        try {
          setIsReordering(true);
          await axios.post(
            `${backend_url}/api/project/${projectId}/reorder-slides/`,
            { new_order: newSlides.map((slide) => slide.id) },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Failed to sync order:", error);
        } finally {
          setIsReordering(false);
        }
      }, 500); // 500ms debounce
    },
    [isReordering, slides, projectId, token, setSlides, onSlideClick]
  );

  const handleDeleteSlide = useCallback(
    async (slideId: string) => {
      if (!slideId) return;

      setIsDeleting(true);
      try {
        const res = await axios.delete(
          `${backend_url}/api/slide-edit/${slideId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.status === 204) {
          const updatedSlides = slides.filter((s) => s.id !== slideId);
          setSlides(updatedSlides);
          setShowDeleteConfirm(false);
          setSlideToDelete(null);
          
          // Adjust selection
          const deletedIndex = slides.findIndex(s => s.id === slideId);
          if (deletedIndex <= selectedSlide && selectedSlide > 0) {
            setSelectedSlide(selectedSlide - 1);
          }
        }
      } catch (error) {
        console.error("Error deleting slide:", error);
      } finally {
        setIsDeleting(false);
      }
    },
    [ token, slides, selectedSlide, setSlides]
  );

  const confirmDelete = useCallback((slideId: string) => {
    setSlideToDelete(slideId);
    setShowDeleteConfirm(true);
  }, []);

  const handleSlideClick = useCallback((index: number) => {
    setSelectedSlide(index);
    onSlideClick(index);
  }, [onSlideClick]);

  return (
    <div className="w-[280px] bg-[#1A1A1A] border-r border-zinc-800 flex flex-col h-[90%] mt-16">
      {/* Header */}
      <div className="px-6 py-6 border-b border-zinc-800 bg-[#1A1A1A]">
        <button
          onClick={() => setShowAddSlide(!showAddSlide)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 font-medium text-sm shadow-lg shadow-blue-900/20"
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

        {isReordering && (
          <div className="mt-2 text-center text-[10px] text-zinc-500 animate-pulse">
            Syncing order...
          </div>
        )}
      </div>

      {/* Slide List with GPU-accelerated scrolling */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        }}
      >
        {slides.map((slide, index) => (
          <SlideItem
            key={slide.id}
            slide={slide}
            index={index}
            isFirst={index === 0}
            isLast={index === slides.length - 1}
            isSelected={selectedSlide === index}
            onClick={() => handleSlideClick(index)}
            onDelete={() => confirmDelete(slide.id)}
            onMoveUp={() => handleMoveSlide(index, "up")}
            onMoveDown={() => handleMoveSlide(index, "down")}
          />
        ))}

        {/* Empty State */}
        {slides.length === 0 && (
          <div className="text-center py-10 text-zinc-500 text-sm">
            No slides yet. <br /> Click "Add Slide" to begin.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 bg-[#1A1A1A]">
        <div className="flex items-center justify-between text-zinc-500 text-xs">
          <span>{slides.length} Slides</span>
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>Saved</span>
          </div>
        </div>
      </div>

      {/* Add Slide Modal */}
      {showAddSlide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#1A1A1A]">
              <h2 className="text-white font-semibold text-lg">
                Add New Slide
              </h2>
              <button
                onClick={() => setShowAddSlide(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-1 bg-black">
              <AddSlide />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && slideToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-6 max-w-xs w-full mx-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Delete Slide?
            </h3>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSlideToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSlide(slideToDelete)}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationSidebar;
