import React from 'react';

interface BulletsLayoutProps {
  content: any;
  dominantColor: string;
  textColor?: string;
}

const BulletsLayout: React.FC<BulletsLayoutProps> = ({ content, dominantColor, textColor = "#ffffff" }) => {
  const bullets = content.bullets || [];

  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto">
      {(content.title || content.heading) && (
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: textColor }}>
            {content.title || content.heading}
          </h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      {/* Grid container handles the equal width automatically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full auto-rows-fr">
        {bullets.map((bullet: any, index: number) => (
          // Wrapper needs h-full to fill the grid cell height
          <div key={index} className="w-full h-full">
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.06] transition-all duration-300 w-full h-full flex flex-col">
              <div className="flex items-start gap-4 flex-1">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: `${dominantColor}20` }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      background: `linear-gradient(135deg, ${dominantColor}90, ${dominantColor}60)`,
                      boxShadow: `0 8px 32px ${dominantColor}20`,
                      color: textColor
                    }}
                  />
                </div>
                
                <div className="flex-1 space-y-2 min-w-0">
                  {bullet.heading && (
                    <h3 className="font-semibold text-lg" style={{ color: textColor }}>
                      {bullet.heading}
                    </h3>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                    {bullet.text}
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

export default BulletsLayout;