import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import useSlidesStore from "../../store/useSlidesStore";
import { themes } from "../../utils/theme";
import Markdown from "react-markdown";
import Dash_nav from "../../components/dash_nav";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../../utils/backend";
import { Popover, Spin } from "antd";
import ImgChange from "../../components/imgChange";

type ThemeName = keyof typeof themes;

const Page: React.FC = () => {
  const { id } = useParams(); // Fetch the project ID from the URL params
  const { slides, setSlides, setTitle, setPublic } = useSlidesStore(); // Zustand Store
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [imageLoaded, setImageLoaded] = useState(false);
  const token = Cookies.get("token");
  // Load slides into the Zustand store
  useEffect(() => {
    const fetchSlideData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backend_url}/api/project/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data;

        // Set the slides and title in Zustand store
        setSlides(data.slides);
        setTitle(data.title);
        setPublic(data.is_public);
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
            className="flex space-x-2 rounded-md p-3"
            style={{
              boxShadow: `2px 2px 2px 2px rgba(0, 0, 0, 0.1)`,
            }}
          >
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
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
            </div>

            <div className="text-lg flex-1">
              <Markdown>{point.replace(/\[\[(.*?)\]\]/, "").trim()}</Markdown>
            </div>
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
    <div className="flex h-screen">
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
            <div className={`min-h-screen p-8 ${currentTheme.text}`}>
              <div className="text-4xl font-extrabold text-center mb-12">
                {/* {title} */}
              </div>

              <div
                className={`min-h-[82vh] mx-auto w-full p-10 rounded-lg shadow-lg ${currentTheme.gradient} hover:shadow-2xl transition-shadow duration-300 flex`}
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
                <div
                  className={`w-[30%] flex items-center justify-center rounded-md`}
                  style={{ backgroundColor: currentSlide.dominant_color }}
                >
                  <Popover
                    title="Change the image"
                    trigger="click"
                    content={
                      <ImgChange
                        index_id={currentSlideIndex}
                        slide_id={currentSlide?.id}
                      />
                    }
                  >
                    <img
                      src={currentSlide?.img_url}
                      alt="Slide Visual"
                      className={`max-w-full rounded-lg shadow-lg max-h-[50vh] hover:border-2 hover:border-zinc-500 cursor-pointer ${
                        imageLoaded ? "blur-0" : "blur-md"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </Popover>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Page;
