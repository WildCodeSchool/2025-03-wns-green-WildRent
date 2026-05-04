import { useNavigate } from "react-router";
import { useQuery } from "@apollo/client/react";
import { CategoryCard } from "./CategoryCard";
import { GET_ALL_CATEGORIES } from "../graphql/category.operations";

type Category = {
  id: string;
  name: string;
  image: string;
};

export const CategoryGrid = () => {
  const navigate = useNavigate();
  const { data, loading } = useQuery<{ getAllCategories: Category[] }>(GET_ALL_CATEGORIES);

  if (loading || !data) return null;

  const categories = data.getAllCategories;

  return (
    <section className="py-12">
      <div className="px-4 lg:px-3 xl:px-2">
        <div className="max-w-5xl mx-auto">
          <h2 className="mb-8 px-6 text-2xl text-left sm:text-3xl font-[family-name:var(--font-title)] font-extrabold text-[#31380d] uppercase">
            Nos catégories de matériel, prêtes à l’emploi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-4 xl:gap-x-0">
            {categories.map((c) => (
              <div key={c.id} className="mx-auto w-full max-w-[18rem] cursor-pointer" onClick={() => navigate(`/products?category=${c.id}`)}>
                <CategoryCard title={c.name} image={c.image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
