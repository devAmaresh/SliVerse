import React from 'react';

interface ArrowsLayoutProps {
  content: any;
  dominantColor: string;
}

const ArrowsLayout: React.FC<ArrowsLayoutProps> = ({ content, dominantColor }) => {
  const steps = content.steps || [];

  return (
    <div className="w-full space-y-8">
      {content.title && (
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{content.title}</h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full">
        {steps.map((step: any, index: number) => (
          <React.Fragment key={index}>
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 text-center flex-1 max-w-xs group hover:bg-white/[0.06] transition-all duration-300 h-full">
              <div className="flex flex-col items-center space-y-4 h-full">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: dominantColor }}
                >
                  {index + 1}
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <h3 className="font-semibold text-lg text-white leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-shrink-0 hidden lg:block">
                <svg 
                  className="w-6 h-6 text-white/40"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ArrowsLayout;