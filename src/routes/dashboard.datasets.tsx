import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, Loader2, Plus, Search, ShieldOff, X } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Input, Panel, PanelHead } from "@/components/nb";
import { can, useAuth } from "@/lib/auth";
import { createDataset, listDatasets } from "@/lib/api.functions";
import type { DatasetSensitivity } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/datasets")({
  component: DatasetsPage,
});

const SENSITIVITY_TONE: Record<DatasetSensitivity, "success" | "warn" | "primary"> = {
  low: "success",
  medium: "warn",
  high: "primary",
};

const CONSENT_TONE: Record<string, "success" | "warn" | "muted"> = {
  open: "success",
  "on-request": "warn",
  locked: "muted",
};

const EMPTY_FORM = {
  name: "",
  owner: "",
  category: "Academic",
  records: "1000",
  sensitivity: "medium" as DatasetSensitivity,
  epsilon: "1.0",
  consent: "on-request" as "open" | "on-request" | "locked",
};

function DatasetsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const queryClient = useQueryClient();

  const canRead = can(user?.role, "datasets.read") || user?.role === "consumer";
  const canWrite = can(user?.role, "datasets.write");

  const { data: datasets = [], isLoading, isError } = useQuery({
    queryKey: ["datasets"],
    queryFn: () => listDatasets(),
    enabled: canRead,
  });

  const createMutation = useMutation({
    mutationFn: createDataset,
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      toast.success(`${doc.id} registered.`);
      setForm(EMPTY_FORM);
      setShowForm(false);
    },
    onError: () => toast.error("Could not register dataset — check the backend connection."),
  });

  const filtered = useMemo(
    () =>
      datasets.filter((d) =>
        [d.name, d.owner, d.category].join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [datasets, query],
  );

  if (!canRead) {
    return (
      <Panel className="p-8 text-center">
        <ShieldOff className="mx-auto h-8 w-8" />
        <h2 className="mt-3 text-xl">Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role doesn't have dataset read access on this network.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="cyan">Dataset registry</Badge>
          <h1 className="mt-3 text-3xl leading-[0.95]">Institutional datasets</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} of {datasets.length} datasets · backed by MongoDB, sensitivity and consent are
            set by the owning institution.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Register dataset"}
          </Button>
        )}
      </div>

      {canWrite && showForm && (
        <Panel>
          <PanelHead title="register a new dataset" tone="cyan" />
          <form
            className="grid gap-4 p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!user) return;
              createMutation.mutate({
                data: {
                  name: form.name.trim(),
                  owner: form.owner.trim() || user.institution,
                  category: form.category,
                  records: Number(form.records) || 0,
                  sensitivity: form.sensitivity,
                  epsilon: Number(form.epsilon) || 0,
                  consent: form.consent,
                  actor: user.email,
                },
              });
            }}
          >
            <div className="sm:col-span-2">
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Dataset name</p>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Alumni Outcomes 2026"
              />
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Owning institution</p>
              <Input
                value={form.owner}
                onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                placeholder={user?.institution}
              />
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Category</p>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="nb-border w-full bg-card px-3 py-2.5 font-mono text-sm outline-none"
              >
                <option>Academic</option>
                <option>Research</option>
                <option>Administrative</option>
              </select>
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Record count</p>
              <Input
                type="number"
                min="0"
                value={form.records}
                onChange={(e) => setForm((f) => ({ ...f, records: e.target.value }))}
              />
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Sensitivity</p>
              <select
                value={form.sensitivity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sensitivity: e.target.value as DatasetSensitivity }))
                }
                className="nb-border w-full bg-card px-3 py-2.5 font-mono text-sm outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Privacy budget (ε)</p>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.epsilon}
                onChange={(e) => setForm((f) => ({ ...f, epsilon: e.target.value }))}
              />
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Consent policy</p>
              <select
                value={form.consent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, consent: e.target.value as typeof form.consent }))
                }
                className="nb-border w-full bg-card px-3 py-2.5 font-mono text-sm outline-none"
              >
                <option value="open">Open</option>
                <option value="on-request">On request</option>
                <option value="locked">Locked</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Register
              </Button>
            </div>
          </form>
        </Panel>
      )}

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, owner or category…"
          className="pl-9"
        />
      </div>

      <Panel>
        <PanelHead title="all datasets" right={<Database className="h-4 w-4" />} />
        {isLoading && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Loading datasets…</p>}
        {isError && (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Couldn't reach the database. Check MONGODB_URI in .env and that the server is running.
          </p>
        )}
        {!isLoading && !isError && (
          <div className="divide-y-[3px] divide-border">
            {filtered.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm">{d.name}</p>
                    <Badge tone="muted">{d.id}</Badge>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {d.owner} · {d.category} · {d.records.toLocaleString()} records · updated {d.updated}
                  </p>
                </div>
                <Badge tone={SENSITIVITY_TONE[d.sensitivity]}>{d.sensitivity} sensitivity</Badge>
                <Badge tone={CONSENT_TONE[d.consent]}>{d.consent}</Badge>
                <span className="font-mono text-xs font-bold whitespace-nowrap">ε {d.epsilon}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No datasets match "{query}".</p>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
