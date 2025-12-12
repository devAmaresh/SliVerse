import React, { useState, useEffect } from "react";
import { backend_url } from "../utils/backend";
import Cookies from "js-cookie";
import useSlideThemeStore from "../store/slideThemeStore";
import type { Theme } from "../store/slideThemeStore";
import axios from "axios";

interface ThemeSelectorProps {
  projectId: string;
  onThemeChange?: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  projectId,
  onThemeChange,
}) => {
  const { themes, setThemes, selectedTheme, setSelectedTheme } =
    useSlideThemeStore();
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch themes on mount
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/themes/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setThemes(response.data);
      // Only set theme if not already selected from project
      if (!selectedTheme && response.data.length > 0) {
        setSelectedTheme(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch themes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = async (theme: Theme) => {
    try {
      await axios.put(
        `${backend_url}/api/project/${projectId}/set-theme/`,
        { theme_id: theme.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      setSelectedTheme(theme);
      setShowDropdown(false);
      if (onThemeChange) {
        onThemeChange(theme);
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  if (loading) {
    return <div>Loading themes...</div>;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        style={{
          backgroundColor: selectedTheme?.background_color || "#1a1a1a",
          color: selectedTheme?.text_color || "#ffffff",
        }}
      >
        🎨 {selectedTheme?.display_name || "Select Theme"}
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4">
          <h3 className="font-semibold mb-3 dark:text-white">Choose a Theme</h3>
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`p-3 rounded-lg border-2 transition ${
                  selectedTheme?.id === theme.id
                    ? "border-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                style={{
                  backgroundColor: theme.background_color,
                }}
                title={theme.description}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: theme.text_color }}
                >
                  {theme.display_name}
                </div>
                <div className="flex gap-1 mt-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accent_color }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accent_color_2 }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accent_color_3 }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
