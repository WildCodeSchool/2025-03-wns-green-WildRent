import { useState } from "react";

type CarouselProps = {
  images: string[];
  productName: string;
};

export default function ProductDetailsCarousel({ images, productName }: Readonly<CarouselProps>) {
  const [index, setIndex] = useState(0);

  return (
    <div className="w-full">
      
      <div className="rounded-2xl border bg-white p-6">
        <img
          src={images[index]}
          alt={productName}
          className="w-full h-[400px] object-contain"
        />
      </div>

      <div className="mt-4 flex justify-center items-center gap-4">
        {images.map((img, i) => (
          <button
            type="button"
            key={img}
            onClick={() => setIndex(i)}
            className={`h-20 w-20 rounded-lg overflow-hidden border-2 cursor-pointer
             ${i === index ? "border-[var(--dark-green)]" : "border-gray-300"}
            `}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

    </div>
  );
}
