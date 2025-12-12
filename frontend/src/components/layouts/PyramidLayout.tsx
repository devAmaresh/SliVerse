import React from 'react';

interface PyramidLayoutProps {
  content: any;
  dominantColor: string;
  textColor?: string;
}

const PyramidLayout: React.FC<PyramidLayoutProps> = ({ content, dominantColor, textColor = "#ffffff"}) => {
  const steps = content.steps || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {(content.title || content.heading) && (
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-white">{content.title || content.heading}</h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      <div className="space-y-4">
        {steps.map((step: any, index: number) => {
          const widthPercentage = 100 - (index * 15);
          const padding = 1 + (steps.length - index - 1) * 2;
          
          return (
            <div 
              key={index} 
              className="mx-auto"
              style={{ width: `${Math.max(widthPercentage, 40)}%`,
               color: textColor
            }}
            >
              <div 
                className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl text-center hover:bg-white/[0.06] transition-all duration-300"
                style={{ padding: `${padding * 4}px` }}
              >
                <div className="space-y-3">
                 
                  <h3 
                    className="font-semibold" 
                    style={{ fontSize: `${16 + (steps.length - index)}px` }}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className="text-gray-300 leading-relaxed" 
                    style={{ fontSize: `${12 + (steps.length - index)}px` }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PyramidLayout;