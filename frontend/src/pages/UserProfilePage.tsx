import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_USER_BY_ID } from "../graphql/operations";
import { UserProfileHeader } from "../components/UserProfileHeader";
import { UserInfoCard } from "../components/UserInfoCard";
import { UserEditForm } from "../components/UserEditForm";
import type { User } from "../types/user.types";

export const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { data, loading, error } = useQuery<{ getUserById: User }>(GET_USER_BY_ID, {
    variables: { getUserByIdId: 20 },
  });

  if (loading) {
    return (
      <section className="flex justify-center px-4 py-12">
        <p className="text-sm font-[family-name:var(--font-text)] text-[#acaf91]">
          Chargement...
        </p>
      </section>
    );
  }

  if (error || !data?.getUserById) {
    return (
      <section className="flex justify-center px-4 py-12">
        <p className="text-sm font-[family-name:var(--font-text)] text-red-500">
          Impossible de charger le profil utilisateur.
        </p>
      </section>
    );
  }

  const user = currentUser ?? data.getUserById;

  return (
    <section className="flex justify-center px-4 py-12">
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
            firstname={user.firstname}
            lastname={user.lastname}
            email={user.email}
            address={user.address}
            postalCode={user.postalCode}
            city={user.city}
            onEdit={() => setIsEditing(true)}
          />
        )}

        {activeTab === "info" && isEditing && (
          <UserEditForm
            user={user}
            onCancel={() => setIsEditing(false)}
            onSuccess={(updatedUser) => {
              setCurrentUser(updatedUser);
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </section>
  );
};
