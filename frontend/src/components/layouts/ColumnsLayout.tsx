import React from "react";

interface ColumnsLayoutProps {
  content: any;
  dominantColor: string;
}

const ColumnsLayout: React.FC<ColumnsLayoutProps> = ({
  content,
  dominantColor,
}) => {
  const columns = content.columns || [];

  return (
    <div className="w-full space-y-8">
      {(content.title || content.heading) && (
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {content.title || content.heading}
          </h2>
          <div
            className="w-16 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      )}

      <div className="flex justify-evenly items-stretch space-x-6 w-full">
        {columns.map((column: any, index: number) => (
          <div
            key={index}
            className="relative group flex-1 min-h-full"
          >
            {/* Glassmorphism Card */}
            <div className="h-full p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent backdrop-blur-xl shadow-2xl group-hover:shadow-3xl group-hover:border-white/20 transition-all duration-500 group-hover:from-white/[0.12] group-hover:via-white/[0.08]">


              <div className="flex flex-col space-y-4 h-full">
                {/* Modern Icon/Number */}
                <div className="flex items-center space-x-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 border border-white/10"
                    style={{ 
                      background: `linear-gradient(135deg, ${dominantColor}90, ${dominantColor}60)`,
                      boxShadow: `0 8px 32px ${dominantColor}20`
                    }}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Subtle accent line */}
                  <div 
                    className="flex-1 h-px opacity-30"
                    style={{ backgroundColor: dominantColor }}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-white leading-tight tracking-tight">
                    {column.heading}
                  </h3>
                  <p className="text-sm text-gray-300/90 leading-relaxed font-medium">
                    {column.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="pt-2">
                  <div 
                    className="w-8 h-1 rounded-full opacity-50 group-hover:w-12 group-hover:opacity-80 transition-all duration-300"
                    style={{ backgroundColor: dominantColor }}
                  />
                </div>
              </div>

              {/* Subtle Inner Glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle at 50% 0%, ${dominantColor}15, transparent 70%)` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnsLayout;
