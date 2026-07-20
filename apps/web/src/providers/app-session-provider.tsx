import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserDto } from "@yuno/shared-types";
import { authService, type AuthResponse } from "@/services/auth-service";

const TOKEN_STORAGE_KEY = "yuno-auth-token";
const USER_STORAGE_KEY = "yuno-auth-user";

type SessionContextValue = {
  token: string | null;
  user: UserDto | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (input: unknown) => Promise<AuthResponse>;
  register: (input: unknown) => Promise<AuthResponse>;
  logout: () => void;
  refreshCurrentUser: () => Promise<UserDto | null>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function persistSession(token: string | null, user: UserDto | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!storedToken) {
      setIsBootstrapping(false);
      return;
    }

    setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as UserDto);
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    void authService
      .getCurrentUser(storedToken)
      .then((currentUser) => {
        setUser(currentUser);
        persistSession(storedToken, currentUser);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        persistSession(null, null);
      })
      .finally(() => {
        setIsBootstrapping(false);
      });
  }, []);

  async function refreshCurrentUser() {
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await authService.getCurrentUser(token);
      setUser(currentUser);
      persistSession(token, currentUser);
      return currentUser;
    } catch {
      setToken(null);
      setUser(null);
      persistSession(null, null);
      return null;
    }
  }

  async function handleAuthSuccess(action: Promise<AuthResponse>) {
    const authResponse = await action;
    setToken(authResponse.token);
    setUser(authResponse.user);
    persistSession(authResponse.token, authResponse.user);
    return authResponse;
  }

  function logout() {
    setToken(null);
    setUser(null);
    persistSession(null, null);
  }

  const value = useMemo<SessionContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login: (input) => handleAuthSuccess(authService.login(input)),
      register: (input) => handleAuthSuccess(authService.register(input)),
      logout,
      refreshCurrentUser,
    }),
    [token, user, isBootstrapping],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useAppSession must be used within AppSessionProvider");
  }

  return context;
}
