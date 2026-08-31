import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, KeyRound, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Input, Panel, PanelHead } from "@/components/nb";
import { PERMISSION_MATRIX, ROLE_LABEL, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({ consent: true, audit: true, jobs: false });
  const [budget, setBudget] = useState("2.0");

  if (!user) return null;

  const permissions = PERMISSION_MATRIX[user.role];

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="muted">Console preferences</Badge>
        <h1 className="mt-3 text-3xl leading-[0.95]">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Profile, notification and privacy-budget preferences for your session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHead title="profile" right={<ShieldCheck className="h-4 w-4" />} />
          <div className="space-y-3 p-4">
            <div>
              <p className="font-mono text-[11px] text-muted-foreground uppercase">Name</p>
              <p className="font-display text-sm">{user.name}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted-foreground uppercase">Email</p>
              <p className="font-mono text-sm">{user.email}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted-foreground uppercase">Institution</p>
              <p className="font-display text-sm">{user.institution}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted-foreground uppercase">Role</p>
              <Badge tone="primary">{ROLE_LABEL[user.role]}</Badge>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="permissions granted" right={<KeyRound className="h-4 w-4" />} tone="cyan" />
          <div className="flex flex-wrap gap-2 p-4">
            {permissions.map((p) => (
              <Badge key={p} tone="muted">
                {p}
              </Badge>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHead title="notifications" right={<Bell className="h-4 w-4" />} tone="yellow" />
          <div className="divide-y-[3px] divide-border">
            {(
              [
                { key: "consent" as const, label: "Consent decisions" },
                { key: "audit" as const, label: "New audit ledger entries" },
                { key: "jobs" as const, label: "Federated job completion" },
              ]
            ).map((n) => (
              <label key={n.key} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="font-display text-xs uppercase">{n.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[n.key]}
                  onChange={(e) =>
                    setNotifications((prev) => ({ ...prev, [n.key]: e.target.checked }))
                  }
                  className="nb-border h-5 w-5 accent-primary"
                />
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHead title="privacy budget ceiling" right={<Settings className="h-4 w-4" />} tone="ink" />
          <form
            className="space-y-4 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(`Privacy budget ceiling set to ε ${budget}.`);
            }}
          >
            <div>
              <p className="mb-1 font-mono text-[11px] text-muted-foreground uppercase">
                Max epsilon per query
              </p>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm">
              Save preferences
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
