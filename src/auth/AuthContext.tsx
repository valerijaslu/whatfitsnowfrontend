import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { http } from "@/api/http";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/auth/tokenStorage";

type AuthUser = {
  email?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const maybe = data as Record<string, unknown>;
  const token =
    (typeof maybe.token === "string" && maybe.token) ||
    (typeof maybe.accessToken === "string" && maybe.accessToken) ||
    (typeof maybe.jwt === "string" && maybe.jwt) ||
    null;
  return token;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const t = getStoredToken();
    setToken(t);
    setIsHydrating(false);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const res = await http.post("/auth/login", input);
    const nextToken = extractToken(res.data);
    if (!nextToken) throw new Error("Login succeeded but no token was returned.");
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser({ email: input.email });
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await http.post("/auth/register", input);
    const nextToken = extractToken(res.data);
    if (nextToken) {
      setStoredToken(nextToken);
      setToken(nextToken);
      setUser({ email: input.email });
      return;
    }
    // If backend doesn't return a token on register, fall back to login.
    await login(input);
  }, [login]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isHydrating,
      login,
      register,
      logout,
    }),
    [token, user, isHydrating, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

