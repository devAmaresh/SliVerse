import React from 'react';
import { motion } from 'framer-motion';

interface SlideData {
  id: string;
  slide_number: number;
  dominant_color: string;
}

interface SlideProgressProps {
  slides: SlideData[];
  activeSlide: number;
  onSlideClick: (index: number) => void;
}

const SlideProgress: React.FC<SlideProgressProps> = ({
  slides,
  activeSlide,
  onSlideClick
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
        <div className="flex items-center space-x-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSlideClick(index)}
              className="relative group"
            >
              <div className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${activeSlide === index 
                  ? 'scale-125 shadow-lg' 
                  : 'scale-100 hover:scale-110 opacity-60 hover:opacity-80'
                }
              `}
              style={{ 
                backgroundColor: activeSlide === index 
                  ? slide.dominant_color 
                  : '#d1d5db' 
              }}>
                {activeSlide === index && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: slide.dominant_color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Slide {index + 1}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideProgress;