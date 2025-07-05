import React from 'react';

interface BulletsLayoutProps {
  content: any;
  dominantColor: string;
}

const BulletsLayout: React.FC<BulletsLayoutProps> = ({ content, dominantColor }) => {
  const bullets = content.bullets || [];

  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto">
      {content.title && (
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{content.title}</h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 w-full">
        {bullets.map((bullet: any, index: number) => (
          <div key={index} className="w-full">
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.06] transition-all duration-300 w-full">
              <div className="flex items-start gap-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: `${dominantColor}20` }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dominantColor }}
                  />
                </div>
                
                <div className="flex-1 space-y-2 min-w-0">
                  {bullet.heading && (
                    <h3 className="font-semibold text-lg text-white">
                      {bullet.heading}
                    </h3>
                  )}
                  <p className="text-sm text-gray-300 leading-relaxed">
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