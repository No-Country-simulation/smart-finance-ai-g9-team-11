export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextData extends AuthState {
  login: (
    credentials: LoginRequest,
  ) => Promise<void>;

  logout: () => void;

  checkAuth: () => Promise<void>;
}