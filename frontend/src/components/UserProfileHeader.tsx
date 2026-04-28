import { User } from "lucide-react";

interface UserProfileHeaderProps {
  firstname: string;
  lastname: string;
  avatar?: string;
  activeTab: "info" | "orders";
  onTabChange: (tab: "info" | "orders") => void;
}

export const UserProfileHeader = ({
  firstname,
  lastname,
  avatar,
  activeTab,
  onTabChange,
}: UserProfileHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#acaf91] flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={22} className="text-[#fdffe9] sm:hidden" />
          )}
          {!avatar && <User size={28} className="text-[#fdffe9] hidden sm:block" />}
        </div>

        {firstname !== "non renseigné" || lastname !== "non renseigné" ? (
          <p className="text-base sm:text-lg font-semibold font-[family-name:var(--font-text)] text-[#31380d]">
            {firstname} {lastname}
          </p>
        ) : (
          <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#87a700]">
            Complétez votre profil
          </p>
        )}
      </div>

      <div className="flex rounded-lg overflow-hidden border border-[#31380d] self-start sm:self-auto">
        <button
          onClick={() => onTabChange("info")}
          className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium font-[family-name:var(--font-text)] transition-colors ${
            activeTab === "info"
              ? "bg-[#31380d] text-[#fdffe9]"
              : "bg-[#fdffe9] text-[#31380d] hover:bg-[#acaf91]/20"
          }`}
        >
          Informations personnelles
        </button>
        <button
          onClick={() => onTabChange("orders")}
          className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium font-[family-name:var(--font-text)] transition-colors border-l border-[#31380d] ${
            activeTab === "orders"
              ? "bg-[#31380d] text-[#fdffe9]"
              : "bg-[#fdffe9] text-[#31380d] hover:bg-[#acaf91]/20"
          }`}
        >
          Mes commandes
        </button>
      </div>
    </div>
  );
};
