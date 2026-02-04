import { useState } from "react";

type CarouselProps = {
  images: string[];
  productName: string;
};

export default function ProductCarousel({ images, productName }: Readonly<CarouselProps>) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="w-full">
      <div className="w-full rounded-2xl border-4 border-[var(--color-primary)] bg-white p-8">
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="mt-4 flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
              index === selectedImage
                ? "border-[var(--color-primary)]"
                : "border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${productName} vue ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}