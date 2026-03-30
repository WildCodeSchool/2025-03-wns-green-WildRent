import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";

type ProductDescriptionProps = {
  title: string;
  brand: string;
  pricePerDay: number;
  reference: string;
  description: string;
  colors: string[];
  sizes: string[];
  image: string;
};

export default function ProductDetailsDescription({
  title,
  brand,
  pricePerDay,
  reference,
  description,
  colors,
  sizes,
  image,
}: Readonly<ProductDescriptionProps>) {


  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setStartDate(date);

  if (endDate && endDate < date) {
      setEndDate("");
    }
  }

  function handleAddToCart() {
    if (!color || !size || !startDate || !endDate) {
      setError("Veuillez remplir tous les champs avant d'ajouter le produit au panier");
      return;
    }
    addItem({
      productId: Number(reference),
      productName: title,
      productRef: reference,
      image,
      price: pricePerDay,
      color,
      size,
      startDate,
      endDate,
      quantity: 1,
    });
    navigate("/cart"); 
  }

  return (
    <section className="w-full text-left">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--dark-green)]">{title}</h1>
      <p className="mt-1 text-sm font-[family-name:var(--font-text)] text-[var(--light-green)]">{brand}</p>
      <p className="mt-2 text-2xl font-[family-name:var(--font-text)] font-bold text-[var(--dark-green)]">{pricePerDay}€/jour</p>
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

      {error && (
      <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-sm font-[family-name:var(--font-text)]"> {error}</div>
      )}

      <button 
      onClick={handleAddToCart}
      className={`mt-7 w-full rounded-xl py-4 font-bold text-white bg-[var(--light-green)] cursor-pointer`} >
        AJOUTER AU PANIER
      </button>

    </section>
  );
}
