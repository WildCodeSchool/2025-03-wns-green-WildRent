import "./App.css";
import { CategoryGrid } from "./components/CategoryGrid";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

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
