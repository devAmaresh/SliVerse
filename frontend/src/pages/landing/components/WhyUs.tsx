import { CheckCircle2 } from 'lucide-react';

const benefits = [
  "Industry-leading AI technology",
  "10x faster than traditional tools",
  "Professional design principles",
  "Customizable templates",
  "Real-time collaboration",
  "24/7 customer support"
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Sliverse
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              We combine cutting-edge AI technology with years of presentation design expertise to deliver
              the most powerful slide creation tool in the market.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80"
              alt="Team collaboration"
              className="rounded-xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}