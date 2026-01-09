import { CategoryCard } from "./CategoryCard";
import {
  sectionContainer,
  innerWrapper,
  sectionTitle,
  gridContainer,
} from "./categoryGrid.styles";

type CategoryItem = {
  title: string;
  image: string;
};

const categories: CategoryItem[] = [
  { title: "Activités Outdoor", image: "/images/Cat activités outdoor.png" },
  { title: "Escalade", image: "/images/Cat escalade.png" },
  { title: "Sports aquatique", image: "/images/Cat sports aquatique.png" },
  { title: "Sports d’hiver", image: "/images/Cat sports d'hiver.png" },
  { title: "Camping", image: "/images/Cat camping.png" },
  { title: "Randonnée", image: "/images/Cat randonnée.png" },
];

export const CategoryGrid = () => {
  return (
    <section className={sectionContainer}>
      <div className={innerWrapper}>
        <h2 className={sectionTitle}>
          Nos catégories de matériel, prêtes à l’emploi
        </h2>

        <div className={gridContainer}>
          {categories.map((c) => (
            <CategoryCard key={c.title} title={c.title} image={c.image} />
          ))}
        </div>
      </div>
    </section>
  );
};
