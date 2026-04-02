import { CheckSquare, Home, Wrench } from "lucide-react";

export const RentalProcess = () => {
  const steps = [
    {
      icon: <CheckSquare size={26} strokeWidth={2.5} />,
      title: "RESERVATION RAPIDE",
      description:
        "Réservez en ligne en quelques clics grâce à une interface claire, simple et intuitive. Gagnez du temps avant votre départ.",
    },
    {
      icon: <Home size={26} strokeWidth={2.5} />,
      title: "RETRAIT EN BOUTIQUE",
      description:
        "Votre matériel vous attend dans notre point de retrait. Plus besoin de chercher ou d'attendre : vous arrivez, vous récupérez, vous partez équipé(e) !",
    },
    {
      icon: <Wrench size={26} strokeWidth={2.5} />,
      title: "MATERIEL VERIFIE",
      description:
        "Chaque produit est soigneusement contrôlé, nettoyé et préparé après chaque location. Vous partez l’esprit tranquille, avec du matériel fiable et prêt à l’emploi.",
    },
  ];

  return (
    <section className="bg-[var(--beige)] py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="mb-10 text-2xl sm:text-3xl font-[family-name:var(--font-title)] font-extrabold text-[var(--dark-green)] uppercase">
          Louez simplement
        </h2>
        <p className="max-w-5xl text-[15px] sm:text-[16px] leading-relaxed font-[family-name:var(--font-text)] text-[var(--dark-green)] opacity-90 mb-12">
          Chez Wildrent, on a pensé chaque étape pour que vous puissiez vous concentrer sur l’essentiel, vivre pleinement vos activités, sans
          stress ni perte de temps.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[var(--dark-green)] text-[var(--beige)] rounded-md px-6 py-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-[var(--light-green)]">{step.icon}</div>

                <h3 className="font-[family-name:var(--font-title)] text-[23px] font-bold tracking-[1.5px] uppercase text-[var(--beige)] leading-[1.1]">
                  {step.title}
                </h3>
              </div>
              <p className="text-[14px] font-[family-name:var(--font-text)] text-[var(--beige)] opacity-85 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
