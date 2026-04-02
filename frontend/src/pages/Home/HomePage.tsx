import { CategoryGrid } from "../../components/CategoryGrid";
import { RentalProcess } from "../../components/RentalProcess";
import Faq from "../../components/Faq";
import Hero from "./Hero";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <RentalProcess />
      <CategoryGrid />
      <Faq />
    </>
  );
};
