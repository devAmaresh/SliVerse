import React from "react";

interface IconsLayoutProps {
  content: any;
  dominantColor: string;
  textColor?: string;
}

const IconsLayout: React.FC<IconsLayoutProps> = ({
  content,
  dominantColor,
  textColor: _textColor = "#ffffff",
}) => {
  const textColor = _textColor;
  const getIconByQuery = (query: string) => {
    const iconMap: { [key: string]: string } = {
      rocket: "🚀",
      shield: "🛡️",
      trophy: "🏆",
      bulb: "💡",
      star: "⭐",
      fire: "🔥",
      thunder: "⚡",
      heart: "❤️",
      crown: "👑",
      check: "✅",
      play: "▶️",
      gear: "⚙️",
      target: "🎯",
      diamond: "💎",
      magic: "✨",
      tiktok: "📱",
      instagram: "📷",
      discord: "💬",
      youtube: "📺",
      snapchat: "👻",
      facebook: "📘",
      twitter: "🐦",
      linkedin: "🔗",
      github: "🐱",
      code: "💻",
      globe: "🌍",
      book: "📚",
      pencil: "✏️",
      music: "🎵",
      camera: "📸",
      video: "🎥",
      game: "🎮",
      smile: "😊",
    };
    return iconMap[query.toLowerCase()] || "⚡";
  };

  const icons = content.icons || [];

  return (
    <div className="w-full space-y-8">
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

      <div className="flex justify-evenly space-x-6 w-full">
        {icons.map((icon: any, index: number) => (
          <div
            key={index}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.06] transition-all duration-300 text-center group h-full"
          >
            <div className="flex flex-col items-center space-y-4 h-full">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: `${dominantColor}15` }}
              >
                {getIconByQuery(icon.icon.split(" ")[0])}
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-lg leading-tight" style={{ color: textColor }}>
                  {icon.heading}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                  {icon.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconsLayout;
