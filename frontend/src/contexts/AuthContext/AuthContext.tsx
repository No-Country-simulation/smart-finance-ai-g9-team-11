import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getProfile,
  hasStoredToken,
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
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = useCallback(() => {
    logoutService();

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const checkAuth = useCallback(async () => {
    if (!hasStoredToken()) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const user = await getProfile();

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        await loginService(credentials);
        const user = await getProfile();

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        throw error;
      }
    },
    [],
  );

  const value = useMemo<AuthContextData>(
    () => ({
      ...state,
      login,
      logout,
      checkAuth,
    }),
    [state, login, logout, checkAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}