import { useState } from "react";

type Props = {
  images: string[];
  productName: string;
};

export default function ProductDetailsCarousel({ images, productName }: Readonly<Props>) {
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
            className={`h-20 w-20 rounded-lg overflow-hidden border-2
             ${i === index ? "border-[var(--color-primary)]" : "border-gray-300"}
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
