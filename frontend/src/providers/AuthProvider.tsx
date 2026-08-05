import type { ReactNode } from "react";

import { AuthContextProvider } from "@/contexts/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: Readonly<AuthProviderProps>) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
}