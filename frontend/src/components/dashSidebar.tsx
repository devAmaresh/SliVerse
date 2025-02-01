import { Home, Settings, Star, Plus, LogOut, Presentation } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Check if the current path is the homepage (Dashboard)
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-zinc-50 dark:bg-zinc-900 h-screen border-r border-zinc-200 dark:border-zinc-700 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <Presentation className="h-7 w-7 dark:text-white" />
        </div>
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
          SliVerse.ai
        </h1>
      </div>

      <Link
        className="w-full bg-black text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:opacity-80 transition-colors"
        to="/generate-slide"
      >
        <Plus className="w-5 h-5" />
        New Presentation
      </Link>

      <nav className="mt-8 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-2 ${
                isActive("/dashboard")
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              } rounded-lg`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/favorites"
              className={`flex items-center gap-3 px-4 py-2 ${
                isActive("/dashboard/favorites")
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              } rounded-lg`}
            >
              <Star className="w-5 h-5" />
              Favorites
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/settings"
              className={`flex items-center gap-3 px-4 py-2 ${
                isActive("/dashboard/settings")
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              } rounded-lg`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <Link
          to="/logout"
          className="w-full flex items-center gap-3 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
