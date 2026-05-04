import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { GET_AVAILABLE_STOCK } from "../../graphql/ProductVariantOperations";
import { getEffectiveDiscount } from "../../utils/getEffectiveDiscount";

type ProductDescriptionProps = {
  productId: number;
  title: string;
  brand: string;
  pricePerDay: number;
  productDiscount: number;
  reference: string;
  description: string;
  colors: string[];
  sizes: string[];
  image: string;
  variants: { id: number; color: string; size: string; quantity: number; discount: number }[];
};

export default function ProductDetailsDescription({
  productId,
  title,
  brand,
  pricePerDay,
  productDiscount,
  reference,
  description,
  colors,
  sizes,
  image,
  variants,
}: Readonly<ProductDescriptionProps>) {

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const selectedVariant = variants.find(
    (v) => v.color === color && v.size === size
  );

  const { data: availableStockData } = useQuery<{ getAvailableStock: number }>(
    GET_AVAILABLE_STOCK,
    {
      variables: {
        productVariantId: selectedVariant?.id,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
      },
      skip: !selectedVariant || !startDate || !endDate,
    }
  );

  const availableStock = availableStockData?.getAvailableStock ?? 0;

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setStartDate(date);

    if (endDate && endDate < date) {
      setEndDate("");
    }
  }

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!color || !size || !startDate || !endDate) {
      setError("Veuillez remplir tous les champs avant d'ajouter le produit au panier");
      return;
    }

    if (!selectedVariant) {
      setError("Cette combinaison couleur/taille n'est pas disponible");
      return;
    }

    const quantityInCart = items
      .filter((i) => i.variantId === selectedVariant.id && i.startDate === startDate && i.endDate === endDate)
      .reduce((sum, i) => sum + i.quantity, 0);
    if (quantityInCart >= availableStock) {
      setError(
        availableStock === 0
          ? "Aucune disponibilité pour ces dates, choisissez d'autres dates"
          : `Stock maximum atteint (${availableStock} disponible${availableStock > 1 ? "s" : ""} sur cette période)`
      );
      return;
    }

    setError("");

    try {
      await addItem({
        productVariantId: selectedVariant.id,
        quantity: 1,
        startDate,
        endDate,
      });
      navigate("/cart");
    } catch {
      setError("Erreur lors de l'ajout au panier");
    }
  }

  const isUnavailable = !!selectedVariant && !!startDate && !!endDate && availableStock === 0;

  const effectiveDiscount = selectedVariant
    ? getEffectiveDiscount(productDiscount, selectedVariant.discount)
    : productDiscount;
  const hasDiscount = effectiveDiscount > 0;
  const discountedPrice = hasDiscount ? Math.round(pricePerDay * (1 - effectiveDiscount / 100)) : pricePerDay;

  return (
    <section className="w-full text-left">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--dark-green)]">{title}</h1>
      <p className="mt-1 text-sm font-[family-name:var(--font-text)] text-[var(--light-green)]">{brand}</p>
      <div className="mt-2 flex items-center gap-3">
        {hasDiscount ? (
          <>
            <p className="text-2xl font-[family-name:var(--font-text)] font-bold text-[var(--dark-green)]">{discountedPrice}€/jour</p>
            <span className="relative text-sm text-gray-400 font-[family-name:var(--font-text)]">
              {pricePerDay}€
              <span className="absolute left-0 top-1/2 w-full h-[2px] bg-red-500 -rotate-12" />
            </span>
            <span className="text-xs font-bold font-[family-name:var(--font-text)] text-white bg-[#87a700] px-2 py-0.5 rounded-full">
              -{effectiveDiscount}%
            </span>
          </>
        ) : (
          <p className="text-2xl font-[family-name:var(--font-text)] font-bold text-[var(--dark-green)]">{pricePerDay}€/jour</p>
        )}
      </div>
      <p className="mt-2 text-sm font-[family-name:var(--font-text)] text-[var(--light-green)]">Réf: {reference}</p>

      <div className="mt-6 rounded-xl bg-[var(--dark-green)] p-6 text-[var(--beige)]">
        <h2 className="font-bold text-xl font-[family-name:var(--font-title)] uppercase">Description produit</h2>
        <p className="mt-3 text-sm font-[family-name:var(--font-text)] ">{description}</p>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-[family-name:var(--font-text)] mb-2">Sélectionner une couleur</label>

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Choisir une couleur</option>

          {colors.map((color) => (
            <option key={color}>{color}</option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-[family-name:var(--font-text)] mb-2"> Sélectionner une taille </label>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Choisir une taille</option>

          {sizes.map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className="block text-sm font-[family-name:var(--font-text)] mb-2"> Début de location </label>

          <input
            type="date"
            value={startDate}
            min={today}
            onChange={handleStartDateChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-[family-name:var(--font-text)] mb-2"> Fin de location </label>

          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>
      </div>
      {isUnavailable && (
        <p className="mt-4 text-sm font-[family-name:var(--font-text)] text-red-600">
          Indisponible pour ces dates
       </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-sm font-[family-name:var(--font-text)]"> {error}</div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isUnavailable}
        className="mt-7 w-full rounded-xl py-4 font-bold text-white bg-[var(--light-green)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        AJOUTER AU PANIER
      </button>

    </section>
  );
}