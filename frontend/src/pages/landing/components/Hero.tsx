import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroVideoDialog from "../../../components/ui/hero-video-dialog";
import { HashLink } from "react-router-hash-link";

export function Hero() {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 pt-40 pb-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold md:tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Transform Ideas
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Into Stunning Slides
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Powered by AI.
            </span>
          </div>
          <div className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Harness the power of AI to create professional presentations in
            seconds. Let our intelligent design system handle the heavy lifting.
          </div>
          <div className="mt-10 flex justify-center gap-4">
            <button
              className="px-4 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              Try for free <ArrowRight className="h-5 w-5" />
            </button>
            <HashLink to="/#hero-video">
              <button className="px-4 sm:px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2">
                <Play className="h-5 w-5" /> Watch demo
              </button>
            </HashLink>
          </div>
        </div>
        <div className="mt-20 flex justify-center" id="hero-video">
          {/* <img
            src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=2000&q=80"
            alt="AI Presentation Dashboard"
            className="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 md:max-w-3xl xl:max-w-6xl xl:max-h-[40vh]"
          /> */}
          <div className="relative md:pt-24 pt-20">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="top-in-bottom-out"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="/hero-light.png"
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="top-in-bottom-out"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="/hero-dark.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
