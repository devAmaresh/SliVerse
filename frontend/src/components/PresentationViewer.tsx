import React, { useState, useRef, useCallback, useEffect } from "react";
import PPTSlideRenderer from "./PPTSlideRenderer";
import NavigationSidebar from "./NavigationSidebar";
import DashNavbar from "./DashNavbar";
import useSlidesStore from "../store/useSlidesStore";

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

  // Get slides from store
  const { slides, setSlides, setTitle } = useSlidesStore();

  // Initialize store with props data if store is empty
  useEffect(() => {
    if (slides.length === 0 && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
    if (title) {
      setTitle(title);
    }
  }, [initialSlides, title, slides.length, setSlides, setTitle]);

  // Simple scroll to slide function
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
    if (selectedSlide >= slides.length && slides.length > 0) {
      setSelectedSlide(slides.length - 1);
    }
  }, [slides.length, selectedSlide]);

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
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => (slideRefs.current[index] = el)}
                className="flex items-center justify-center"
                style={{
                  scrollSnapAlign: "start",
                }}
              >
                <PPTSlideRenderer
                  slideIndex={index}
                  isActive={selectedSlide === index}
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
