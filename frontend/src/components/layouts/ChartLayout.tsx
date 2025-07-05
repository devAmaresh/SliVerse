import React from 'react';

interface ChartLayoutProps {
  content: any;
  dominantColor: string;
}

const ChartLayout: React.FC<ChartLayoutProps> = ({ content, dominantColor }) => {
  const data = content.data || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
        <div className="space-y-6">
          {data.map((item: any, index: number) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dominantColor }} />
                  <span className="font-medium text-white text-lg">
                    {item.label}
                  </span>
                </div>
                <div 
                  className="px-3 py-1 rounded-lg text-white font-semibold text-sm"
                  style={{ backgroundColor: `${dominantColor}80` }}
                >
                  {item.data}%
                </div>
              </div>
              
              <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${Math.min(parseInt(item.data), 100)}%`,
                    backgroundColor: dominantColor
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartLayout;