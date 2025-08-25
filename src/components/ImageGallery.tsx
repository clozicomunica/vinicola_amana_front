// src/components/ImageGallery.tsx
import wineImage from "../assets/wine-bottle.jpg";
import { ChevronRight } from "lucide-react";

type ImageGalleryProps = {
  images: { src: string; alt?: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const ImageGallery = ({ images, activeIndex, onSelect }: ImageGalleryProps) => {
  return (
    <>
      <div className="hidden md:flex flex-col w-[100px] p-2 space-y-2 overflow-y-auto max-h-[60vh] border-r border-gray-200 bg-gray-50">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-16 h-16 rounded-md overflow-hidden transition-all duration-200 ${
              activeIndex === index
                ? "ring-2 ring-[#89764b]"
                : "hover:ring-1 hover:ring-gray-300"
            }`}
            aria-label={`Selecionar imagem ${index + 1}`}
          >
            <img
              src={img.src || wineImage}
              alt={img.alt || `Miniatura ${index + 1}`}
              className="w-full h-full object-contain bg-white rounded-md"
              onError={(e) => {
                e.currentTarget.src = wineImage;
              }}
            />
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative">
        <img
          src={images[activeIndex]?.src || wineImage}
          alt={images[activeIndex]?.alt || "Imagem do vinho"}
          className="max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] max-w-full object-contain transition-opacity duration-300"
          onError={(e) => {
            e.currentTarget.src = wineImage;
          }}
        />
        {images.length > 1 && (
          <div className="md:hidden flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-2">
            <button
              onClick={() =>
                onSelect(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
              }
              className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all"
              aria-label="Imagem anterior"
            >
              <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
            </button>
            <button
              onClick={() =>
                onSelect(activeIndex === images.length - 1 ? 0 : activeIndex + 1)
              }
              className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="md:hidden flex gap-2 p-3 overflow-x-auto border-t border-gray-200 bg-gray-50">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden transition-all ${
                activeIndex === index
                  ? "ring-2 ring-[#89764b]"
                  : "hover:ring-1 hover:ring-gray-300"
              }`}
              aria-label={`Selecionar imagem ${index + 1}`}
            >
              <img
                src={img.src || wineImage}
                alt={img.alt || `Miniatura ${index + 1}`}
                className="w-full h-full object-contain bg-white rounded-md"
                onError={(e) => {
                  e.currentTarget.src = wineImage;
                }}
            />
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageGallery;