import React from 'react';

interface ProcessFlowLayoutProps {
  content: any;
  dominantColor: string;
  textColor?: string;
}

const ProcessFlowLayout: React.FC<ProcessFlowLayoutProps> = ({ content, dominantColor, textColor: _textColor = "#ffffff" }) => {
  const textColor = _textColor;
  const steps = content.steps || content.items || [];

  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto">
      {(content.title || content.heading) && (
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: textColor }}>{content.title || content.heading}</h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      <div className="flex items-center justify-center gap-0 w-full">
        {steps.map((step: any, index: number) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg border-2"
                style={{
                  backgroundColor: `${dominantColor}20`,
                  borderColor: dominantColor,
                  color: textColor,
                }}
              >
                {index + 1}
              </div>
              {step.title && (
                <h3 className="font-semibold text-sm text-center" style={{ color: textColor }}>
                  {step.title}
                </h3>
              )}
              {step.text && (
                <p className="text-xs text-center" style={{ color: textColor, opacity: 0.8 }}>
                  {step.text}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className="h-1 flex-1 mx-2 rounded"
                style={{ backgroundColor: `${dominantColor}40` }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlowLayout;
