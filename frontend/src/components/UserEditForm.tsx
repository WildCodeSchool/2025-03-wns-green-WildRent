import { useState, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { Camera, User } from "lucide-react";
import { UPDATE_MY_PROFILE } from "../graphql/operations";
import type { User as UserType, UpdateUserInput } from "../types/user.types";
import { handleGraphQLError } from "../utils/handleGraphQLError";

interface UserEditFormProps {
  user: UserType;
  onCancel: () => void;
  onSuccess: (updatedUser: UserType) => void;
}

export const UserEditForm = ({ user, onCancel, onSuccess }: UserEditFormProps) => {
  const [formData, setFormData] = useState<UpdateUserInput>({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address,
    postalCode: user.postalCode,
    city: user.city,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateMyProfile, { loading }] = useMutation<{ updateMyProfile: UserType }>(UPDATE_MY_PROFILE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPG, PNG ou WebP.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;

    const body = new FormData();
    body.append("avatar", avatarFile);

    const apiUrl = import.meta.env.VITE_API_URL ?? "";
    const res = await fetch(`${apiUrl}/api/upload/avatar/${user.id}`, {
      method: "POST",
      body,
      credentials: "include",
    });

    const data = await res.json();
    return data.avatar ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (!uploadedUrl) {
          toast.error("Erreur lors de l'upload de l'image");
          return;
        }
      }

      const { data } = await updateMyProfile({
        variables: { data: formData },
      });
      if (data?.updateMyProfile) {
        if (avatarPreview) data.updateMyProfile.avatar = avatarPreview;
        toast.success("Profil mis à jour avec succès !");
        onSuccess(data.updateMyProfile);
      }
    } catch (error: any) {
      handleGraphQLError(error);
    }
  };

  const fields: { name: keyof UpdateUserInput; label: string }[] = [
    { name: "lastname", label: "Nom" },
    { name: "firstname", label: "Prénom" },
    { name: "email", label: "Email" },
    { name: "address", label: "Adresse" },
    { name: "postalCode", label: "Code postal" },
    { name: "city", label: "Ville" },
  ];

  return (
    <div className="w-full border border-[#87a700] rounded-2xl bg-white p-5 sm:p-8">
      <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-title)] text-[#31380d] uppercase tracking-wide mb-5 sm:mb-6">
        Modifier mes informations
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 shrink-0 rounded-full bg-[#acaf91] flex items-center justify-center overflow-hidden cursor-pointer relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#fdffe9]" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">
              {avatarFile ? "Image sélectionnée" : "Changer la photo"}
            </p>
            <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91]">
              Cliquez sur l'image
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-8 mb-5 sm:mb-6">
          {fields.map(({ name, label }) => (
            <div key={name}>
              <label className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1 block">
                {label}
              </label>
              <input
                type={name === "email" ? "email" : "text"}
                name={name}
                value={formData[name] ?? ""}
                onChange={handleChange}
                className="w-full text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] border border-[#acaf91] rounded-lg px-3 py-2 focus:outline-none focus:border-[#87a700]"
              />
            </div>
          ))}
        </div>


        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium font-[family-name:var(--font-text)] text-[#31380d] border border-[#31380d] rounded-full hover:bg-[#acaf91]/20 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-medium font-[family-name:var(--font-text)] bg-[#87a700] text-[#fdffe9] rounded-full hover:bg-[#31380d] transition-colors disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};
