import { CategoryGrid } from "../components/CategoryGrid";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdffe9]">
      <Navbar />

      <main className="flex-1">
        <CategoryGrid />
      </main>

      <Footer />
    </div>
  );
};
