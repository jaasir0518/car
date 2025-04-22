// components/ui/ImagePlaceholder.jsx
export default function ImagePlaceholder({ width, height, text = 'Image' }) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-200"
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <span className="text-gray-500 text-sm">{text}</span>
      </div>
    );
  }