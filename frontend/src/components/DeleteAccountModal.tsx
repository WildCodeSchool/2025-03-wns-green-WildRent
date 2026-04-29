import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, AlertTriangle, X } from "lucide-react";
import { DELETE_MY_ACCOUNT } from "../graphql/operations";
import { handleGraphQLError } from "../utils/handleGraphQLError";
import { toast } from "react-toastify";

interface DeleteAccountModalProps {
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteAccountModal = ({ onClose, onDeleted }: DeleteAccountModalProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteAccount, { loading }] = useMutation(DELETE_MY_ACCOUNT);

  const handleDelete = async () => {
    if (!password.trim()) return;

    try {
      const { data } = await deleteAccount({
        variables: { data: { password } },
      });

      if (data?.deleteMyAccount) {
        toast.success("Votre compte a été supprimé avec succès");
        onDeleted();
      }
    } catch (error: any) {
      handleGraphQLError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold font-[family-name:var(--font-title)] text-[#31380d] text-center mb-2">
          Supprimer votre compte
        </h2>

        {/* Warning message */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-[family-name:var(--font-text)] text-red-700 leading-relaxed">
            Cette action est <strong>irréversible</strong>. Toutes vos données
            personnelles, votre historique de commandes et vos informations de
            profil seront définitivement supprimés.
          </p>
        </div>

        {/* Password input */}
        <label className="block text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] mb-2">
          Confirmez votre mot de passe
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm font-[family-name:var(--font-text)] outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleDelete()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={!password.trim() || loading}
            className="flex-1 px-4 py-3 text-sm font-medium font-[family-name:var(--font-text)] text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Suppression..." : "Supprimer mon compte"}
          </button>
        </div>
      </div>
    </div>
  );
};
