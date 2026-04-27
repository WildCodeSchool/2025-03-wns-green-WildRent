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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-full bg-[#acaf91] flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={28} className="text-[#fdffe9]" />
          )}
        </div>

        <p className="text-lg font-semibold font-[family-name:var(--font-text)] text-[#31380d]">
          {firstname} {lastname}
        </p>
      </div>

      <div className="flex rounded-lg overflow-hidden border border-[#31380d]">
        <button
          onClick={() => onTabChange("info")}
          className={`px-4 py-2 text-xs font-medium font-[family-name:var(--font-text)] transition-colors ${
            activeTab === "info"
              ? "bg-[#31380d] text-[#fdffe9]"
              : "bg-[#fdffe9] text-[#31380d] hover:bg-[#acaf91]/20"
          }`}
        >
          Informations personnelles
        </button>
        <button
          onClick={() => onTabChange("orders")}
          className={`px-4 py-2 text-xs font-medium font-[family-name:var(--font-text)] transition-colors border-l border-[#31380d] ${
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
