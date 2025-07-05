import React from "react";
import ColumnsLayout from "./layouts/ColumnsLayout";
import BulletsLayout from "./layouts/BulletsLayout";
import IconsLayout from "./layouts/IconsLayout";
import TimelineLayout from "./layouts/TimelineLayout";
import ChartLayout from "./layouts/ChartLayout";
import CycleLayout from "./layouts/CycleLayout";
import ArrowsLayout from "./layouts/ArrowsLayout";
import PyramidLayout from "./layouts/PyramidLayout";
import StaircaseLayout from "./layouts/StaircaseLayout";

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

interface ModernSlideRendererProps {
  slide: SlideData;
  isActive?: boolean;
  slideNumber: number;
}

const ModernSlideRenderer: React.FC<ModernSlideRendererProps> = ({
  slide,
  isActive = false,
  slideNumber,
}) => {
  const { content, layout_type, section_layout, img_url, dominant_color } =
    slide;
  const renderLayoutContent = () => {
    const layoutProps = {
      content,
      dominantColor: dominant_color,
    };

    switch (layout_type) {
      case "columns":
        return <ColumnsLayout {...layoutProps} />;
      case "bullets":
        return <BulletsLayout {...layoutProps} />;
      case "icons":
        return <IconsLayout {...layoutProps} />;
      case "timeline":
        return <TimelineLayout {...layoutProps} />;
      case "chart":
        return <ChartLayout {...layoutProps} />;
      case "cycle":
        return <CycleLayout {...layoutProps} />;
      case "arrows":
        return <ArrowsLayout {...layoutProps} />;
      case "pyramid":
        return <PyramidLayout {...layoutProps} />;
      case "staircase":
        return <StaircaseLayout {...layoutProps} />;
      default:
        return (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Advanced Layout
              </h3>
              <p className="text-sm text-gray-400">Layout: {layout_type}</p>
            </div>
          </div>
        );
    }
  };

  const renderSlideContent = () => {
    const hasValidImage = img_url && img_url.trim() !== "";

    if (section_layout === "vertical" && hasValidImage) {
      return (
        <div className="w-full max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Image Section */}
            <div className="flex justify-center">
              <div className="relative group max-w-4xl w-full">
                <img
                  src={img_url}
                  alt="Slide visual"
                  className="w-full h-72 object-cover rounded-2xl shadow-xl border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{ backgroundColor: dominant_color }}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full">{renderLayoutContent()}</div>
          </div>
        </div>
      );
    }

    if (
      hasValidImage &&
      (section_layout === "left" || section_layout === "right")
    ) {
      return (
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-12 ">
            <div
              className={`col-span-8 ${
                section_layout === "right" ? "order-2" : "order-1"
              }`}
            >
              {renderLayoutContent()}
            </div>
            <div
              className={`col-span-4 ${
                section_layout === "right" ? "order-1" : "order-2"
              } flex justify-center`}
            >
              <div className="">
                <img
                  src={img_url}
                  alt="Slide visual"
                  className="w-full max-w-full h-full object-cover rounded-2xl shadow-xl border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-7xl mx-auto">{renderLayoutContent()}</div>
    );
  };

  return (
    <div
      className={`w-full px-8 py-12 relative `}
      style={{
        background: `radial-gradient(ellipse at center, ${dominant_color}04 0%, #0A0A0A 70%)`,
      }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute top-32 right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: dominant_color }}
        />
        <div
          className="absolute bottom-32 left-32 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: dominant_color }}
        />
      </div>

      <div
        className={`relative z-10 ${
          isActive ? "border border-zinc-900 rounded-md" : "opacity-50"
        }`}
        data-slide-renderer
        data-slide-number={slideNumber}
      >
        {/* Slide Header and Content */}
        <div className="w-full bg-black p-10 rounded-md shadow-lg backdrop-blur-sm">
          {renderSlideContent()}
        </div>
      </div>
    </div>
  );
};

export default ModernSlideRenderer;
