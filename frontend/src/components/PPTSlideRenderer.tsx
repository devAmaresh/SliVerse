import React, { useState, memo } from "react";
import { Edit3 } from "lucide-react";
import ColumnsLayout from "./layouts/ColumnsLayout";
import BulletsLayout from "./layouts/BulletsLayout";
import IconsLayout from "./layouts/IconsLayout";
import TimelineLayout from "./layouts/TimelineLayout";
import ChartLayout from "./layouts/ChartLayout";
import CycleLayout from "./layouts/CycleLayout";
import ArrowsLayout from "./layouts/ArrowsLayout";
import PyramidLayout from "./layouts/PyramidLayout";
import StaircaseLayout from "./layouts/StaircaseLayout";
import SlideEditor from "./SlideEditor";
import useSlidesStore from "../store/useSlidesStore";

interface ModernSlideRendererProps {
  slideIndex: number;
  isActive?: boolean;
  slideNumber: number;
}

const ModernSlideRenderer: React.FC<ModernSlideRendererProps> = ({
  slideIndex,
  isActive = false,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  
  const { slides } = useSlidesStore();
  const slide = slides[slideIndex];
  
  if (!slide) {
    return <div className="text-white p-8">Slide not found</div>;
  }
  
  const { content, layout_type, section_layout, img_url, dominant_color } = slide;

  // Optimized Layout Switcher
  const renderLayoutContent = () => {
    const layoutProps = { content, dominantColor: dominant_color };

    switch (layout_type) {
      case "columns": return <ColumnsLayout {...layoutProps} />;
      case "bullets": return <BulletsLayout {...layoutProps} />;
      case "icons": return <IconsLayout {...layoutProps} />;
      case "timeline": return <TimelineLayout {...layoutProps} />;
      case "chart": return <ChartLayout {...layoutProps} />;
      case "cycle": return <CycleLayout {...layoutProps} />;
      case "arrows": return <ArrowsLayout {...layoutProps} />;
      case "pyramid": return <PyramidLayout {...layoutProps} />;
      case "staircase": return <StaircaseLayout {...layoutProps} />;
      default:
        return (
          <div className="flex items-center justify-center py-20">
             <div className="text-white text-center">
                <h3>Unknown Layout</h3>
                <p className="text-sm text-gray-400">{layout_type}</p>
             </div>
          </div>
        );
    }
  };

  const renderSlideContent = () => {
    const hasValidImage = img_url && img_url.trim() !== "";

    // Helper for Image Rendering to reduce duplication
    const SlideImage = () => (
       <img
         src={img_url}
         alt="Slide visual"
         loading="lazy"
         decoding="async"
         className="w-full h-72 object-cover rounded-2xl shadow-xl border border-white/10"
         onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
       />
    );

    if (section_layout === "vertical" && hasValidImage) {
      return (
        <div className="w-full max-w-7xl mx-auto space-y-12">
          <div className="flex justify-center">
            <div className="relative group max-w-4xl w-full">
               <SlideImage />
            </div>
          </div>
          <div className="w-full">{renderLayoutContent()}</div>
        </div>
      );
    }

    if (hasValidImage && (section_layout === "left" || section_layout === "right")) {
      return (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-12 gap-12">
          <div className={`col-span-8 ${section_layout === "right" ? "order-1" : "order-2"}`}>
            {renderLayoutContent()}
          </div>
          <div className={`col-span-4 ${section_layout === "right" ? "order-2" : "order-1"} flex justify-center`}>
             <div className="w-full h-full">
                <img
                  src={img_url}
                  alt="Slide visual"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/10"
                />
             </div>
          </div>
        </div>
      );
    }

    return <div className="w-full max-w-7xl mx-auto">{renderLayoutContent()}</div>;
  };

  return (
    <>
      <div
        className="w-full px-8 py-12 relative group transition-colors duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${dominant_color}08 0%, #0A0A0A 80%)`,
        }}
      >
        {isActive && (
          <button
            onClick={() => setShowEditor(true)}
            className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        )}

        <div className={`relative z-10 ${isActive ? "border border-zinc-800 rounded-lg" : ""}`}>
          <div className="w-full bg-black/40 p-10 rounded-lg shadow-lg backdrop-blur-sm">
            {renderSlideContent()}
          </div>
        </div>
      </div>

      {showEditor && (
        <SlideEditor
          slideIndex={slideIndex}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
};

// CRITICAL: Memoize the component to prevent lag on parent re-renders
export default memo(ModernSlideRenderer, (prev, next) => {
  return (
    prev.slideIndex === next.slideIndex &&
    prev.isActive === next.isActive &&
    prev.slideNumber === next.slideNumber
  );
});