import React, { useState, useRef, useCallback, useEffect } from "react";
import PPTSlideRenderer from "./PPTSlideRenderer";
import NavigationSidebar from "./NavigationSidebar";
import DashNavbar from "./DashNavbar";
import useSlideStore from "../store/useSlidesStore";

interface SlideData {
  id: string;
  slide_number: number;
  content: any;
  xml_content: string;
  layout_type: string;
  section_layout: string;
  img_url?: string;
  dominant_color: string;
}

interface PresentationViewerProps {
  slides: SlideData[];
  title: string;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides: initialSlides,
  title,
}) => {
  const [selectedSlide, setSelectedSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get slides from store instead of props
  const { slides, setSlides } = useSlideStore();

  // Initialize store with props slides if store is empty
  useEffect(() => {
    if (slides.length === 0 && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
  }, [initialSlides, slides.length, setSlides]);

  // Use store slides, fallback to props if store is empty
  const currentSlides = slides.length > 0 ? slides : initialSlides;

  // Simple scroll to slide function - no tracking
  const scrollToSlide = useCallback((index: number) => {
    if (!slideRefs.current[index] || !containerRef.current) return;

    const slideElement = slideRefs.current[index];
    const container = containerRef.current;

    // Update selected slide for sidebar highlighting
    setSelectedSlide(index);

    // Calculate the target scroll position
    const slideOffsetTop = slideElement.offsetTop;
    const containerHeight = container.clientHeight;
    const slideHeight = slideElement.clientHeight;

    // Center the slide in the viewport
    const targetScrollTop =
      slideOffsetTop - (containerHeight - slideHeight) / 2;

    // Smooth scroll to the target position
    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  }, []);

  // Adjust selected slide if it's out of bounds after deletion
  useEffect(() => {
    if (selectedSlide >= currentSlides.length && currentSlides.length > 0) {
      setSelectedSlide(currentSlides.length - 1);
    }
  }, [currentSlides.length, selectedSlide]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-[#0A0A0A] flex overflow-hidden">
      {/* Modern Navbar */}
      <DashNavbar />

      {/* Sidebar Navigation */}
      <NavigationSidebar
        selectedSlide={selectedSlide}
        onSlideClick={scrollToSlide}
        title={title}
      />

      {/* Main Content Area */}
      <div className="flex-1 pt-16">
        {/* Slides Container */}
        <div
          ref={containerRef}
          className="h-full overflow-y-auto scroll-smooth"
          style={{
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="">
            {currentSlides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => (slideRefs.current[index] = el)}
                className="flex items-center justify-center"
                style={{
                  scrollSnapAlign: "start",
                }}
              >
                <PPTSlideRenderer
                  slide={slide}
                  isActive={true}
                  slideNumber={index + 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer;
