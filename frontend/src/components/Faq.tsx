import { MoveRight } from "lucide-react";

const faqItems = [
  "Couverture casse",
  "Perte et vol",
  "Pas de caution",
  "Garantie des dépôts",
  "Retour des produits",
  "Échanges",
  "Remboursement",
];

export default function Faq() {
  return (
    <section className="bg-[var(--beige)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 font-title text-4xl leading-none tracking-wide text-[var(--dark-green)]">
          FAQ
        </h2>

        <div className="flex items-start gap-10">
          <div className="w-[440px] shrink-0 overflow-hidden rounded-xl">
            <img
              src="/images/Faq_image.png"
              alt="FAQ"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-6 flex w-full max-w-[840px] flex-col gap-5 -ml-56">
            {faqItems.map((label) => (
              <button
                key={label}
                type="button"
                className="
                  flex w-full items-center justify-between
                  rounded-3xl
                  bg-white
                  px-8 py-[10px]
                  text-left
                  shadow-[0_2px_10px_rgba(0,0,0,0.10)]
                  transition
                  hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                "
              >
                <span className="font-medium text-[color:rgba(49,56,13,0.78)]">
                  {label}
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--light-green)]">
                  <MoveRight size={18} strokeWidth={4} className="text-[var(--light-green)]" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
