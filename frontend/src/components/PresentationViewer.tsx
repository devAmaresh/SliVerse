import React, { useState, useRef, useCallback, useEffect } from "react";
import PPTSlideRenderer from "./PPTSlideRenderer";
import NavigationSidebar from "./NavigationSidebar";
import DashNavbar from "./DashNavbar";
import useSlidesStore from "../store/useSlidesStore";
import LazySlideWrapper from "./LazySlideWrapper"; 

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
  // We keep this state for keybinding navigation, but we don't pass it to Sidebar
  const [selectedSlide, setSelectedSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingProgrammatically = useRef(false);

  const { slides, setSlides, setTitle } = useSlidesStore();

  useEffect(() => {
    if (slides.length === 0 && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
    if (title) setTitle(title);
  }, [initialSlides, title, slides.length, setSlides, setTitle]);

  // Scroll detection to update local state (for keyboard nav)
  const handleScroll = useCallback(() => {
    if (isScrollingProgrammatically.current || !containerRef.current) return;
    
    // Simple logic: update 'selectedSlide' roughly so keyboard nav works from current position
    // We heavily throttle this because we don't need UI updates for it
    const container = containerRef.current;
    const center = container.scrollTop + container.clientHeight / 2;
    
    // Quick find
    const index = slideRefs.current.findIndex(el => 
        el && el.offsetTop <= center && (el.offsetTop + el.clientHeight) > center
    );
    
    if (index !== -1 && index !== selectedSlide) {
        setSelectedSlide(index);
    }
  }, [selectedSlide]);

  // Throttled scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let tick = false;
    const onScroll = () => {
        if (!tick) {
            window.requestAnimationFrame(() => {
                handleScroll();
                tick = false;
            });
            tick = true;
        }
    };
    
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const scrollToSlide = useCallback((index: number) => {
    if (!slideRefs.current[index] || !containerRef.current) return;
    
    isScrollingProgrammatically.current = true;
    setSelectedSlide(index);

    containerRef.current.scrollTo({
      top: slideRefs.current[index]!.offsetTop - 20,
      behavior: "smooth",
    });

    setTimeout(() => { isScrollingProgrammatically.current = false; }, 800);
  }, []);

  return (
    <div className="h-screen bg-[#000] flex overflow-hidden">
      <DashNavbar />
      
      {/* Sidebar is now detached from scroll state */}
      <NavigationSidebar
        onSlideClick={scrollToSlide}
        title={title}
      />

      <div className="flex-1 pt-16 h-full bg-zinc-300 dark:bg-[#09090b]">
        <div
          ref={containerRef}
          data-slides-container
          className="h-full overflow-y-auto scroll-smooth"
        >
          <div className="pb-40 px-6 pt-10">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => (slideRefs.current[index] = el)}
                className="flex items-center justify-center mb-16"
              >
                {/* Virtualization Wrapper */}
                <LazySlideWrapper height="600px" placeholderColor={slide.dominant_color}>
                    <PPTSlideRenderer
                      slideIndex={index}
                      isActive={selectedSlide === index} // Only this updates on scroll
                      slideNumber={index + 1}
                    />
                </LazySlideWrapper>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer;