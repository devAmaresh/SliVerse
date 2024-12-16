import { useState } from "react";
import { Presentation, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="">
            <HashLink
              smooth
              to="/#"
              className="cursor-pointer flex items-center space-x-2"
            >
              <Presentation className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Sliverse.ai
              </span>
            </HashLink>
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <div className="mr-4">
            <ThemeToggle />
            </div>
          
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-white dark:bg-gray-900 shadow-md rounded-lg">
            <nav className="flex flex-col space-y-4 px-4 py-2">
              <HashLink
                smooth
                to="/#features"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </HashLink>
              <HashLink
                smooth
                to="/#how-it-works"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </HashLink>
              <HashLink
                smooth
                to="/#why-us"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Why Us
              </HashLink>
              <Link
                to="/pricing"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <button
                className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-left"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </button>
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
