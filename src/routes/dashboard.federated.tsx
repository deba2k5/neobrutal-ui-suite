import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cpu, Play, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Panel, PanelHead } from "@/components/nb";
import { can, useAuth } from "@/lib/auth";
import { listFLJobs, startFLJob } from "@/lib/api.functions";
import type { FLJob } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/federated")({
  component: FederatedPage,
});

const STATUS_TONE: Record<FLJob["status"], "primary" | "cyan" | "success" | "muted"> = {
  training: "primary",
  aggregating: "cyan",
  complete: "success",
  queued: "muted",
};

function FederatedPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canRun = can(user?.role, "federated.run");

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ["flJobs"],
    queryFn: () => listFLJobs(),
    enabled: canRun,
  });

  const startMutation = useMutation({
    mutationFn: startFLJob,
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["flJobs"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      toast.success(`${vars.data.id} queued for training.`);
    },
    onError: () => toast.error("Could not start the job — check the backend connection."),
  });

  if (!canRun) {
    return (
      <Panel className="p-8 text-center">
        <ShieldOff className="mx-auto h-8 w-8" />
        <h2 className="mt-3 text-xl">Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">Federated jobs are not available for your role.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="cyan">Federated learning</Badge>
        <h1 className="mt-3 text-3xl leading-[0.95]">Federated jobs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Models train locally at each node; only encrypted updates travel to the orchestrator for secure
          aggregation.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading jobs…</p>}
      {isError && (
        <p className="text-sm text-destructive">
          Couldn't reach the database. Check MONGODB_URI in .env and that the server is running.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-5 sm:grid-cols-2">
          {jobs.map((j) => (
            <Panel key={j.id}>
              <PanelHead title={j.name} right={<Badge tone={STATUS_TONE[j.status]}>{j.status}</Badge>} />
              <div className="space-y-3 p-4">
                <p className="font-mono text-[11px] text-muted-foreground">
                  {j.id} · {j.algorithm} · {j.nodes} nodes
                </p>
                <div className="nb-border h-4 bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${j.accuracy}%` }} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <span>round {j.round}</span>
                  <span>accuracy {j.accuracy}%</span>
                  <span>ε {j.epsilon}</span>
                </div>
                {j.status === "queued" && (
                  <Button
                    size="sm"
                    disabled={startMutation.isPending}
                    onClick={() => user && startMutation.mutate({ data: { id: j.id, actor: user.email } })}
                  >
                    <Play className="h-3.5 w-3.5" /> Start job
                  </Button>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Panel>
        <PanelHead title="orchestrator log" right={<Cpu className="h-4 w-4" />} tone="ink" />
        <div className="nb-border m-4 bg-foreground p-4 font-mono text-[11px] text-background">
          <p>&gt; secure_agg(9 nodes) → ok</p>
          <p>&gt; dp_noise(ε=0.8, δ=1e-5) → applied</p>
          <p>&gt; broadcast(global_weights_v41) → 9/9 acked</p>
        </div>
      </Panel>
    </div>
  );
}
