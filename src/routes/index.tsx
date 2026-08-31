import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Network,
  Lock,
  ScrollText,
  BarChart3,
  Users,
  ArrowRight,
  Database,
  Cpu,
  FileCheck2,
} from "lucide-react";
import { Badge, Button, Panel, PanelHead, SectionTitle, Stat } from "@/components/nb";
import { IMPACT } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyphora — Privacy-Preserving Data Sharing for Institutions" },
      {
        name: "description",
        content:
          "Share insights, not raw data. Cyphora connects verified colleges and universities with federated learning, differential privacy, consent management and role-based access.",
      },
      { property: "og:title", content: "Cyphora — Collaborate Without Compromise" },
      {
        property: "og:description",
        content:
          "A privacy-first collaboration network for colleges and universities. Federated learning, secure aggregation, immutable audit trails.",
      },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  {
    icon: Lock,
    title: "Privacy-first sharing",
    body: "Federated learning and differential privacy expose insights, never raw records.",
    tone: "bg-primary text-primary-foreground",
  },
  {
    icon: Network,
    title: "Collaboration hub",
    body: "Verified colleges exchange academic, research and administrative signals.",
    tone: "bg-accent text-accent-foreground",
  },
  {
    icon: Users,
    title: "Role-based consent",
    body: "Granular RBAC with owner-institution consent on every single query.",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    icon: ScrollText,
    title: "Tamper-proof audit",
    body: "Secure aggregation plus an immutable, hash-chained activity ledger.",
    tone: "bg-card text-foreground",
  },
  {
    icon: BarChart3,
    title: "Insights dashboard",
    body: "Real-time, compliance-aware analytics for administrators and researchers.",
    tone: "bg-foreground text-background",
  },
  {
    icon: ShieldCheck,
    title: "DPDP compliance",
    body: "Governance mapped to the DPDP Act 2023, IEEE 3652.1 and ISO/IEC 20889.",
    tone: "bg-card text-foreground",
  },
];

const FLOW = [
  { icon: Database, title: "Local data stays home", body: "Each institution keeps raw records inside its own boundary." },
  { icon: FileCheck2, title: "Consent + policy check", body: "Requests pass RBAC, purpose limits and a privacy-budget ceiling." },
  { icon: Cpu, title: "Local training", body: "Models train at the source; only encrypted updates leave the node." },
  { icon: Network, title: "Secure aggregation", body: "The orchestrator merges updates without seeing any single record." },
];

const ROLES = [
  {
    role: "Network Admin",
    tone: "bg-primary text-primary-foreground",
    items: ["Verify & suspend institutions", "Set global privacy budgets", "Read the full audit ledger"],
  },
  {
    role: "Data Provider",
    tone: "bg-secondary text-secondary-foreground",
    items: ["Register & classify datasets", "Grant or revoke consent", "Run local training nodes"],
  },
  {
    role: "Data Consumer",
    tone: "bg-accent text-accent-foreground",
    items: ["Raise access requests", "Query aggregates only", "Track budget spend"],
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b-[3px] border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="nb-border nb-shadow-sm flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg tracking-tight">CYPHORA</span>
          </Link>
          <nav className="hidden items-center gap-6 font-mono text-xs font-bold uppercase md:flex">
            <a href="#platform">Platform</a>
            <a href="#how">How it works</a>
            <a href="#roles">Roles</a>
            <a href="#impact">Impact</a>
          </nav>
          <Link to="/login">
            <Button size="sm" variant="ink">
              Enter console
            </Button>
          </Link>
        </div>
      </header>

      <div className="overflow-hidden border-b-[3px] border-border bg-foreground py-2">
        <div className="nb-marquee flex w-max gap-8 font-mono text-xs font-bold whitespace-nowrap text-background uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              <span>SIH 2026 · PS S/W-24</span>
              <span>BLOCKCHAIN &amp; CYBERSECURITY</span>
              <span>DPDP ACT 2023 READY</span>
              <span>FEDERATED LEARNING</span>
              <span>DIFFERENTIAL PRIVACY</span>
              <span>SECURE AGGREGATION</span>
              <span>ROLE-BASED ACCESS</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <Badge tone="yellow">Team Cyphora · Privacy-preserving data platform</Badge>
          <h1 className="mt-5 text-5xl leading-[0.88] sm:text-6xl lg:text-7xl">
            Collaborate
            <br />
            without
            <br />
            <span className="bg-primary px-2 text-primary-foreground">compromise.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Cyphora is a private network for verified colleges and universities. Institutions share
            insights, benchmarks and models — the sensitive rows never leave campus.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/login">
              <Button size="lg">
                Launch role console <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="ghost">
                See the flow
              </Button>
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Stat label="Verified institutions" value="24" tone="cyan" />
            <Stat label="FL rounds run" value="1,412" tone="yellow" />
            <Stat label="Raw rows exposed" value="0" tone="ink" />
          </div>
        </div>

        <Panel className="nb-shadow-lg">
          <PanelHead title="live network monitor" right={<Badge tone="success">SECURE</Badge>} />
          <div className="space-y-3 p-4">
            {[
              { label: "IIT Kharagpur", state: "training · round 41", tone: "bg-success" },
              { label: "JNU Delhi", state: "aggregating updates", tone: "bg-accent" },
              { label: "Anna University", state: "consent pending", tone: "bg-warn" },
              { label: "NIT Trichy", state: "idle · budget ε 1.4 left", tone: "bg-muted" },
              { label: "External vendor", state: "access denied", tone: "bg-primary" },
            ].map((n) => (
              <div key={n.label} className="nb-border flex items-center gap-3 bg-background px-3 py-2.5">
                <span className={`nb-border h-3.5 w-3.5 ${n.tone}`} />
                <span className="font-display text-xs">{n.label}</span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">{n.state}</span>
              </div>
            ))}
            <div className="nb-border bg-foreground p-3 font-mono text-[11px] text-background">
              <p>&gt; secure_agg(9 nodes) → ok</p>
              <p>&gt; dp_noise(ε=0.8, δ=1e-5) → applied</p>
              <p>&gt; audit_hash 0x9f31c…a4e7 → sealed</p>
            </div>
          </div>
        </Panel>
      </section>

      {/* PROBLEM */}
      <section className="border-y-[3px] border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-3xl leading-[0.95]">The problem with sharing today</h2>
          </div>
          <div className="grid gap-4 md:col-span-2 sm:grid-cols-2">
            {[
              "Raw student and research data is emailed in spreadsheets.",
              "No consent trail, so compliance with DPDP 2023 is guesswork.",
              "Benchmarking forces institutions to hand over identifiable records.",
              "Breaches and manual verification burn budget and trust.",
            ].map((t) => (
              <div key={t} className="nb-border nb-shadow bg-card p-4 text-sm">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section id="platform" className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle
          kicker="The platform"
          title="Five layers of privacy engineering"
          blurb="Every capability from the Cyphora architecture, shipped as one console."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className={`nb-border nb-shadow nb-press p-5 ${p.tone}`}>
              <p.icon className="h-7 w-7" />
              <h3 className="mt-4 text-lg leading-tight">{p.title}</h3>
              <p className="mt-2 text-sm opacity-85">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-y-[3px] border-border bg-accent">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle
            kicker="Working procedure"
            title="Data stays local. Only insight travels."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {FLOW.map((f, i) => (
              <div key={f.title} className="nb-border nb-shadow bg-card p-5">
                <div className="flex items-center justify-between">
                  <f.icon className="h-6 w-6" />
                  <span className="font-display text-2xl opacity-25">0{i + 1}</span>
                </div>
                <h3 className="mt-3 text-base leading-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle
          kicker="Role-based access"
          title="Three consoles, one governed network"
          blurb="Permissions are enforced per role — navigation, data and actions all change with who signs in."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ROLES.map((r) => (
            <Panel key={r.role}>
              <div className={`border-b-[3px] border-border px-4 py-3 ${r.tone}`}>
                <h3 className="font-display text-base">{r.role}</h3>
              </div>
              <ul className="space-y-3 p-4">
                {r.items.map((i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="nb-border mt-1 h-3 w-3 shrink-0 bg-foreground" />
                    {i}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/login">
            <Button size="lg" variant="ink">
              Try all three roles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="border-y-[3px] border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle kicker="Impact" title="Before vs after Cyphora" />
          <div className="mt-8 space-y-4">
            {IMPACT.map((row) => (
              <div key={row.metric} className="nb-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm">{row.metric}</span>
                  <span className="font-mono text-xs font-bold">
                    {row.before}% → {row.after}%
                  </span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="nb-border h-5 bg-muted">
                    <div className="h-full bg-muted-foreground/40" style={{ width: `${row.before}%` }} />
                  </div>
                  <div className="nb-border h-5 bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${row.after}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="nb-border nb-shadow-lg bg-primary p-8 text-primary-foreground sm:p-12">
          <h2 className="text-4xl leading-[0.9] sm:text-5xl">
            Private. Secure. Trusted.
          </h2>
          <p className="mt-4 max-w-xl text-base opacity-90">
            Connecting institutes safely, collaborating securely, growing together.
          </p>
          <Link to="/login">
            <Button size="lg" variant="ink" className="mt-8">
              Enter the console <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t-[3px] border-border bg-foreground py-8 text-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <span className="font-display text-lg">CYPHORA SECURITY SOLUTIONS</span>
          <span className="font-mono text-[11px] uppercase">
            SIH 2026 · PS S/W-24 · Privacy-preserving data sharing for institutions
          </span>
        </div>
      </footer>
    </div>
  );
}
