import { Pencil, Trash2 } from "lucide-react";

const DEFAULT_VALUES = ["non renseigné", "0000000000", "00000"];

/** Returns true if the value is a default placeholder. */
function isDefault(value: string): boolean {
  return DEFAULT_VALUES.includes(value);
}

interface UserInfoCardProps {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  onEdit: () => void;
  onDeleteAccount: () => void;
}

export const UserInfoCard = ({
  firstname,
  lastname,
  email,
  address,
  postalCode,
  city,
  onEdit,
  onDeleteAccount,
}: UserInfoCardProps) => {
  const fields: { label: string; value: string }[] = [
    { label: "Nom", value: lastname },
    { label: "Prénom", value: firstname },
    { label: "Email", value: email },
    { label: "Adresse", value: address },
    { label: "Code postal", value: postalCode },
    { label: "Ville", value: city },
  ];

  return (
    <div className="w-full border border-[#87a700] rounded-2xl bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-title)] text-[#31380d] uppercase tracking-wide">
          Informations personnelles
        </h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-medium font-[family-name:var(--font-text)] bg-[#87a700] text-[#fdffe9] rounded-full hover:bg-[#31380d] transition-colors"
        >
          <Pencil size={12} />
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-8">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">
              {label}
            </p>
            <p className={`text-sm font-medium font-[family-name:var(--font-text)] ${
              isDefault(value)
                ? "text-[#acaf91] italic"
                : "text-[#31380d]"
            }`}>
              {isDefault(value) ? "À renseigner" : value}
            </p>
          </div>
        ))}
      </div>

      {/* Delete account */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onDeleteAccount}
          className="flex items-center gap-2 text-sm font-[family-name:var(--font-text)] text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} />
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};
