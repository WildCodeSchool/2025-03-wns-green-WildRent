import { useState } from "react";

type Props = {
  title: string;
  brand: string;
  pricePerDay: number;
  reference: string;
  description: string;
  colors: string[];
  sizes: string[];
};

export default function ProductDetailsDescription({
  title,
  brand,
  pricePerDay,
  reference,
  description,
  colors,
  sizes,
}: Readonly<Props>) {


  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().slice(0, 10);


  const isDisabled = !color || !size || !startDate || !endDate;


  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setStartDate(date);


    if (endDate && endDate < date) {
      setEndDate("");
    }
  }

  // function handleAddToCart() {
  //   toast.success(`Ajouté au panier : ${title}`);
  // }

  return (
    <section className="w-full text-left">


      <h1 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--color-secondary)]">
        {title}
      </h1>

      <p className="mt-1 text-sm text-[var(--color-secondary)]">
        {brand}
      </p>

      <p className="mt-2 text-2xl font-bold text-[var(--color-secondary)]">
        {pricePerDay}€/jour
      </p>

      <p className="mt-2 text-sm text-[var(--color-primary)]">
        Réf: {reference}
      </p>

      <div className="mt-6 rounded-xl bg-[var(--color-secondary)] p-6 text-[var(--color-background)]">
        <h2 className="font-bold text-xl uppercase">
          Description produit
        </h2>

        <p className="mt-3 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold mb-2">
          Sélectionner une couleur
        </label>

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Choisir une couleur</option>

          {colors.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-semibold mb-2">
          Sélectionner une taille
        </label>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Choisir une taille</option>

          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Début de location
          </label>

          <input
            type="date"
            value={startDate}
            min={today}
            onChange={handleStartDateChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Fin de location
          </label>

          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>
      </div>

      <button
        disabled={isDisabled}
        className={`mt-7 w-full rounded-xl py-4 font-bold text-white transition
          ${isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#87a700] hover:bg-[#6f8800]"
          }
        `}
      >
        AJOUTER AU PANIER
      </button>

    </section>
  );
}
