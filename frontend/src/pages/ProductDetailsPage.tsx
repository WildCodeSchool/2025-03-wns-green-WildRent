import ProductDetailsCarousel from "../components/ProductDetails/ProductDetailsCarousel";
import ProductDetailsDescription from "../components/ProductDetails/ProductDetailsDescription";

export default function ProductDetailsPage() {

  const product = {
    title: "Snowboard Rossignol",
    brand: "Rossignol",
    pricePerDay: 10,
    reference: "9483838",
    description:
      "Snowboard stable et facile à manier, parfait pour profiter pleinement de chaque descente, que vous soyez débutant ou confirmé.",
    colors: ["Blanc"],
    sizes: ["38", "39", "40", "41", "42"],
    images: [
      "/images/Snowbard1.png",
      "/images/Snowboard2.png",
      "/images/Snowboard3.png",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <ProductDetailsCarousel
          images={product.images}
          productName={product.title}
        />

        <ProductDetailsDescription {...product} />

      </div>

    </div>
  );
}













