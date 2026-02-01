import { useState } from "react";

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


		<section className="w-full text-left ">

		<h1 className="text-3xl font-bold  font-[family-name:var(--font-title)] text-[var(--color-secondary)]"> {title} </h1>
		<p className="mt-1 text-sm  font-[family-name:var(--font-text)] text-[var(--color-secondary)]"> {brand}</p>
    <p className="mt-2 text-2xl font-bold  font-[family-name:var(--font-text)] text-[var(--color-secondary)]"> {pricePerDay}€/jour </p>
    <p className="mt-2 text-sm  font-[family-name:var(--font-text)] text-[var(--color-primary)]"> Ref: {ref}</p>
			
			<div className="mt-5 rounded-2xl bg-[var(--color-secondary)] p-5 font-[family-name:var(--font-text)] text-[var(--color-background)]">
				<h2 className="font-bold text-2xl uppercase  font-[family-name:var(--font-title)] text-[var(--color-background)]">DESCRIPTION PRODUIT</h2>
				<p className="mt-2 text-sm ">{description}</p>
			</div>

			<div className="mt-6">
				<label className="block text-sm font-[family-name:var(--font-text)] text-[var(--color-secondary)]">Sélectionner une couleur</label>
				<select
					value={color}
					onChange={(e) => setColor(e.target.value)}
					className="mt-2 w-full rounded-xl border border-[var(--color-secondary)] text-[var(--color-secondary)] px-4 py-3"
				>
					<option value="">Choisir une couleur</option>
				</select>
			</div>

			<div className="mt-5">
				<label className="block text-sm font-[family-name:var(--font-text)] text-[var(--color-secondary)]">Sélectionner une taille</label>
				<select
					value={size}
					onChange={(e) => setSize(e.target.value)}
					className="mt-2 w-full rounded-xl border text-[var(--color-secondary)] px-4 py-3"
				>
					<option value="">Choisir une taille</option>
				</select>
			</div>

			<button
				className="mt-6 w-full text-2xl rounded-xl bg-[#87a700] py-3 font-bold font-[family-name:var(--font-text)] text-[var(--color-background)] cursor-pointer"
			>
				AJOUTER AU PANIER
			</button>
		</section>
	);
}

	