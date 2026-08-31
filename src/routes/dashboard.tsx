import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Database,
  Inbox,
  Cpu,
  ScrollText,
  Building2,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Badge, Button } from "@/components/nb";
import { ROLE_LABEL, can, useAuth, type Permission, type Role } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

type NavItem = {
  to:
    | "/dashboard"
    | "/dashboard/datasets"
    | "/dashboard/requests"
    | "/dashboard/insights"
    | "/dashboard/federated"
    | "/dashboard/audit"
    | "/dashboard/institutions"
    | "/dashboard/settings";
  label: string;
  icon: typeof LayoutDashboard;
  permission?: Permission;
};

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/datasets", label: "Datasets", icon: Database, permission: "datasets.read" },
  { to: "/dashboard/requests", label: "Access & consent", icon: Inbox },
  { to: "/dashboard/insights", label: "Insights", icon: BarChart3, permission: "insights.read" },
  { to: "/dashboard/federated", label: "Federated jobs", icon: Cpu, permission: "federated.run" },
  { to: "/dashboard/audit", label: "Audit ledger", icon: ScrollText, permission: "audit.read" },
  {
    to: "/dashboard/institutions",
    label: "Institutions",
    icon: Building2,
    permission: "institutions.manage",
  },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const ROLE_TONE: Record<Role, "primary" | "yellow" | "cyan"> = {
  admin: "primary",
  provider: "yellow",
  consumer: "cyan",
};

function DashboardLayout() {
  const { user, ready, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="nb-border nb-shadow bg-card px-6 py-4 font-mono text-xs font-bold uppercase">
          Verifying session…
        </div>
      </div>
    );
  }

  const items = NAV.filter((n) => !n.permission || can(user.role, n.permission));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b-[3px] border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="nb-border nb-shadow-sm flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg tracking-tight">CYPHORA</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-display text-xs">{user.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{user.institution}</p>
            </div>
            <Badge tone={ROLE_TONE[user.role]}>{ROLE_LABEL[user.role]}</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                signOut();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="h-4 w-4" /> Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <nav className="lg:w-60 lg:shrink-0">
          <div className="nb-border nb-shadow bg-card p-2 lg:sticky lg:top-24">
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {items.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/dashboard" }}
                  activeProps={{ className: "bg-foreground text-background" }}
                  inactiveProps={{ className: "bg-card hover:bg-muted" }}
                  className="flex shrink-0 items-center gap-2 border-[3px] border-border px-3 py-2 font-display text-xs whitespace-nowrap uppercase"
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
