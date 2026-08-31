import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CheckCircle2, ShieldOff, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Panel, PanelHead } from "@/components/nb";
import { can, useAuth } from "@/lib/auth";
import { listInstitutions, setInstitutionStatus } from "@/lib/api.functions";
import type { Institution } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/institutions")({
  component: InstitutionsPage,
});

const STATUS_TONE: Record<Institution["status"], "success" | "warn" | "primary"> = {
  verified: "success",
  pending: "warn",
  suspended: "primary",
};

function InstitutionsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canManage = can(user?.role, "institutions.manage");

  const { data: institutions = [], isLoading, isError } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => listInstitutions(),
    enabled: canManage,
  });

  const statusMutation = useMutation({
    mutationFn: setInstitutionStatus,
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      toast.success(`Institution ${vars.data.status}.`);
    },
    onError: () => toast.error("Could not update the institution — check the backend connection."),
  });

  if (!canManage) {
    return (
      <Panel className="p-8 text-center">
        <ShieldOff className="mx-auto h-8 w-8" />
        <h2 className="mt-3 text-xl">Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Only network admins can manage institution verification.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="primary">Network authority</Badge>
        <h1 className="mt-3 text-3xl leading-[0.95]">Institutions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verify identity before an institution can register datasets or run federated jobs.
        </p>
      </div>

      <Panel>
        <PanelHead title="member institutions" right={<Building2 className="h-4 w-4" />} />
        {isLoading && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Loading institutions…</p>}
        {isError && (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Couldn't reach the database. Check MONGODB_URI in .env and that the server is running.
          </p>
        )}
        {!isLoading && !isError && (
          <div className="divide-y-[3px] divide-border">
            {institutions.map((i) => (
              <div key={i.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm">{i.name}</p>
                    <Badge tone="muted">{i.id}</Badge>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {i.city} · {i.nodes} nodes · {i.datasets} datasets · trust score {i.trust}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[i.status]}>{i.status}</Badge>
                <div className="flex gap-2">
                  {i.status !== "verified" && (
                    <Button
                      size="sm"
                      variant="success"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        user &&
                        statusMutation.mutate({ data: { id: i.id, status: "verified", actor: user.email } })
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verify
                    </Button>
                  )}
                  {i.status !== "suspended" && (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        user &&
                        statusMutation.mutate({ data: { id: i.id, status: "suspended", actor: user.email } })
                      }
                    >
                      <XCircle className="h-3.5 w-3.5" /> Suspend
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
