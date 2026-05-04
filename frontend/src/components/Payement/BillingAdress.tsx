import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../context/AuthContext";
import { UPDATE_MY_PROFILE } from "../../graphql/operations";
import { toast } from "react-toastify";

const DEFAULT_VALUES = ["non renseigné", "0000000000", "00000", ""];

function isFilledIn(value: string | undefined): boolean {
  return !!value && !DEFAULT_VALUES.includes(value);
}

type BillingAddressProps = {
  onValidityChange: (isValid: boolean) => void;
};

export default function BillingAddress({ onValidityChange }: BillingAddressProps) {
  const { user, refetchUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateProfile] = useMutation(UPDATE_MY_PROFILE);

  const [formData, setFormData] = useState({
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    postalCode: user?.postalCode ?? "",
    city: user?.city ?? "",
  });

  const isBillingComplete =
    isFilledIn(user?.firstname) &&
    isFilledIn(user?.lastname) &&
    isFilledIn(user?.email) &&
    isFilledIn(user?.address) &&
    isFilledIn(user?.postalCode) &&
    isFilledIn(user?.city);

  useEffect(() => {
    onValidityChange(isBillingComplete);
  }, [isBillingComplete, onValidityChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.address || !formData.postalCode || !formData.city) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    try {
      await updateProfile({ variables: { data: formData } });
      await refetchUser();
      setIsModalOpen(false);
      toast.success("Adresse de facturation mise à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const openModal = () => {
    setFormData({
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      address: user?.address ?? "",
      postalCode: user?.postalCode ?? "",
      city: user?.city ?? "",
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="rounded-2xl bg-[var(--dark-green)] text-white overflow-hidden">
        <div className="border-b border-white/20 px-6 py-5">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--beige)]">
            Adresse de facturation
          </h2>
        </div>

        <div className="p-6 text-[var(--beige)]">
          {isBillingComplete ? (
            <div className="flex flex-col gap-2 text-sm font-[family-name:var(--font-text)]">
              <p><span className="text-[var(--light-green)]">Nom :</span> {user!.lastname}</p>
              <p><span className="text-[var(--light-green)]">Prénom :</span> {user!.firstname}</p>
              <p><span className="text-[var(--light-green)]">Email :</span> {user!.email}</p>
              <p><span className="text-[var(--light-green)]">Adresse :</span> {user!.address}</p>
              <p><span className="text-[var(--light-green)]">Code postal :</span> {user!.postalCode}</p>
              <p><span className="text-[var(--light-green)]">Ville :</span> {user!.city}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-sm font-[family-name:var(--font-text)]">
              <p className="text-red-300 mb-2">
                Veuillez compléter vos informations pour passer commande.
              </p>
              <p><span className="text-[var(--light-green)]">Nom :</span> {isFilledIn(user?.lastname) ? user!.lastname : <span className="italic text-[#acaf91]">À renseigner</span>}</p>
              <p><span className="text-[var(--light-green)]">Prénom :</span> {isFilledIn(user?.firstname) ? user!.firstname : <span className="italic text-[#acaf91]">À renseigner</span>}</p>
              <p><span className="text-[var(--light-green)]">Email :</span> {isFilledIn(user?.email) ? user!.email : <span className="italic text-[#acaf91]">À renseigner</span>}</p>
              <p><span className="text-[var(--light-green)]">Adresse :</span> {isFilledIn(user?.address) ? user!.address : <span className="italic text-[#acaf91]">À renseigner</span>}</p>
              <p><span className="text-[var(--light-green)]">Code postal :</span> {isFilledIn(user?.postalCode) ? user!.postalCode : <span className="italic text-[#acaf91]">À renseigner</span>}</p>
              <p><span className="text-[var(--light-green)]">Ville :</span> {isFilledIn(user?.city) ? user!.city : <span className="italic text-[#acaf91]">À renseigner</span>}</p>
            </div>
          )}

          <button
            onClick={openModal}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[var(--dark-green)] cursor-pointer"
          >
            Modifier
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold font-[family-name:var(--font-title)] text-[var(--dark-green)] mb-4">
              Modifier l'adresse de facturation
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-[family-name:var(--font-text)] text-gray-600">Prénom</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-[family-name:var(--font-text)] text-gray-600">Nom</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-[family-name:var(--font-text)] text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-[family-name:var(--font-text)] text-gray-600">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-[family-name:var(--font-text)] text-gray-600">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-[family-name:var(--font-text)] text-gray-600">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[var(--light-green)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
