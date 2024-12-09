import { Search, Filter, Plus } from "lucide-react";
import PresentationCard from "../../components/PresentationCard";

const Dashboard = () => {
  const recentPresentations = [
    {
      id: 1,
      title: "Q1 Business Review",
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
      date: "Updated 2 hours ago",
    },
    {
      id: 2,
      title: "Marketing Strategy 2024",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      date: "Created yesterday",
    },
    {
      id: 3,
      title: "Product Launch Deck",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      date: "Updated 3 days ago",
    },
  ];

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            My Presentations
          </h2>
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
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Recent Presentations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPresentations.map((presentation) => (
              <PresentationCard
                key={presentation.id}
                title={presentation.title}
                thumbnail={presentation.thumbnail}
                date={presentation.date}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Create from template
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
