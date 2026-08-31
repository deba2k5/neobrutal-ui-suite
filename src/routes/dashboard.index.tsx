import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Database, Inbox, Cpu, BarChart3, ArrowRight } from "lucide-react";
import { Badge, Button, Panel, PanelHead, Stat } from "@/components/nb";
import { ROLE_LABEL, useAuth, type AuthUser } from "@/lib/auth";
import { listAudit, listDatasets, listFLJobs, listInstitutions, listRequests } from "@/lib/api.functions";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function AdminOverview() {
  const { data: institutions = [] } = useQuery({ queryKey: ["institutions"], queryFn: () => listInstitutions() });
  const { data: requests = [] } = useQuery({ queryKey: ["requests"], queryFn: () => listRequests() });
  const { data: jobs = [] } = useQuery({ queryKey: ["flJobs"], queryFn: () => listFLJobs() });
  const { data: datasets = [] } = useQuery({ queryKey: ["datasets"], queryFn: () => listDatasets() });

  const verified = institutions.filter((i) => i.status === "verified").length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const active = jobs.filter((j) => j.status === "training" || j.status === "aggregating").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Verified institutions" value={String(verified)} tone="primary" />
      <Stat label="Pending requests" value={String(pending)} tone="yellow" />
      <Stat label="Active FL jobs" value={String(active)} tone="cyan" />
      <Stat label="Datasets on network" value={String(datasets.length)} tone="ink" />
    </div>
  );
}

function ProviderOverview({ user }: { user: AuthUser }) {
  const { data: datasets = [] } = useQuery({ queryKey: ["datasets"], queryFn: () => listDatasets() });
  const { data: requests = [] } = useQuery({ queryKey: ["requests"], queryFn: () => listRequests() });
  const { data: jobs = [] } = useQuery({ queryKey: ["flJobs"], queryFn: () => listFLJobs() });

  const pending = requests.filter((r) => r.status === "pending").length;
  const active = jobs.filter((j) => j.status === "training" || j.status === "aggregating").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Datasets registered" value={String(datasets.length)} tone="primary" sub={user.institution} />
      <Stat label="Pending consent" value={String(pending)} tone="yellow" />
      <Stat label="Active FL jobs" value={String(active)} tone="cyan" />
      <Stat label="Privacy budget left" value="ε 1.4" tone="ink" />
    </div>
  );
}

function ConsumerOverview() {
  const { data: requests = [] } = useQuery({ queryKey: ["requests"], queryFn: () => listRequests() });
  const { data: datasets = [] } = useQuery({ queryKey: ["datasets"], queryFn: () => listDatasets() });

  const approved = requests.filter((r) => r.status === "approved").length;
  const discoverable = datasets.filter((d) => d.consent !== "locked").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Requests raised" value={String(requests.length)} tone="primary" />
      <Stat label="Approved" value={String(approved)} tone="cyan" />
      <Stat label="Datasets discoverable" value={String(discoverable)} tone="yellow" />
      <Stat label="Budget spent this week" value="ε 4.9" tone="ink" />
    </div>
  );
}

function Overview() {
  const { user } = useAuth();
  const { data: audit = [] } = useQuery({ queryKey: ["audit"], queryFn: () => listAudit() });

  if (!user) return null;

  const recentAudit = audit.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="primary">{ROLE_LABEL[user.role]}</Badge>
        <h1 className="mt-3 text-3xl leading-[0.95] sm:text-4xl">Welcome back, {user.name.split(" ")[0]}.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.institution}</p>
      </div>

      {user.role === "admin" && <AdminOverview />}
      {user.role === "provider" && <ProviderOverview user={user} />}
      {user.role === "consumer" && <ConsumerOverview />}

      <Panel>
        <PanelHead
          title="recent activity"
          right={
            <Link to="/dashboard/audit">
              <Button size="sm" variant="ghost">
                Full ledger <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        />
        <div className="divide-y-[3px] divide-border">
          {recentAudit.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-display text-xs">{a.action}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{a.target}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{a.at}</span>
            </div>
          ))}
          {recentAudit.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
          )}
        </div>
      </Panel>

      <div className="grid gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/dashboard/datasets" as const, icon: Database, label: "Datasets" },
          { to: "/dashboard/requests" as const, icon: Inbox, label: "Access & consent" },
          { to: "/dashboard/federated" as const, icon: Cpu, label: "Federated jobs" },
          { to: "/dashboard/insights" as const, icon: BarChart3, label: "Insights" },
        ].map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="nb-border nb-shadow nb-press flex items-center gap-3 bg-card p-4 font-display text-sm uppercase"
          >
            <q.icon className="h-5 w-5" />
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
