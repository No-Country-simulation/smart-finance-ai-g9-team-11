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
  createContext<AuthContextData | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

const ANONYMOUS_STATE: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export function AuthContextProvider({
  children,
}: Readonly<AuthProviderProps>) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = useCallback((): void => {
    logoutService();

    setState(ANONYMOUS_STATE);
  }, []);

  const checkAuth =
    useCallback(async (): Promise<void> => {
      if (!hasStoredToken()) {
        setState(ANONYMOUS_STATE);
        return;
      }

      setState((currentState) => ({
        ...currentState,
        isLoading: true,
      }));

      try {
        const user = await getProfile();

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        logoutService();

        setState(ANONYMOUS_STATE);
      }
    }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (
      credentials: LoginRequest,
    ): Promise<void> => {
      setState((currentState) => ({
        ...currentState,
        isLoading: true,
      }));

      try {
        await loginService(credentials);

        const user = await getProfile();

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        logoutService();

        setState(ANONYMOUS_STATE);

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
    [
      state,
      login,
      logout,
      checkAuth,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}