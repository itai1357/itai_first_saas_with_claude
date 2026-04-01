export interface AuthUser {
  id: string;
  email?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  getToken: () => Promise<string | null>;
}
