import { useState } from "react";
import {
  Home,
  Share2,
  Download,
  Play,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronRight,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import useSlidesStore from "../store/useSlidesStore";
import handleDownloadPPT from "../utils/handleDownloadPPT";
import handleDownloadPDF from "../utils/handleDownloadPDF";
import useTheme from "@/store/theme";
import { Button, message, Popover } from "antd";

const DashNavbar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { title, is_public, setPublic, slides } = useSlidesStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const token = Cookies.get("token");
  const toggleTheme = useTheme((state: any) => state.toggleTheme);
  const theme = useTheme((state: any) => state.theme);
  const [messageApi, contextHolder] = message.useMessage();
  const shareLink = `${window.location.origin}/present/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const togglePublic = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${backend_url}/api/projects/${id}/`,
        { is_public: !is_public },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPublic(response.data.is_public);
    } catch (error) {
      console.error("Error toggling public status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      messageApi.info(
        "The PPTX downloader is currently in development. Please bear with us if you encounter any issues."
      );

      await handleDownloadPPT({ slides, title });
    } catch (error) {
      console.error("Error downloading PPT:", error);
    } finally {
      setDownloadLoading(false);
    }
  };
  const handleDownloadp = async () => {
    setDownloadLoading(true);
    try {
      await handleDownloadPDF({ slides, title });
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setDownloadLoading(false);
    }
  };
  const handlePresent = () => {
    window.open(`/present/${id}`, "_blank");
  };
  const content = (
    <div>
      <button
        onClick={handleDownloadp}
        disabled={downloadLoading}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 transition-all duration-200 disabled:opacity-50 mb-2"
      >
        {downloadLoading ? (
          <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span className="text-sm font-medium">
          {downloadLoading ? "Downloading..." : "Download PDF"}
        </span>
      </button>
      <button
        onClick={handleDownload}
        disabled={downloadLoading}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-900/20 hover:bg-purple-900/30 text-purple-400 transition-all duration-200 disabled:opacity-50"
      >
        {downloadLoading ? (
          <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span className="text-sm font-medium">
          {downloadLoading ? "Downloading..." : "Download PPT"}
        </span>
      </button>
    </div>
  );
  return (
    <>
      {contextHolder}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-full px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
              >
                <Home
                  size={18}
                  className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                />
              </button>

              <ChevronRight size={16} className="text-gray-400" />

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 max-w-[300px] truncate">
                    {title}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {slides?.length || 0} slides
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
                onClick={toggleTheme}
                icon={theme === "dark" ? <Sun /> : <Moon />}
                type="text"
              />

              {/* Share Button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all duration-200"
              >
                <Share2 size={16} />
                <span className="text-sm font-medium">Share</span>
              </button>

              {/* Present Button */}
              <button
                onClick={handlePresent}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-all duration-200"
              >
                <Play size={16} />
                <span className="text-sm font-medium">Present</span>
              </button>

              <Popover
                content={content}
                title=""
                trigger="click"
                placement="bottom"
              >
                <Button
                  icon={<Download size={16} />}
                  type="text"
                  size="large"
                  className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popover>
            </div>
          </div>
        </div>
      </nav>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Share Presentation
                </h2>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {is_public ? (
                      <Eye size={20} className="text-green-500" />
                    ) : (
                      <EyeOff size={20} className="text-gray-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {is_public ? "Public" : "Private"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {is_public
                          ? "Anyone with the link can view"
                          : "Only you can view this presentation"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={togglePublic}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      is_public
                        ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
                        : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30"
                    }`}
                  >
                    {loading
                      ? "Updating..."
                      : is_public
                      ? "Make Private"
                      : "Make Public"}
                  </button>
                </div>

                {/* Share Link */}
                {is_public && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Share Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        {copySuccess ? (
                          <>
                            <Check size={16} />
                            <span className="text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span className="text-sm">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isThemeMenuOpen || isSettingsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsThemeMenuOpen(false);
            setIsSettingsOpen(false);
          }}
        />
      )}
    </>
  );
};

export default DashNavbar;
