import { useParams } from "react-router";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_BY_ID } from "../graphql/operations";
import ProductDetailsCarousel from "../components/Product/ProductDetailsCarousel";
import ProductDetailsDescription from "../components/Product/ProductDetailsDescription";

type ProductVariant = {
  color: string;
  size: string;
  image: string;
};

type ProductData = {
  name: string;
  brand: string;
  price: number;
  productRef: string;
  image1?: string;
  image2?: string;
  image3?: string;
  description: string;
  productVariant: ProductVariant[];
};

export default function ProductDetailsPage() {
  const { id } = useParams();

  const { data,loading,error } = useQuery<{ getProductByRef: ProductData }>(GET_PRODUCT_BY_ID, {
    variables: { id: Number(id) },
  });

  if (error) return <p>Produit introuvable</p>;
  if (loading) return <p>Chargement...</p>;

  const product = data?.getProductByRef;

  if (!product) return <p>Produit introuvable</p>;

  const images = [product.image1, product.image2, product.image3].filter(Boolean) as string[];
  
  const variants = product.productVariant;
  const colors = [...new Set(variants.map((variant) => variant.color))];
  const sizes = [...new Set(variants.map((variant) => variant.size))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductDetailsCarousel images={images} productName={product.name} />
        <ProductDetailsDescription
          title={product.name}
          brand={product.brand}
          pricePerDay={product.price}
          reference={product.productRef}
          description={product.description}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

