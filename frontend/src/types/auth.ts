export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthUser {
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextData extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}