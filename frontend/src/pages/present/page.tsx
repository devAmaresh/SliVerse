import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useSlidesStore from "../../store/useSlidesStore";
import { themes } from "../../utils/theme";
import Markdown from "react-markdown";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../../utils/backend";
import { Button, Popover, Spin, Steps, StepsProps } from "antd";
import { PlaySquareOutlined } from "@ant-design/icons";
type ThemeName = keyof typeof themes;

const Page: React.FC = () => {
  const { id } = useParams(); // Fetch the project ID from the URL params
  const { slides, setSlides, setTitle, title } = useSlidesStore(); // Zustand Store
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen state
  const token = Cookies.get("token");
  const progressDotRender: StepsProps["progressDot"] = (dot, { index }) => (
    <Popover
      content={
        <>
          <span className="mr-1">{index + 1}.</span>
          {slides[index].content.heading}
        </>
      }
    >
      {dot}
    </Popover>
  );
  // Load slides into the Zustand store
  useEffect(() => {
    const fetchSlideData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backend_url}/api/project/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = response.data;

        // Set the slides and title in Zustand store
        setSlides(data.slides);
        setTitle(data.title);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSlideData();
    }
  }, [id, setSlides, setTitle]);

  const [theme, _setTheme] = useState<ThemeName>("ocean");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentTheme = themes[theme];
  const currentSlide = slides[currentSlideIndex];

  // Key event listener for slide navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // if (!isFullscreen) return;

      if (
        (e.key === "ArrowUp" || e.key == "ArrowLeft") &&
        currentSlideIndex > 0
      ) {
        setCurrentSlideIndex((prev) => prev - 1);
      } else if (
        (e.key === "ArrowDown" || e.key == "ArrowRight") &&
        currentSlideIndex < slides.length - 1
      ) {
        setCurrentSlideIndex((prev) => prev + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlideIndex, slides.length, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  useEffect(() => {
    // Function to check fullscreen state
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup the event listener when the component unmounts or the effect is re-run
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  // Render bullet points (recursive to handle nested points)
  const renderBulletPoint = (point: any, idx: number) => {
    if (typeof point === "string") {
      return (
        <li key={idx} className="mb-2 text-lg py-4">
          <Markdown>{point}</Markdown>
        </li>
      );
    }

    if (typeof point === "object" && point.heading) {
      return (
        <div key={idx} className="ml-4">
          <div className="font-semibold text-lg">{point.heading}</div>
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
            <span className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
              <img
                src={`https://img.icons8.com/color/${
                  point.match(/\[\[(.*?)\]\]/)?.[1] || "🎯"
                }.png`}
                alt="icon"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "https://img.icons8.com/color/idea.png"; // Default image URL
                }}
                className="w-full h-full object-center object-contain"
              />
            </span>

            <p className="text-lg">
              <Markdown>{point.replace(/\[\[(.*?)\]\]/, "").trim()}</Markdown>
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderSequential = (points: any[]) => {
    return (
      <>
        <ul className="list-disc pl-6">
          {points?.map((point, idx) => (
            <div key={idx} className="mb-2 text-lg flex space-x-2 items-center">
              <div className="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center">
                <img
                  src={`https://img.icons8.com/color/${idx + 1}.png`}
                  alt="icon"
                  className="w-full h-full object-center object-contain"
                />
              </div>
              <div>
                <Markdown>{point}</Markdown>
              </div>
            </div>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="h-screen overflow-y-hidden ">
      {/* Loading State */}
      {loading && (
        <Spin fullscreen size="large" tip="Loading slides..." spinning />
      )}

      {/* Error State */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-90 z-50">
          <div className="text-3xl font-semibold text-red-500">{error}</div>
        </div>
      )}
      {/* Sidebar */}
      {!error && !loading && (
        <>
          <nav
            className={`flex justify-between relative items-center top-0 px-8 py-2 bg-zinc-100 text-black
               ${isFullscreen ? "hidden hover:block" : "block"}
               `}
          >
            <div className="font-medium">{title}</div>
            <Button
              onClick={toggleFullscreen}
              type="primary"
              icon={<PlaySquareOutlined />}
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen Present"}
            </Button>
          </nav>
          {/* Main Content */}
          <main>
            {/* Slide Content */}
            <div className={`min-h-screen p-5 ${currentTheme.text}`}>
              <div
                className={`${
                  isFullscreen ? "min-h-[90dvh]" : "min-h-[86dvh] "
                } w-full p-10 rounded-lg shadow-lg ${
                  currentTheme.gradient
                } flex`}
              >
                <div className="flex-[68%] pr-4">
                  {/* Slide Heading */}
                  <div
                    className={`text-4xl font-semibold mb-6 ${currentTheme.accent}`}
                  >
                    {currentSlide?.content?.heading ||
                      `Slide ${currentSlideIndex + 1}`}
                  </div>

                  {/* Slide Body */}
                  <div>
                    {currentSlide?.content?.style === "double_column" &&
                      renderDoubleColumn(currentSlide?.content?.body.points)}

                    {currentSlide?.content?.style === "icon" &&
                      renderIconSlide(currentSlide?.content?.body.points)}

                    {currentSlide?.content?.style === "sequential" &&
                      renderSequential(currentSlide?.content?.body.points)}
                    {currentSlide?.content?.style === "default" && (
                      <ul className="list-disc pl-6">
                        {currentSlide?.content?.body.points?.map((point, idx) =>
                          renderBulletPoint(point, idx)
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="w-[30%] flex items-center justify-center">
                  <img
                    src={currentSlide?.img_url}
                    alt="Slide Visual"
                    className={`max-w-full rounded-lg shadow-lg max-h-[50vh] ${
                      imageLoaded ? "blur-0" : "blur-md"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>
              <div className={`mt-6 ${isFullscreen ? "block" : "hidden"}`}>
                <Steps
                  progressDot={progressDotRender}
                  current={currentSlideIndex}
                  direction="horizontal"
                  items={slides.map((_slide, _idx) => ({
                    title: ``,
                  }))}
                />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Page;
