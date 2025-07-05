import React from 'react';

interface CycleLayoutProps {
  content: any;
  dominantColor: string;
}

const CycleLayout: React.FC<CycleLayoutProps> = ({ content, dominantColor }) => {
  const steps = content.steps || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {content.title && (
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-white">{content.title}</h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-8">
        <div className="grid grid-cols-2 gap-6">
          {steps.map((step: any, index: number) => (
            <div key={index} className="relative group">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: dominantColor }}
                >
                  {index + 1}
                </div>
                <div 
                  className="font-semibold text-lg"
                  style={{ color: dominantColor }}
                >
                  {step.title}
                </div>
              </div>
              
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && index % 2 === 0 && (
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <svg 
                    className="w-6 h-6"
                    style={{ color: dominantColor }}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CycleLayout;