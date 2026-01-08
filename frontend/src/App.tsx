import "./App.css";
import { CategoryGrid } from "./components/CategoryCard/CategoryGrid";
import { Navbar } from "./components/Layout/Navbar";

function App() {
  return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
          <Navbar />
          <CategoryGrid />
        </div>
  );
}

export default App;
