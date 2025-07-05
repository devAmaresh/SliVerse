import React from 'react';

interface StaircaseLayoutProps {
  content: any;
  dominantColor: string;
}

const StaircaseLayout: React.FC<StaircaseLayoutProps> = ({ content, dominantColor }) => {
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
      
      <div className="relative">
        {steps.map((step: any, index: number) => (
          <div 
            key={index}
            className="flex items-center mb-6"
            style={{ 
              marginLeft: `${index * 60}px`,
              marginTop: index === 0 ? '0' : '20px'
            }}
          >
            <div 
              className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.06] transition-all duration-300"
              style={{ 
                minWidth: '280px',
                minHeight: `${120 + index * 15}px`
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                  style={{ backgroundColor: dominantColor }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaircaseLayout;