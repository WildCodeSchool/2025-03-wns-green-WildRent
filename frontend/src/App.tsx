import "./App.css";
import { CategoryGrid } from "./components/CategoryCard/CategoryGrid";
import { Footer } from "./components/Layout/Footer/Footer";
import { Navbar } from "./components/Layout/Navbar/Navbar";

function App() {
  return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
          <Navbar />
          <CategoryGrid />
          <Footer />
        </div>
  );
}

export default App;
