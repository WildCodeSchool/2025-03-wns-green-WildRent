import React, { useState } from "react";

	type Props = {
		title: string;
		brand: string;
		pricePerDay: number;
		ref: string;
		description: string;
		colors: string[];
		sizes: string[];
	};
	
	export default function ProductDescription({
		title,
		brand,
		pricePerDay,
		ref,
		description,
		colors,
		sizes,
	}: Readonly<Props>) {
		const [color, setColor] = useState("");
		const [size, setSize] = useState("");
	
  return (

		<section className="w-full">
      <h1 className="text-3xl font-bold text-[var(--color-secondary)]">{title}</h1>
      <p className="mt-1 text-sm text-[var(--color-secondary)]">{brand}</p>
      <p className="mt-2 text-2xl font-bold [var(--color-secondary)]">{pricePerDay}€/jour</p>
      <p className="mt-2 text-sm text-[var(--color-primary)]">Ref: {ref}</p>

      <div className="mt-5 rounded-2xl bg-[var(--color-secondary)] p-5 text-[[var(--color-background)]">
        <h2 className="font-bold uppercase text-[[var(--color-background)]">DESCRIPTION PRODUIT</h2>
        <p className="mt-2 text-sm ">{description}</p>
      </div>

      <div className="mt-6">
        <label className="block text-sm text-[#31380d]">Sélectionner une couleur</label>
        <select
          value={colors}
          onChange={(e) => setColor(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--color-secondary)] bg-white px-4 py-3"
        >
          <option value="">Choisir une couleur</option>
        </select>
      </div>

      <div className="mt-5">
        <label className="block text-sm text-[var(--color-secondary)]">Sélectionner une taille</label>
        <select
          value={sizes}
          onChange={(e) => setSize(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--color-secondary)] bg-white px-4 py-3"
        >
          <option value="">Choisir une taille</option>
        </select>
      </div>

      <button
        disabled={!color || !size}
        className="mt-6 w-full rounded-xl bg-[#87a700] py-3 font-bold text-[#fdffe9] disabled:opacity-50"
      >
        AJOUTER AU PANIER
      </button>
    </section>
  );
}

	