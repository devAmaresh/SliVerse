import { FeatureCard } from './features/FeatureCard';
import { AIExampleCard } from './features/AIExampleCard';
import { mainFeatures, aiExamples } from './features/FeatureData';

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-4">
            Everything you need to create amazing presentations
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powerful features that help you create presentations 10x faster with AI
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {mainFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* AI Examples Section */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            See What Our AI Can Create
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiExamples.map((example) => (
              <AIExampleCard
                key={example.title}
                title={example.title}
                description={example.description}
                imageUrl={example.imageUrl}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '10x', label: 'Faster Creation' },
            { value: '1M+', label: 'Presentations Created' },
            { value: '98%', label: 'Customer Satisfaction' },
            { value: '24/7', label: 'AI Assistance' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                {stat.value}
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}