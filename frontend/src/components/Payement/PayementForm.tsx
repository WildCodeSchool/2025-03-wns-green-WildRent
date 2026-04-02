import { useState } from "react";

type PaymentFormData = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardName: string;
};

export default function PaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="rounded-2xl bg-[var(--dark-green)] text-white overflow-hidden">
      
      <div className="flex items-center justify-between border-b border-white/20 px-6 py-5">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--beige)]">
          Paiement
        </h1>
      </div>

      <div className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 lg:flex-row"
        >

          <div className="w-full max-w-md rounded-2xl bg-[var(--beige)] p-5 text-black">
            <div className="flex flex-col gap-4">

              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-2 block font-semibold text-[var(--dark-green)]"
                >
                  Numéro de carte
                </label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-lg border border-gray-400 px-4 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry"
                    className="mb-2 block font-semibold text-[var(--dark-green)]"
                  >
                    Exp
                  </label>
                  <input
                    id="expiry"
                    name="expiry"
                    type="text"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    className="w-full rounded-lg border border-gray-400 px-4 py-2 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvc"
                    className="mb-2 block font-semibold text-[var(--dark-green)]"
                  >
                    CVC / CCV
                  </label>
                  <input
                    id="cvc"
                    name="cvc"
                    type="text"
                    value={formData.cvc}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full rounded-lg border border-gray-400 px-4 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="mb-2 block font-semibold text-[var(--dark-green)]"
                >
                  Nom sur la carte
                </label>
                <input
                  id="cardName"
                  name="cardName"
                  type="text"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Nom Prénom"
                  className="w-full rounded-lg border border-gray-400 px-4 py-2 outline-none"
                />
              </div>

            </div>
          </div>

          <div className="flex max-w-md flex-col gap-6 text-white">

            <div className="flex items-start gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                i
              </div>

              <p className="text-sm leading-relaxed text-[var(--beige)]">
                Le paiement se fait sur les serveurs de votre banque. Wild Rent
                n’a pas accès à vos données bancaires.
              </p>
            </div>

            <div className="flex items-center gap-4 pl-16">
              <img
                src="/images/visa.png"
                alt="Visa"
                className="h-8 w-auto object-contain"
              />
              <img
                src="/images/cb.png"
                alt="CB"
                className="h-8 w-auto object-contain"
              />
            </div>

          </div>

        </form>
      </div>
    </section>
  );
}