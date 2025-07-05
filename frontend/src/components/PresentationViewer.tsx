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
  const isScrollingProgrammatically = useRef(false);

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

  // Function to determine which slide is currently in viewport
  const getCurrentSlideInViewport = useCallback(() => {
    if (!containerRef.current) return 0;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestSlideIndex = 0;
    let closestDistance = Infinity;

    slideRefs.current.forEach((slideElement, index) => {
      if (slideElement) {
        const slideRect = slideElement.getBoundingClientRect();
        const slideCenter = slideRect.top + slideRect.height / 2;
        const distance = Math.abs(slideCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSlideIndex = index;
        }
      }
    });

    return closestSlideIndex;
  }, []);

  // Handle scroll to detect current slide
  const handleScroll = useCallback(() => {
    if (isScrollingProgrammatically.current) {
      return;
    }

    const currentSlideIndex = getCurrentSlideInViewport();
    if (currentSlideIndex !== selectedSlide) {
      setSelectedSlide(currentSlideIndex);
    }
  }, [getCurrentSlideInViewport, selectedSlide]);

  // Throttled scroll handler for better performance
  const throttledScrollHandler = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100); // Throttle to 100ms
    };
  }, [handleScroll]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = throttledScrollHandler();
    container.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      container.removeEventListener("scroll", scrollHandler);
    };
  }, [throttledScrollHandler]);

  // Simple scroll to slide function
  const scrollToSlide = useCallback(
    (index: number) => {
      if (!slideRefs.current[index] || !containerRef.current) return;

      const slideElement = slideRefs.current[index];
      const container = containerRef.current;

     
      isScrollingProgrammatically.current = true;

    
      setSelectedSlide(index);

      // Calculate the target scroll position
      const slideOffsetTop = slideElement.offsetTop;
      const containerHeight = container.clientHeight;
      const slideHeight = slideElement.clientHeight;

      // Center the slide in the viewport
      const targetScrollTop = slideOffsetTop - (containerHeight - slideHeight) / 2;

      // Smooth scroll to the target position
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });


      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 1000);
    },
    [slideRefs, containerRef]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const previousIndex = Math.max(selectedSlide - 1, 0);
        scrollToSlide(previousIndex);
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = Math.min(selectedSlide + 1, slides.length - 1);
        scrollToSlide(nextIndex);
      } else if (event.key === " ") {
        // Spacebar
        event.preventDefault();
        const nextIndex = Math.min(selectedSlide + 1, slides.length - 1);
        scrollToSlide(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSlide, slides.length, scrollToSlide]);

  // Adjust selected slide if it's out of bounds after deletion
  useEffect(() => {
    if (selectedSlide >= slides.length && slides.length > 0) {
      const newIndex = slides.length - 1;
      setSelectedSlide(newIndex);
      scrollToSlide(newIndex);
    }
  }, [slides.length, selectedSlide, scrollToSlide]);

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
