import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "provider" | "consumer";

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
  institution: string;
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Network Admin",
  provider: "Data Provider",
  consumer: "Data Consumer",
};

export const DEMO_ACCOUNTS: Array<AuthUser & { password: string }> = [
  {
    name: "Ananya Rao",
    email: "admin@cyphora.in",
    password: "cyphora",
    role: "admin",
    institution: "Cyphora Network Authority",
  },
  {
    name: "Dr. Soumen Das",
    email: "provider@iitkgp.ac.in",
    password: "cyphora",
    role: "provider",
    institution: "IIT Kharagpur",
  },
  {
    name: "Prof. Meera Iyer",
    email: "consumer@jnu.ac.in",
    password: "cyphora",
    role: "consumer",
    institution: "Jawaharlal Nehru University",
  },
];

const STORAGE_KEY = "cyphora.session";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signInAs: (role: Role) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const persist = (next: AuthUser | null) => {
      setUser(next);
      try {
        if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    };

    return {
      user,
      ready,
      signIn: (email, password) => {
        const found = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!found) return { ok: false, error: "No institutional account for that email." };
        if (found.password !== password) return { ok: false, error: "Incorrect passphrase." };
        const { password: _pw, ...rest } = found;
        persist(rest);
        return { ok: true };
      },
      signInAs: (role) => {
        const found = DEMO_ACCOUNTS.find((a) => a.role === role)!;
        const { password: _pw, ...rest } = found;
        persist(rest);
      },
      signOut: () => persist(null),
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/* --- Permission matrix (role-based access control) --- */

export type Permission =
  | "datasets.read"
  | "datasets.write"
  | "requests.create"
  | "requests.approve"
  | "insights.read"
  | "federated.run"
  | "audit.read"
  | "institutions.manage"
  | "consent.manage";

const MATRIX: Record<Role, Permission[]> = {
  admin: [
    "datasets.read",
    "requests.approve",
    "insights.read",
    "audit.read",
    "institutions.manage",
    "consent.manage",
    "federated.run",
  ],
  provider: [
    "datasets.read",
    "datasets.write",
    "requests.approve",
    "consent.manage",
    "insights.read",
    "federated.run",
    "audit.read",
  ],
  consumer: ["requests.create", "insights.read", "federated.run"],
};

export function can(role: Role | undefined, permission: Permission) {
  if (!role) return false;
  return MATRIX[role].includes(permission);
}

export const PERMISSION_MATRIX = MATRIX;
