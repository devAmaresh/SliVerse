import React from 'react';

interface CirclesLayoutProps {
  content: any;
  dominantColor: string;
  textColor?: string;
}

const CirclesLayout: React.FC<CirclesLayoutProps> = ({ content, dominantColor, textColor: _textColor = "#ffffff" }) => {
  const textColor = _textColor;
  const items = content.items || content.bullets || [];

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
      
      <div className="flex flex-wrap justify-center items-center gap-8">
        {items.map((item: any, index: number) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 border-2"
              style={{
                backgroundColor: `${dominantColor}15`,
                borderColor: dominantColor,
              }}
            >
              <div className="text-center px-4">
                {item.icon && (
                  <div className="text-3xl mb-2">{item.icon}</div>
                )}
                {item.number && (
                  <div
                    className="text-2xl font-bold"
                    style={{ color: dominantColor }}
                  >
                    {item.number}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center max-w-xs">
              {item.heading && (
                <h3 className="font-semibold text-sm" style={{ color: textColor }}>
                  {item.heading}
                </h3>
              )}
              {item.text && (
                <p className="text-xs mt-1" style={{ color: textColor, opacity: 0.8 }}>
                  {item.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CirclesLayout;
