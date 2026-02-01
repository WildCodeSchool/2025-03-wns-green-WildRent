import "./App.css";
import { CategoryGrid } from "./components/CategoryCard/CategoryGrid";
import ProductDescription from "./pages/ProductDetailsPage"

function App() {
  return (
    <>
        {/* <div className="max-w-4xl mx-auto mt-10 px-4">
          <CategoryGrid />
        </div> */}
        <div>
          <ProductDescription 
          title="Snow board Rossignol"
          brand="Salomon"
          pricePerDay={10}
          ref="9483838"
          description="Ces chaussures de randonnée robustes et confortables sont parfaites pour toutes vos aventures en plein air. Elles offrent un excellent maintien de la cheville et une adhérence optimale sur tous les terrains."
          colors={["Noir", "Blanc"]}
          sizes={["150", "155", "160"]}/>
        </div>
        </>
  );
}

export default App;
