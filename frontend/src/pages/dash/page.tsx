import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import useSlidesStore from "../../store/useSlidesStore";
import { themes } from "../../utils/theme";
import Markdown from "react-markdown";
import Dash_nav from "../../components/dash_nav";
type ThemeName = keyof typeof themes;

const Page: React.FC = () => {
  const { state } = useLocation();
  const { slides, setSlides, setTitle } = useSlidesStore(); // Zustand Store
  const title = state?.content?.title || "";

  // Load slides into the Zustand store
  useEffect(() => {
    if (state?.content?.slides) setSlides(state.content.slides);
    if (title) setTitle(state.content.title);
  }, [state, setSlides]);

  const [theme, setTheme] = useState<ThemeName>("classic");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleThemeChange = (value: ThemeName) => setTheme(value);
  const handleSlideChange = (index: number) => setCurrentSlideIndex(index);

  const currentTheme = themes[theme];
  const currentSlide = slides[currentSlideIndex];

  // Render bullet points (recursive to handle nested points)
  const renderBulletPoint = (point: any, idx: number) => {
    if (typeof point === "string") {
      return (
        <div key={idx} className="mb-2 text-lg">
          <Markdown>{point}</Markdown>
        </div>
      );
    }

    if (typeof point === "object" && point.heading) {
      return (
        <div key={idx} className="ml-4">
          <h3 className="font-semibold text-lg">{point.heading}</h3>
          <ul className="list-disc pl-6 text-lg">
            {point.points?.map((nestedPoint: any, nestedIdx: number) =>
              renderBulletPoint(nestedPoint, nestedIdx)
            )}
          </ul>
        </div>
      );
    }

    return null; // Fallback for unexpected data
  };

  // Render double-column slides
  const renderDoubleColumn = (columns: any[]) => {
    return (
      <div className="grid grid-cols-2 gap-6">
        {columns.map((column, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-lg mb-2">{column.heading}</h3>
            <ul className="list-disc pl-6 text-lg">
              {column.points?.map((point: any, pointIdx: number) =>
                renderBulletPoint(point, pointIdx)
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Render icons in slides
  const renderIconSlide = (points: any[]) => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {points.map((point, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-2 rounded-md p-3"
            style={{
              boxShadow: `2px 2px 2px 2px rgba(0, 0, 0, 0.1)`,
            }}
          >
            <span className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center p-4 text-ellipsis truncate">
              {point.match(/\[\[(.*?)\]\]/)?.[1] || "🎯"} {/* Extract icon */}
            </span>
            <p className="text-lg">
              <Markdown>{point.replace(/\[\[(.*?)\]\]/, "").trim()}</Markdown>
            </p>
          </div>
        ))}
      </div>
    );
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
        {/* Navbar */}
        <Dash_nav handleThemeChange={handleThemeChange} />

        {/* Slide Content */}
        <div className={`min-h-screen pt-[86px] p-8 ${currentTheme.text}`}>
          <div className="text-4xl font-extrabold text-center mb-12">
            {/* {title} */}
          </div>

          <div
            className={`min-h-[70vh] mx-auto w-full p-10 rounded-lg shadow-lg ${currentTheme.gradient} hover:shadow-2xl transition-shadow duration-300 flex`}
          >
            <div className="flex-1">
              {/* Slide Heading */}
              <div
                className={`text-4xl font-semibold mb-6 ${currentTheme.accent}`}
              >
                {currentSlide?.content?.heading ||
                  `Slide ${currentSlideIndex + 1}`}
              </div>

              {/* Slide Body */}
              <div>
                {currentSlide?.content?.style === "double_column" ? (
                  renderDoubleColumn(currentSlide?.content?.body.points)
                ) : currentSlide?.content?.style === "icon" ? (
                  renderIconSlide(currentSlide?.content?.body.points)
                ) : (
                  <ul className="list-disc pl-6">
                    {currentSlide?.content?.body.points?.map((point, idx) =>
                      renderBulletPoint(point, idx)
                    )}
                  </ul>
                )}
              </div>
            </div>
            {currentSlide?.content?.style === "default" && (
              <div className="w-[40%] flex items-center justify-center">
                <img
                  src="https://img.freepik.com/free-photo/fantasy-style-scene-international-day-education_23-2151040298.jpg"
                  alt="Slide Visual"
                  className="max-w-full rounded-lg shadow-lg max-h-[50vh]"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
