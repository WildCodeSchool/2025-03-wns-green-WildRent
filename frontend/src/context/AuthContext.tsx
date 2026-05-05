import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { LOGIN, LOGOUT, WHO_AM_I } from "../graphql/operations";
import { handleGraphQLError } from "../utils/handleGraphQLError";
import { toast } from "react-toastify";

type AuthUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address?: string;
  postalCode?: string;
  city?: string;
  avatar?: string;
  role: { roleName: string };
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const { data: whoAmIData, loading, refetch } = useQuery<{ whoAmI: AuthUser }>(WHO_AM_I, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (whoAmIData?.whoAmI) {
      setUser(whoAmIData.whoAmI);
    }
  }, [whoAmIData]);

  const [loginMutation] = useMutation<{ login: AuthUser }>(LOGIN);
  const [logoutMutation] = useMutation<{ logout: boolean }>(LOGOUT);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await loginMutation({
        variables: { data: { mail: email, password } },
      });

      if (data?.login) {
        const { data: refetchData } = await refetch();
        if (refetchData?.whoAmI) {
          setUser(refetchData.whoAmI);
        }
        toast.success("Bienvenue !");
        return true;
      }
      return false;
    } catch (error: unknown) {
      handleGraphQLError(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
      toast.success("Vous avez été déconnecté");
    } catch (error: unknown) {
      handleGraphQLError(error);
    }
  };

  const refetchUser = async () => {
    const { data } = await refetch();
    if (data?.whoAmI) {
      setUser(data.whoAmI);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
