import { useState } from "react";
import { UserProfileHeader } from "../components/UserProfileHeader";
import { UserInfoCard } from "../components/UserInfoCard";
import { UserEditForm } from "../components/UserEditForm";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/user.types";

export const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [isEditing, setIsEditing] = useState(false);
  const { user, refetchUser } = useAuth();

  if (!user) return null;

  const profileUser: User = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address ?? "",
    postalCode: user.postalCode ?? "",
    city: user.city ?? "",
    avatar: user.avatar,
  };

  return (
    <section className="flex justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        <UserProfileHeader
          firstname={user.firstname}
          lastname={user.lastname}
          avatar={user.avatar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "info" && !isEditing && (
          <UserInfoCard
            firstname={profileUser.firstname}
            lastname={profileUser.lastname}
            email={profileUser.email}
            address={profileUser.address}
            postalCode={profileUser.postalCode}
            city={profileUser.city}
            onEdit={() => setIsEditing(true)}
          />
        )}

        {activeTab === "info" && isEditing && (
          <UserEditForm
            user={profileUser}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => {
              refetchUser();
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </section>
  );
};
