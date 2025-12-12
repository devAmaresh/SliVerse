import React, { useRef, useState, useEffect } from "react";

interface LazySlideWrapperProps {
  children: React.ReactNode;
  height?: string;
  placeholderColor?: string;
}

const LazySlideWrapper: React.FC<LazySlideWrapperProps> = ({ 
  children, 
  height = "600px", 
  placeholderColor = "#1a1a1a"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Render when the slide is within 300px of the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once visible to save performance
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ minHeight: height, width: "100%" }}
      className="flex items-center justify-center"
    >
      {isVisible ? (
        children
      ) : (
        /* Lightweight Placeholder */
        <div 
            className="w-full h-full rounded-lg animate-pulse border border-zinc-800"
            style={{ backgroundColor: placeholderColor }}
        />
      )}
    </div>
  );
};

export default LazySlideWrapper;