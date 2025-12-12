import React from 'react';

interface GridLayoutProps {
  content: any;
  dominantColor: string;
  textColor?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({ content, dominantColor, textColor: _textColor = "#ffffff" }) => {
  const textColor = _textColor;
  const items = content.items || content.bullets || [];
  const cols = content.cols || 3;

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
      
      <div className={`grid grid-cols-${cols} gap-6 w-full`}>
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="rounded-lg p-6 border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${dominantColor}10`,
              borderColor: `${dominantColor}40`,
            }}
          >
            {item.icon && (
              <div className="text-4xl mb-3">{item.icon}</div>
            )}
            {item.heading && (
              <h3 className="font-semibold text-lg mb-2" style={{ color: textColor }}>
                {item.heading}
              </h3>
            )}
            {item.text && (
              <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>
                {item.text}
              </p>
            )}
            {item.number && (
              <div
                className="text-3xl font-bold mt-3"
                style={{ color: dominantColor }}
              >
                {item.number}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridLayout;
