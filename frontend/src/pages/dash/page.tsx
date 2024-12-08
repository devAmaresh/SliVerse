import { Select } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./page.css";
const themes = {
  classic: {
    gradient: "bg-gradient-to-r from-gray-100 to-gray-300",
    text: "text-black",
    accent: "text-indigo-600",
    arrowColor: "text-indigo-500",
  },
  pastel: {
    gradient: "bg-gradient-to-r from-pink-50 to-purple-100",
    text: "text-gray-800",
    accent: "text-pink-500",
    arrowColor: "text-pink-400",
  },
  ocean: {
    gradient: "bg-gradient-to-r from-blue-100 to-cyan-100",
    text: "text-blue-900",
    accent: "text-blue-500",
    arrowColor: "text-blue-400",
  },
  vibrant: {
    gradient: "bg-gradient-to-r from-yellow-100 to-orange-200",
    text: "text-yellow-900",
    accent: "text-orange-500",
    arrowColor: "text-orange-400",
  },
  galaxy: {
    gradient: "bg-gradient-to-r from-purple-700 to-black",
    text: "text-gray-100",
    accent: "text-purple-400",
    arrowColor: "text-purple-300",
  },
};

type ThemeName = keyof typeof themes;

const Page = () => {
  const { state } = useLocation();
  const slides = state?.content?.slides || [];
  const title = state?.content?.title || "";

  const [theme, setTheme] = useState<ThemeName>("classic");
  const handleThemeChange = (value: ThemeName) => {
    setTheme(value);
  };
  const currentTheme = themes[theme];

  const renderBulletPoints = (points: any) => {
    return points.map((point: any, idx: number) => {
      if (typeof point === "string") {
        if (point.startsWith(">>")) {
          // Render sequential block with arrows
          return (
            <div key={idx} className="flex items-center space-x-2 text-lg mb-4">
              <div className="text-gray-700 mr-3">{idx + 1}.</div>

              <div className="text-gray-700" contentEditable="true">
                {point.replace(">>", "").trim()}
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="mb-2 pl-6 flex items-center">
              <div contentEditable="true">{point}</div>
            </div>
          );
        }
      } else if (point.heading && point.bullet_points) {
        // Handle nested bullet points
        return (
          <div key={idx} className="ml-6 mb-4">
            <div className="font-semibold text-lg">{point.heading}</div>
            <div contentEditable="true">
              {renderBulletPoints(point.bullet_points)}
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-700">Amaverese.ai</div>
          <div className="flex items-center space-x-4">
            <label htmlFor="theme" className="font-medium">
              Theme:
            </label>
            <Select
              defaultValue="classic"
              style={{ width: 120 }}
              onChange={handleThemeChange}
              options={[
                { value: "classic", label: "Classic" },
                { value: "pastel", label: "Pastel" },
                { value: "ocean", label: "Ocean" },
                { value: "vibrant", label: "Vibrant" },
                { value: "galaxy", label: "Galaxy" },
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className={`min-h-screen pt-24 p-8 text-black`}>
        <div
          className={`text-4xl font-extrabold text-center ${currentTheme.accent} mb-12`}
        >
          {title}
        </div>

        <div className="w-full max-w-[70%]  mx-auto space-y-12">
          {slides.map((slide: any, index: any) => (
            <div
              key={index}
              className={`min-h-[70vh] p-10 rounded-lg shadow-lg ${currentTheme.gradient} hover:shadow-2xl transition-shadow duration-300`}
            >
              <div
                className={`text-2xl font-semibold mb-4 ${currentTheme.accent}`}
              >
                {slide.heading}
              </div>

              <div className="pl-0">
                {renderBulletPoints(slide.bullet_points)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
