import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Inbox, Loader2, Plus, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Input, Panel, PanelHead } from "@/components/nb";
import { can, useAuth } from "@/lib/auth";
import { createRequest, listDatasets, listRequests, setRequestStatus } from "@/lib/api.functions";
import type { AccessRequest } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/requests")({
  component: RequestsPage,
});

const STATUS_TONE: Record<AccessRequest["status"], "warn" | "success" | "primary" | "muted"> = {
  pending: "warn",
  approved: "success",
  rejected: "primary",
  expired: "muted",
};

const EMPTY_FORM = { dataset: "", purpose: "", privacyBudget: "0.5" };

function RequestsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const queryClient = useQueryClient();

  const canApprove = can(user?.role, "requests.approve");
  const canCreate = can(user?.role, "requests.create");

  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["requests"],
    queryFn: () => listRequests(),
  });

  const { data: datasets = [] } = useQuery({
    queryKey: ["datasets"],
    queryFn: () => listDatasets(),
    enabled: canCreate,
  });

  const statusMutation = useMutation({
    mutationFn: setRequestStatus,
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      toast.success(`${vars.data.id} marked ${vars.data.status}.`);
    },
    onError: () => toast.error("Could not update the request — check the backend connection."),
  });

  const createMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      toast.success(`${doc.id} raised.`);
      setForm(EMPTY_FORM);
      setShowForm(false);
    },
    onError: () => toast.error("Could not raise the request — check the backend connection."),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="yellow">Consent queue</Badge>
          <h1 className="mt-3 text-3xl leading-[0.95]">Access &amp; consent requests</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every request carries a purpose statement and a bounded privacy budget before it reaches an
            owning institution.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Raise request"}
          </Button>
        )}
      </div>

      {canCreate && showForm && (
        <Panel>
          <PanelHead title="raise an access request" tone="yellow" />
          <form
            className="grid gap-4 p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!user) return;
              createMutation.mutate({
                data: {
                  dataset: form.dataset || datasets[0]?.name || "Unspecified dataset",
                  requester: `${user.institution} · ${user.name}`,
                  purpose: form.purpose.trim(),
                  privacyBudget: Number(form.privacyBudget) || 0,
                  actor: user.email,
                },
              });
            }}
          >
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Dataset</p>
              <select
                value={form.dataset}
                onChange={(e) => setForm((f) => ({ ...f, dataset: e.target.value }))}
                className="nb-border w-full bg-card px-3 py-2.5 font-mono text-sm outline-none"
              >
                <option value="">Select a dataset…</option>
                {datasets.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Privacy budget (ε)</p>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.privacyBudget}
                onChange={(e) => setForm((f) => ({ ...f, privacyBudget: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">Purpose</p>
              <Input
                required
                value={form.purpose}
                onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                placeholder="e.g. Cross-institution retention benchmark study"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Submit request
              </Button>
            </div>
          </form>
        </Panel>
      )}

      <Panel>
        <PanelHead title="requests" right={<Inbox className="h-4 w-4" />} />
        {isLoading && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Loading requests…</p>}
        {isError && (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Couldn't reach the database. Check MONGODB_URI in .env and that the server is running.
          </p>
        )}
        {!isLoading && !isError && (
          <div className="divide-y-[3px] divide-border">
            {requests.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm">{r.dataset}</p>
                    <Badge tone="muted">{r.id}</Badge>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {r.requester} · {r.purpose}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Raised {r.raised} · budget ε {r.privacyBudget}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                {canApprove && r.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        user &&
                        statusMutation.mutate({ data: { id: r.id, status: "approved", actor: user.email } })
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        user &&
                        statusMutation.mutate({ data: { id: r.id, status: "rejected", actor: user.email } })
                      }
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {requests.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No requests yet.</p>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
