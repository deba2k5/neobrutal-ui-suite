import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Input, Panel, PanelHead } from "@/components/nb";
import { DEMO_ACCOUNTS, ROLE_LABEL, useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Cyphora Institutional Console" },
      {
        name: "description",
        content:
          "Sign in to the Cyphora console as a network admin, data provider or data consumer to manage consent, datasets and federated insights.",
      },
      { property: "og:title", content: "Sign in — Cyphora Institutional Console" },
      {
        property: "og:description",
        content: "Role-based access to the privacy-preserving institutional data network.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLE_TONE: Record<Role, string> = {
  admin: "bg-primary text-primary-foreground",
  provider: "bg-secondary text-secondary-foreground",
  consumer: "bg-accent text-accent-foreground",
};

function LoginPage() {
  const { signIn, signInAs, user, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  return (
    <div className="min-h-screen">
      <div className="border-b-[3px] border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="nb-border nb-shadow-sm flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg tracking-tight">CYPHORA</span>
          </Link>
          <Link to="/">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <Badge tone="yellow">Verified institutions only</Badge>
          <h1 className="mt-4 text-4xl leading-[0.9] sm:text-5xl">Role-based sign in</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Your role decides what the console exposes: datasets, consent queues, audit ledger or
            query workbench. Pick a demo identity to explore instantly.
          </p>

          <div className="mt-8 space-y-4">
            {DEMO_ACCOUNTS.map((a) => (
              <div key={a.role} className="nb-border nb-shadow bg-card">
                <div className={`border-b-[3px] border-border px-4 py-2 ${ROLE_TONE[a.role]}`}>
                  <span className="font-display text-sm">{ROLE_LABEL[a.role]}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-display text-sm">{a.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{a.email}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{a.institution}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ink"
                    onClick={() => {
                      signInAs(a.role);
                      toast.success(`Signed in as ${ROLE_LABEL[a.role]}`);
                      navigate({ to: "/dashboard" });
                    }}
                  >
                    Use identity
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Panel className="nb-shadow-lg h-fit">
          <PanelHead title="credentialed access" right={<Badge tone="success">TLS 1.3</Badge>} />
          <form
            className="space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              const res = signIn(email, password);
              if (!res.ok) {
                toast.error(res.error ?? "Sign in failed");
                return;
              }
              toast.success("Session established");
              navigate({ to: "/dashboard" });
            }}
          >
            <div>
              <label className="font-mono text-[11px] font-bold uppercase">Institutional email</label>
              <Input
                className="mt-1.5"
                type="email"
                placeholder="you@institute.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-mono text-[11px] font-bold uppercase">Passphrase</label>
              <Input
                className="mt-1.5"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              <KeyRound className="h-4 w-4" /> Authenticate
            </Button>
            <p className="nb-border bg-muted p-3 font-mono text-[11px]">
              Demo passphrase for all accounts: <strong>cyphora</strong>
            </p>
          </form>
        </Panel>
      </div>
    </div>
  );
}
