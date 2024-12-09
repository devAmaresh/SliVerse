// src/pages/Page.tsx
import { Select } from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import useSlidesStore from "../../store/useSlidesStore";
import { themes } from "../../utils/theme";

type ThemeName = keyof typeof themes;

const Page: React.FC = () => {
  const { state } = useLocation();
  const { slides, setSlides } = useSlidesStore(); // Zustand Store
  const title = state?.content?.title || "";

  // Load slides into the Zustand store
  React.useEffect(() => {
    if (state?.content?.slides) setSlides(state.content.slides);
  }, [state, setSlides]);

  const [theme, setTheme] = useState<ThemeName>("classic");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleThemeChange = (value: ThemeName) => setTheme(value);

  const handleSlideChange = (index: number) => setCurrentSlideIndex(index);

  const currentTheme = themes[theme];

  // Get current slide
  const currentSlide = slides[currentSlideIndex];
  const bulletPoints = Array.isArray(currentSlide?.bullet_points)
    ? currentSlide?.bullet_points
    : []; // Ensures bullet_points is always an array

  // Recursive component to render bullet points, handling nested structures
  const renderBulletPoint = (point: any, idx: number) => {
    if (typeof point === "string") {
      return (
        <p key={idx} className="text-lg mb-2">
          {point}
        </p>
      );
    }

    if (typeof point === "object" && point !== null) {
      return (
        <div key={idx} className="ml-4">
          <h3 className="font-semibold text-xl">{point.heading}</h3>
          {Array.isArray(point.bullet_points) &&
            point.bullet_points.map((nestedPoint: any, nestedIdx: any) =>
              renderBulletPoint(nestedPoint, nestedIdx)
            )}
        </div>
      );
    }

    return null; // Fallback in case of unexpected data
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        handleSlideChange={handleSlideChange}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <nav className="dark:bg-zinc-900 bg-zinc-100 border-b border-zinc-300 shadow-md fixed top-0 left-0 w-full z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Amaverse.ai
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="theme" className="font-medium">
                Theme:
              </label>
              <Select
                defaultValue="classic"
                style={{ width: 120 }}
                onChange={handleThemeChange}
                options={Object.keys(themes).map((key) => ({
                  value: key,
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                }))}
              />
            </div>
          </div>
        </nav>

        <div className={`min-h-screen pt-[86px] p-8 ${currentTheme.text}`}>
          <div
            className={`text-4xl font-extrabold text-center ${currentTheme.accent} mb-12`}
          >
            {/* {title} */}
          </div>

          <div
            className={`min-h-[70vh] mx-auto w-full p-10 rounded-lg shadow-lg ${currentTheme.gradient} hover:shadow-2xl transition-shadow duration-300`}
          >
            <div
              className={`text-2xl font-semibold mb-4 ${currentTheme.accent}`}
            >
              {currentSlide?.heading || `Slide ${currentSlideIndex + 1}`}
            </div>
            <div className="pl-0">
              {bulletPoints.length > 0 ? (
                bulletPoints.map((point, idx) => renderBulletPoint(point, idx))
              ) : (
                <p>No bullet points available for this slide.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
