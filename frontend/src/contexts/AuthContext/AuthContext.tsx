import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getAuthenticatedUser,
  login as loginService,
  logout as logoutService,
} from "@/services/auth.service";

import type {
  AuthContextData,
  AuthState,
  LoginRequest,
} from "@/types/auth";

export const AuthContext =
  createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({
  children,
}: Readonly<AuthProviderProps>) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = getAuthenticatedUser();

    setState({
      user,
      token: null,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      const user = await loginService(credentials);

      setState({
        user,
        token: null,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    logoutService();

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const value = useMemo<AuthContextData>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}