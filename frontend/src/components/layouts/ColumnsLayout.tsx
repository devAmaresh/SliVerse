import React from 'react';


interface ColumnsLayoutProps {
  content: any;
  dominantColor: string;
}

const ColumnsLayout: React.FC<ColumnsLayoutProps> = ({ content, dominantColor }) => {
  const columns = content.columns || [];
  
  return (
    <div className="w-full space-y-8">
      {content.title && (
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{content.title}</h2>
          <div 
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {columns.map((column: any, index: number) => (
          <div 
            key={index}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.06] transition-all duration-300 group h-full"
          >
            <div className="flex flex-col space-y-4 h-full">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: `${dominantColor}80` }}
              >
                {index + 1}
              </div>
              
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-lg text-white leading-tight">
                  {column.heading}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {column.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnsLayout;