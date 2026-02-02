import { CategoryCard } from "./CategoryCard";

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
    <section className="py-12">
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="mb-8 px-6 text-2xl text-left sm:text-3xl font-[family-name:var(--font-title)] font-extrabold text-[#31380d] uppercase">
            Nos catégories de matériel, prêtes à l’emploi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div className="mx-auto w-full max-w-[18rem]">
                <CategoryCard key={c.title} title={c.title} image={c.image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
