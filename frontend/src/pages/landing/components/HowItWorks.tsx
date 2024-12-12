import React from 'react';
import { FileText, Wand2, PresentationIcon } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: "1. Input Your Content",
    description: "Simply paste your content or start from scratch with our AI-powered content suggestions."
  },
  {
    icon: Wand2,
    title: "2. AI Magic",
    description: "Our AI analyzes your content and generates professional slides with perfect layouts and designs."
  },
  {
    icon: PresentationIcon,
    title: "3. Present",
    description: "Download your presentation or present directly from our platform with confidence."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Create stunning presentations in three simple steps
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="relative">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <step.icon className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}