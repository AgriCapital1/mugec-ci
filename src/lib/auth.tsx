import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Auth locale (UI only, pas de base de données).
// Compte administrateur fictif ANZRBO :
//   identifiant (téléphone) : 0759566087
//   mot de passe           : 12345678

export type LocalUser = {
  id: string;
  email: string;
  telephone: string;
  nom: string;
  prenoms: string;
  role: "super_admin";
};

const STORAGE_KEY = "anzrbo_local_session_v1";

export const FICTIVE_ADMIN: LocalUser & { password: string } = {
  id: "admin-anzrbo-local",
  email: "admin@anzrbo.local",
  telephone: "0759566087",
  nom: "ADMIN",
  prenoms: "ANZRBO",
  role: "super_admin",
  password: "12345678",
};

function normalizePhone(v: string) {
  return v.replace(/\D/g, "");
}

export function tryLogin(identifier: string, password: string): LocalUser | null {
  const id = normalizePhone(identifier);
  if (id === normalizePhone(FICTIVE_ADMIN.telephone) && password === FICTIVE_ADMIN.password) {
    const { password: _p, ...user } = FICTIVE_ADMIN;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }
  return null;
}

function readStoredUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch {
    return null;
  }
}

type Ctx = {
  user: LocalUser | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => LocalUser | null;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  loading: false,
  signIn: () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        signIn: (id, pwd) => {
          const u = tryLogin(id, pwd);
          if (u) setUser(u);
          return u;
        },
        signOut: async () => {
          try {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem(STORAGE_KEY);
            }
          } catch { /* ignore */ }
          setUser(null);
          if (typeof window !== "undefined") {
            window.location.assign("/login");
          }
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
