import React from "react";
import { ThunderboltOutlined } from "@ant-design/icons";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-2xl shadow-2xl flex items-center justify-center animate-pulse">
            <ThunderboltOutlined className="text-4xl text-blue-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-white opacity-30 animate-ping"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-white mb-4">
          <Loader2 className="inline-block animate-spin mr-2" />
        </h2>
        <p className="text-blue-100 text-lg mb-8">Loading Your Presentation</p>

        {/* Modern Progress Bar */}
        <div className="w-80 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-pink-300 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-60"></div>
      </div>
    </div>
  );
};

export default Loader;
