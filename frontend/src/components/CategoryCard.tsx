import React from "react";

interface CategoryCardProps {
  title: string;
  image: string;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  onClick,
}) => {
  return (
    <div className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden group cursor-pointer">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>

      <div className="absolute bottom-4 left-0 w-full px-4 grid grid-cols-[1fr_auto] items-end gap-3">
        <div className=" h-[56px] flex items-start pr-2 pl-0.5 max-w-[14rem]">
          <h3 className=" text-left max-w-[9rem] uppercase text-3xl leading-7 tracking-wide text-[#fdffe9] font-[family-name:var(--font-title)] drop-shadow-md">
            {title}
          </h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="bg-[#fdffe9] text-[#31380d] border-2 border-[#87a700] text-xs font-[family-name:var(--font-text)] font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full whitespace-nowrap shadow-sm hover:bg-[#87a700] hover:text-[#fdffe9] transition-colors">
          Je découvre
        </button>
      </div>
    </div>
  );
};
