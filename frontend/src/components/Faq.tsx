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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-10 font-title text-4xl leading-none tracking-wide text-[var(--dark-green)]">
          FAQ
        </h2>

        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-start">
          {/* image */}
          <div className="w-full shrink-0 overflow-hidden rounded-xl lg:w-[440px]">
            <img
              src="/images/Faq_image.png"
              alt="FAQ"
              className="h-[400px] w-full object-cover object-center lg:h-full"
            />
          </div>

          {/* FAQ items */}
          <div className="static flex w-full flex-col gap-4 lg:absolute lg:top-1/2 lg:left-[300px] lg:w-[700px] lg:-translate-y-1/2">
            {faqItems.map((label) => (
              <button
                key={label}
                type="button"
                className="flex w-full items-center justify-between rounded-3xl bg-white px-5 py-3 text-left shadow-[0_2px_10px_rgba(0,0,0,0.10)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] sm:px-6"
              >
                <span className="font-medium text-[color:rgba(49,56,13,0.78)]">
                  {label}
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--light-green)]">
                  <MoveRight
                    size={18}
                    strokeWidth={4}
                    className="text-[var(--light-green)]"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}