import { CategoryGrid } from "../../components/CategoryGrid";
import { RentalProcess } from "../../components/RentalProcess";
import Hero from "./Hero";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <RentalProcess />
      <CategoryGrid />
    </>
  );
};
