import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollText, Search, ShieldOff } from "lucide-react";
import { Badge, Input, Panel, PanelHead } from "@/components/nb";
import { can, useAuth } from "@/lib/auth";
import { listAudit } from "@/lib/api.functions";
import type { AuditEntry } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/audit")({
  component: AuditPage,
});

const SEVERITY_TONE: Record<AuditEntry["severity"], "info" | "warn" | "primary"> = {
  info: "info",
  warn: "warn",
  critical: "primary",
};

function AuditPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const canRead = can(user?.role, "audit.read");

  const { data: audit = [], isLoading, isError } = useQuery({
    queryKey: ["audit"],
    queryFn: () => listAudit(),
    enabled: canRead,
  });

  const filtered = useMemo(
    () =>
      audit.filter((a) =>
        [a.actor, a.action, a.target].join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [audit, query],
  );

  if (!canRead) {
    return (
      <Panel className="p-8 text-center">
        <ShieldOff className="mx-auto h-8 w-8" />
        <h2 className="mt-3 text-xl">Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The audit ledger is limited to institutions with audit read access.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="ink">Immutable ledger</Badge>
        <h1 className="mt-3 text-3xl leading-[0.95]">Audit trail</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every action is hash-chained and written straight to MongoDB. Tampering with one entry invalidates
          every entry after it.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actor, action or target…"
          className="pl-9"
        />
      </div>

      <Panel>
        <PanelHead title="ledger entries" right={<ScrollText className="h-4 w-4" />} tone="ink" />
        {isLoading && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Loading ledger…</p>}
        {isError && (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Couldn't reach the database. Check MONGODB_URI in .env and that the server is running.
          </p>
        )}
        {!isLoading && !isError && (
          <div className="divide-y-[3px] divide-border">
            {filtered.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <Badge tone={SEVERITY_TONE[a.severity]}>{a.severity}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm">{a.action}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {a.actor} → {a.target}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[11px] text-muted-foreground">{a.at}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{a.hash}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No entries match "{query}".</p>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
