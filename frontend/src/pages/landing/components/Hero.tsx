import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 pt-32 pb-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Transform Ideas
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Into Stunning Slides
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Harness the power of AI to create professional presentations in seconds.
            Let our intelligent design system handle the heavy lifting.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2">
              Try for free <ArrowRight className="h-5 w-5" />
            </button>
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2">
              <Play className="h-5 w-5" /> Watch demo
            </button>
          </div>
        </div>
        <div className="mt-20">
          <img
            src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=2000&q=80"
            alt="AI Presentation Dashboard"
            className="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
          />
        </div>
      </div>
    </div>
  );
}