// Dashboard.tsx
import  { useEffect, useState } from "react";
import {
  Search,
  Star,
  Grid3X3,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import PresentationCard from "../../components/PresentationCard";
import Cookies from "js-cookie";
import { message, Skeleton, Button, Badge } from "antd";
import axios from "axios";
import { backend_url } from "../../utils/backend";
import useProjectStore from "../../store/projectStore";

type ViewMode = "all" | "favorites";
type SortOption = "updated_at" | "title" | "created_at";

const Dashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated_at");

  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  const { projects, setProject } = useProjectStore();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("token");
      setLoading(true);

      try {
        const response = await axios.get(`${backend_url}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError("Failed to load presentations.");
        messageApi.error("Failed to load presentations.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [setProject, messageApi]);

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Apply view mode filter
    switch (viewMode) {
      case "favorites":
        filtered = filtered.filter((project) => project.is_favorite === true);
        break;
      case "all":
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "updated_at":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "created_at":
          return (
            new Date(b.created_at || b.updated_at).getTime() -
            new Date(a.created_at || a.updated_at).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, viewMode, searchTerm, sortBy]);

  const favoriteCount = projects.filter((p) => p.is_favorite).length;

  const viewModes = [
    { key: "all", label: "All", icon: Grid3X3, count: projects.length },
    { key: "favorites", label: "Favorites", icon: Star, count: favoriteCount },
  ];

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Home
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage and organize your presentations
            </p>
          </div>

          {/* Horizontal Filter Tabs - Gamma Style */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                {viewModes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key as ViewMode)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === mode.key
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {mode.icon && (
                      <mode.icon
                        className={`w-4 h-4 ${
                          mode.key === "favorites" && viewMode === "favorites"
                            ? "fill-current text-yellow-500"
                            : ""
                        }`}
                      />
                    )}
                    <span>{mode.label}</span>
                    {mode.count > 0 && (
                      <Badge
                        count={mode.count}
                        size="small"
                        style={{
                          backgroundColor:
                            viewMode === mode.key ? "#6366f1" : "#71717a",
                          color: "white",
                          fontSize: "11px",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Layout and Sort Controls */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search presentations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                             text-zinc-900 dark:text-white placeholder-zinc-400"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
                >
                  <option value="updated_at">Last Updated</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="created_at">Date Created</option>
                </select>
              </div>
            </div>

            {/* Current Filter Info */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {searchTerm ? (
                  <>
                    Showing {filteredProjects.length} results for "{searchTerm}"
                  </>
                ) : (
                  <>
                    {filteredProjects.length}{" "}
                    {filteredProjects.length === 1
                      ? "presentation"
                      : "presentations"}
                    {viewMode === "favorites" && " marked as favorite"}
                  </>
                )}
              </div>

              {viewMode === "favorites" && filteredProjects.length > 0 && (
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Your favorites</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative">
            {loading ? (
              <div
                className={`
                ${"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"}
              `}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700"
                  >
                    <Skeleton.Node
                      active
                      style={{ width: "100%", height: 160 }}
                    />
                    <div className="mt-4 space-y-2">
                      <Skeleton.Input active style={{ width: "80%" }} />
                      <Skeleton.Input active style={{ width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    Failed to Load Presentations
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    type="primary"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div
                className={`
                ${"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"}
              `}
              >
                {filteredProjects.map((presentation: any) => (
                  <div
                    key={presentation.id}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <PresentationCard
                      project_id={presentation.id}
                      title={presentation.title}
                      thumbnail="https://img.freepik.com/free-photo/business-graphics-presentation-illustration_23-2151876393.jpg"
                      dateTime={presentation.updated_at}
                      is_public={presentation.is_public}
                      is_favorite={presentation.is_favorite}
                      xml_content={presentation.xml_content}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-700">
                      {viewMode === "favorites" ? (
                        <Star className="w-12 h-12 text-yellow-500" />
                      ) : (
                        <LayoutGrid className="w-12 h-12 text-zinc-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    {viewMode === "favorites"
                      ? searchTerm
                        ? "No favorite presentations match your search"
                        : "No Favorite Presentations"
                      : searchTerm
                      ? "No presentations match your search"
                      : "No Presentations Found"}
                  </h3>

                  <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-6 mx-auto">
                    {viewMode === "favorites"
                      ? searchTerm
                        ? "Try adjusting your search terms or browse all presentations."
                        : "Start marking presentations as favorites by clicking the star icon on any presentation card."
                      : searchTerm
                      ? "Try different search terms or create your first presentation."
                      : "Create your first presentation to get started."}
                  </p>

                  {searchTerm ? (
                    <Button
                      onClick={() => setSearchTerm("")}
                      className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
                    >
                      Clear Search
                    </Button>
                  ) : viewMode === "favorites" ? (
                    <Button onClick={() => setViewMode("all")} type="primary">
                      Browse All Presentations
                    </Button>
                  ) : (
                    <Button
                      onClick={() => (window.location.href = "/generate-slide")}
                      type="primary"
                    >
                      Create Presentation
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
