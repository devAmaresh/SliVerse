import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useSlidesStore from "../../store/useSlidesStore";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../../utils/backend";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Grid3X3,
  Home,
  X
} from "lucide-react";

// Import all layout components
import ColumnsLayout from "../../components/layouts/ColumnsLayout";
import BulletsLayout from "../../components/layouts/BulletsLayout";
import IconsLayout from "../../components/layouts/IconsLayout";
import TimelineLayout from "../../components/layouts/TimelineLayout";
import ChartLayout from "../../components/layouts/ChartLayout";
import CycleLayout from "../../components/layouts/CycleLayout";
import ArrowsLayout from "../../components/layouts/ArrowsLayout";
import PyramidLayout from "../../components/layouts/PyramidLayout";
import StaircaseLayout from "../../components/layouts/StaircaseLayout";

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

const PresentPage: React.FC = () => {
  const { id } = useParams();
  const { slides, setSlides, setTitle, title } = useSlidesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const token = Cookies.get("token");

  const currentSlide = slides[currentSlideIndex];

  // Load slides
  useEffect(() => {
    const fetchSlideData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backend_url}/api/project/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = response.data;
        setSlides(data.slides);
        setTitle(data.title);
      } catch (err) {
        setError("Failed to fetch presentation data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSlideData();
    }
  }, [id, setSlides, setTitle]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentSlideIndex > 0) {
        setCurrentSlideIndex((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      } else if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "g" || e.key === "G") {
        setShowGrid(!showGrid);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, slides.length, isFullscreen, showGrid]);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 2000);
    };

    if (isFullscreen) {
      resetTimer();
      const handleMouseMove = () => resetTimer();
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(timer);
      };
    } else {
      setShowControls(true);
    }
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setShowControls(true); 
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
      setShowControls(true); 
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setShowGrid(false);
  };

  // Render the appropriate layout component
  const renderLayoutContent = (slide: SlideData) => {
    const layoutProps = {
      content: slide.content,
      dominantColor: slide.dominant_color
    };

    switch (slide.layout_type) {
      case 'columns':
        return <ColumnsLayout {...layoutProps} />;
      case 'bullets':
        return <BulletsLayout {...layoutProps} />;
      case 'icons':
        return <IconsLayout {...layoutProps} />;
      case 'timeline':
        return <TimelineLayout {...layoutProps} />;
      case 'chart':
        return <ChartLayout {...layoutProps} />;
      case 'cycle':
        return <CycleLayout {...layoutProps} />;
      case 'arrows':
        return <ArrowsLayout {...layoutProps} />;
      case 'pyramid':
        return <PyramidLayout {...layoutProps} />;
      case 'staircase':
        return <StaircaseLayout {...layoutProps} />;
      default:
        return (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Advanced Layout</h3>
              <p className="text-sm text-gray-400">Layout: {slide.layout_type}</p>
            </div>
          </div>
        );
    }
  };

  // Render slide content with proper layout based on section_layout and images
  const renderSlideContent = (slide: SlideData) => {
    const hasValidImage = slide.img_url && slide.img_url.trim() !== '';

    if (slide.section_layout === 'vertical' && hasValidImage) {
      return (
        <div className="w-full max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Image Section */}
            <div className="flex justify-center">
              <div className="relative group max-w-4xl w-full">
                <img 
                  src={slide.img_url} 
                  alt="Slide visual"
                  className="w-full h-72 object-cover rounded-2xl shadow-xl border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{ backgroundColor: slide.dominant_color }}
                />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="w-full">
              {renderLayoutContent(slide)}
            </div>
          </div>
        </div>
      );
    }

    if (hasValidImage && (slide.section_layout === 'left' || slide.section_layout === 'right')) {
      return (
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-12">
            <div className={`col-span-8 ${slide.section_layout === 'right' ? 'order-2' : 'order-1'}`}>
              {renderLayoutContent(slide)}
            </div>
            <div className={`col-span-4 ${slide.section_layout === 'right' ? 'order-1' : 'order-2'} flex justify-center`}>
              <div>
                <img 
                  src={slide.img_url} 
                  alt="Slide visual"
                  className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-7xl mx-auto">
        {renderLayoutContent(slide)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <p className="text-white text-lg">{error}</p>
          <button
            onClick={() => window.close()}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'h-screen' : 'min-h-screen'} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <header className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.close()}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <Home size={16} className="text-white" />
                <span className="text-white text-sm">Exit</span>
              </button>
              <div className="text-white">
                <h1 className="font-semibold">{title}</h1>
                <p className="text-white/60 text-sm">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                title="Show all slides (G)"
              >
                <Grid3X3 size={18} className="text-white" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-200"
                title="Toggle fullscreen (F)"
              >
                <Maximize size={18} className="text-blue-400" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Presentation Area */}
      <main className={`relative ${isFullscreen ? 'h-full' : 'min-h-screen pt-20'} flex items-center justify-center`}>
        {/* Current Slide */}
        {currentSlide && (
          <div 
            className="w-full h-full px-8 py-12 relative"
            style={{ 
              background: `radial-gradient(ellipse at center, ${currentSlide.dominant_color}04 0%, #0A0A0A 70%)`
            }}
          >
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div 
                className="absolute top-32 right-32 w-96 h-96 rounded-full blur-3xl"
                style={{ backgroundColor: currentSlide.dominant_color }}
              />
              <div 
                className="absolute bottom-32 left-32 w-80 h-80 rounded-full blur-3xl"
                style={{ backgroundColor: currentSlide.dominant_color }}
              />
            </div>

            <div className="relative z-10 h-full flex flex-col">
             

              {/* Slide Content and Header */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full bg-black/40 backdrop-blur-sm border border-white/5 p-10 rounded-2xl shadow-xl">
                  {renderSlideContent(currentSlide)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Controls */}
      <div 
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-300 ${
          isFullscreen && !showControls ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
            title="Previous slide (←)"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          {/* Slide Counter */}
          <div className="text-white text-sm font-medium px-4">
            {currentSlideIndex + 1} / {slides.length}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
            title="Next slide (→)"
          >
            <ChevronRight size={20} className="text-white" />
          </button>

          {/* Fullscreen Toggle */}
          <div className="w-px h-8 bg-white/20 mx-2" />
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200"
            title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
          >
            {isFullscreen ? (
              <Minimize size={20} className="text-white" />
            ) : (
              <Maximize size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="w-full h-1 bg-black/20">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((currentSlideIndex + 1) / slides.length) * 100}%`,
              backgroundColor: currentSlide?.dominant_color || '#3B82F6'
            }}
          />
        </div>
      </div>

      {/* Grid View */}
      {showGrid && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
          <div className="h-full overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">All Slides</h2>
                <button
                  onClick={() => setShowGrid(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200"
                  title="Close grid view (G)"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`relative aspect-video bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-200 ${
                      index === currentSlideIndex ? 'ring-4 ring-blue-500' : ''
                    }`}
                  >
                    {slide.img_url ? (
                      <img 
                        src={slide.img_url}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: `${slide.dominant_color}20` }}
                      >
                        <span className="text-2xl font-bold" style={{ color: slide.dominant_color }}>
                          {index + 1}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                      <p className="text-xs truncate">
                        {slide.content?.heading || `Slide ${index + 1}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentPage;