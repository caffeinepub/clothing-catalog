import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AUTH_KEY = "clothingCatalogAuth";
const VALID_USERNAME = "slimkid3";
const VALID_PASSWORD = "AliceInChains92";

interface AuthContextValue {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem(AUTH_KEY, "true");
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  }, [isAdmin]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
