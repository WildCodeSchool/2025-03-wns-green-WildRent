export default function BillingAddress() {
  return (
    <div className="rounded-2xl bg-[var(--dark-green)] text-white overflow-hidden">
      <div className="border-b border-white/20 px-6 py-5">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--beige)] ">
          Adresse de facturation
        </h2>
      </div>

      <div className="p-6 text-lg leading-9 text-[var(--beige)] ">
        <p>Nom Prénom</p>
        <p>Rue</p>
        <p>Code postal + ville</p>
        <p>Pays</p>
				<button className="mt-8 inline-flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[var(--dark-green)] cursor-pointer">
         Modifier
       </button>  
      </div>
    </div>
  );
}