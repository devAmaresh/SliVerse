// Dashboard.tsx
import { Search, Filter } from "lucide-react";
import PresentationCard from "../../components/PresentationCard";
import Cookies from "js-cookie";
import { message, Skeleton } from "antd";
import axios from "axios";
import { backend_url } from "../../utils/backend";
import { useEffect, useState } from "react";
import useProjectStore from "../../store/projectStore";
import ThemeToggler from "../../components/ThemeToggler";

const Dashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects, setProject } = useProjectStore();
  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("token");

      setLoading(true);
      try {
        const response = await axios.get(`${backend_url}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Slides:", response.data);
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
  }, []);
  return (
    <>
      {contextHolder}
      <ThemeToggler />
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-8">
        <div className="max-w-6xl mx-auto ">
          <div className="flex items-center justify-between mb-12">
            <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              My Presentations
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search presentations..."
                  className="pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700">
                <Filter className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                Filter
              </button>
            </div>
          </div>

          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <>
                  <Skeleton.Node active style={{ width: 350, height: 270 }} />
                  <Skeleton.Node active style={{ width: 350, height: 270 }} />
                  <Skeleton.Node active style={{ width: 350, height: 270 }} />
                </>
              ) : error ? (
                <div className="text-center col-span-3 text-red-500 dark:text-red-400">
                  {error}
                </div>
              ) : projects.length > 0 ? (
                projects.map((presentation: any) => (
                  <PresentationCard
                    key={presentation.id}
                    project_id={presentation.id}
                    title={presentation.title}
                    thumbnail="https://img.freepik.com/free-photo/business-graphics-presentation-illustration_23-2151876393.jpg"
                    dateTime={presentation.updated_at}
                  />
                ))
              ) : (
                <div className="text-center col-span-3 text-zinc-500 dark:text-zinc-400">
                  No presentations found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
