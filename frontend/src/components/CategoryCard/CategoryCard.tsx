import React from "react";
import {
  cardContainer,
  cardImage,
  cardOverlay,
  contentWrapper,
  titleWrapper,
  titleText,
  discoverButton,
} from "./categoryCard.styles";

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
    <div className={cardContainer}>
      <img src={image} alt={title} className={cardImage} />

      <div className={cardOverlay} />

      <div className={contentWrapper}>
        <div className={titleWrapper}>
          <h3 className={titleText}>{title}</h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={discoverButton}
        >
          Je découvre
        </button>
      </div>
    </div>
  );
};
