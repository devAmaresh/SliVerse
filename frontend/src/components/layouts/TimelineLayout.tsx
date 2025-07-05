import React from 'react';

interface TimelineLayoutProps {
  content: any;
  dominantColor: string;
}

const TimelineLayout: React.FC<TimelineLayoutProps> = ({ content, dominantColor }) => {
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
        <div 
          className="absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
          style={{ backgroundColor: `${dominantColor}30` }}
        />
        
        <div className="space-y-8">
          {steps.map((step: any, index: number) => (
            <div key={index} className="relative flex items-start gap-6">
              <div 
                className="relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center"
                style={{ 
                  backgroundColor: dominantColor,
                  borderColor: `${dominantColor}60`
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              
              <div className="flex-1 pb-8">
                <div 
                  className="font-semibold text-lg mb-2"
                  style={{ color: dominantColor }}
                >
                  {step.title}
                </div>
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineLayout;