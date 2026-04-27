import { Pencil } from "lucide-react";

interface UserInfoCardProps {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  onEdit: () => void;
}

export const UserInfoCard = ({
  firstname,
  lastname,
  email,
  address,
  postalCode,
  city,
  onEdit,
}: UserInfoCardProps) => {
  return (
    <div className="w-full border border-[#87a700] rounded-2xl bg-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold font-[family-name:var(--font-title)] text-[#31380d] uppercase tracking-wide">
          Informations personnelles
        </h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium font-[family-name:var(--font-text)] bg-[#87a700] text-[#fdffe9] rounded-full hover:bg-[#31380d] transition-colors"
        >
          <Pencil size={12} />
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-5 gap-x-8">
        <div>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">Nom</p>
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">{lastname}</p>
        </div>
        <div>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">Prénom</p>
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">{firstname}</p>
        </div>
        <div>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">Email</p>
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">{email}</p>
        </div>
        <div>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">Adresse</p>
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">{address}</p>
        </div>
        <div>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">Code postal</p>
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">{postalCode}</p>
        </div>
        <div>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1">Ville</p>
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">{city}</p>
        </div>
      </div>
    </div>
  );
};
