import "./App.css";
import { CategoryGrid } from "./components/CategoryCard/CategoryGrid";
import { Footer } from "./components/Layout/Footer/Footer";
import { Navbar } from "./components/Layout/Navbar/Navbar";

function App() {
  return (
        <>
          <Navbar />
          <CategoryGrid />
          <Footer />
        </>
  );
}

export default App;
