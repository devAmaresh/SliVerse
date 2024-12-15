

interface AIExampleCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export function AIExampleCard({ title, description, imageUrl }: AIExampleCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl">
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent flex flex-col justify-end p-6">
        <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-200 text-sm">{description}</p>
      </div>
    </div>
  );
}