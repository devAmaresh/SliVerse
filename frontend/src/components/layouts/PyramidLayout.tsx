import React from 'react';

interface PyramidLayoutProps {
  content: any;
  dominantColor: string;
}

const PyramidLayout: React.FC<PyramidLayoutProps> = ({ content, dominantColor }) => {
  const steps = content.steps || [];

  // Calculate modern pyramid dimensions
  const getPyramidWidth = (index: number) => {
    const baseWidth = 85; // Maximum width for bottom layer
    const minWidth = 25;  // Minimum width for top layer
    const reduction = (baseWidth - minWidth) / Math.max(steps.length - 1, 1);
    return Math.max(baseWidth - (index * reduction), minWidth);
  };

  const getPyramidHeight = (index: number) => {
    const baseHeight = 80; // Height for bottom layer
    const minHeight = 60;  // Height for top layer
    const reduction = (baseHeight - minHeight) / Math.max(steps.length - 1, 1);
    return Math.max(baseHeight - (index * reduction), minHeight);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Modern Title */}
      {(content.title || content.heading) && (
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">{content.title || content.heading}</h2>
          <div className="flex items-center justify-center space-x-2">
            <div 
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: dominantColor }}
            />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div 
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: dominantColor }}
            />
          </div>
        </div>
      )}
      
      {/* Modern Pyramid Structure */}
      <div className="relative">
        <div className="space-y-3">
          {steps.map((step: any, index: number) => {
            const width = getPyramidWidth(index);
            const height = getPyramidHeight(index);
            const isTop = index === 0;
            const isBottom = index === steps.length - 1;
            
            return (
              <div 
                key={index} 
                className="flex justify-center"
              >
                <div 
                  className="relative group cursor-pointer"
                  style={{ 
                    width: `${width}%`,
                    height: `${height}px`
                  }}
                >
                  {/* Pyramid Block */}
                  <div 
                    className={`
                      relative h-full w-full bg-gradient-to-br from-white/5 to-white/[0.02] 
                      backdrop-blur-sm border border-white/10 
                      hover:border-white/20 hover:bg-white/[0.08]
                      transition-all duration-300 ease-out
                      shadow-lg hover:shadow-xl
                      ${isTop ? 'rounded-t-2xl' : ''}
                      ${isBottom ? 'rounded-b-2xl' : ''}
                      ${!isTop && !isBottom ? 'rounded-none' : ''}
                    `}
                    style={{
                      background: `linear-gradient(135deg, ${dominantColor}08, ${dominantColor}02)`,
                      borderColor: `${dominantColor}20`
                    }}
                  >
                    {/* Content Container */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center space-y-2 max-w-full">
                        {/* Step Number Badge */}
                        <div className="flex justify-center mb-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                            style={{ 
                              backgroundColor: dominantColor,
                              boxShadow: `0 4px 12px ${dominantColor}40`
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>
                        
                        {/* Step Title */}
                        <h3 
                          className="font-bold text-white leading-tight"
                          style={{ 
                            fontSize: isTop ? '18px' : isBottom ? '14px' : '16px'
                          }}
                        >
                          {step.title}
                        </h3>
                        
                        {/* Step Description */}
                        <p 
                          className="text-gray-300 leading-relaxed line-clamp-3"
                          style={{ 
                            fontSize: isTop ? '14px' : isBottom ? '12px' : '13px'
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Accent */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit"
                      style={{
                        background: `linear-gradient(135deg, ${dominantColor}10, transparent)`
                      }}
                    />

                    {/* Side Accent Lines */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-inherit opacity-60"
                      style={{ backgroundColor: dominantColor }}
                    />
                  </div>

                  {/* Connection Line to Next Level */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                      <div 
                        className="w-px h-3 opacity-40"
                        style={{ backgroundColor: dominantColor }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pyramid Outline Effect (Optional Visual Enhancement) */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-px opacity-20"
            style={{ 
              backgroundColor: dominantColor,
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        {/* Base Foundation Line */}
        <div className="mt-6 flex justify-center">
          <div 
            className="h-1 rounded-full opacity-60"
            style={{ 
              backgroundColor: dominantColor,
              width: `${getPyramidWidth(steps.length - 1)}%`
            }}
          />
        </div>
      </div>

      {/* Modern Stats/Summary */}
      {steps.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dominantColor }}
              />
              <span>{steps.length} Levels</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center space-x-2">
              <span>🏗️</span>
              <span>Hierarchical Structure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PyramidLayout;