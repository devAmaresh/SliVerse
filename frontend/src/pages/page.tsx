import Sidebar from "../components/dashSidebar";
import { Outlet } from "react-router";
const page = () => {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="w-64 bg-zinc-50 dark:bg-zinc-900 h-screen border-r border-zinc-200 dark:border-zinc-700 fixed">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default page;
