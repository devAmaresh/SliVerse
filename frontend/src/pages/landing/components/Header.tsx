import { Presentation } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="">
            <HashLink smooth to="/#" className="cursor-pointer flex items-center space-x-2 ">
              <Presentation className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Sliverse.ai
              </span>
            </HashLink>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <HashLink
              smooth
              to="/#features"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Features
            </HashLink>
            <HashLink
              smooth
              to="/#how-it-works"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              How it Works
            </HashLink>
            <HashLink
              smooth
              to="/#why-us"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Why Us
            </HashLink>
            <Link
              to="/pricing"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Pricing
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign In
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
              onClick={() => {
                navigate("/login");
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
