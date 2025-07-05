import React from "react";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center">
      <div className="text-center">

        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-white mb-4">
          <Loader2 className="inline-block animate-spin mr-2" />
        </h2>
        <p className="text-blue-100 text-lg mb-8">Loading Your Presentation</p>


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
