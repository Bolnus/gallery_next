"use client";
import React from "react";
import { useQuery } from "react-query";
import { validateAuth } from "../../../shared/api/auth/auth";

interface AuthContextType {
  user: string;
  setUser: (newUser: string) => void;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Readonly<React.PropsWithChildren>): JSX.Element {
  const [user, setUser] = React.useState<string>("");

  const { isLoading: isUserDataLoading } = useQuery({
    queryKey: "get-user",
    queryFn: validateAuth,
    onSuccess: (userData) => setUser(userData?.data?.user || ""),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false
  });

  return (
    <AuthContext.Provider value={{ user, isLoading: isUserDataLoading, setUser }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
