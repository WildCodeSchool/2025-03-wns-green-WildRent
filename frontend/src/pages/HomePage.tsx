import { CategoryGrid } from "../components/CategoryGrid";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#fdffe9]">
      <Navbar />

      <main>
        <CategoryGrid />
      </main>

      <Footer />
    </div>
  );
};
