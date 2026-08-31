import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, ShieldOff } from "lucide-react";
import { Badge, Panel, PanelHead, Stat } from "@/components/nb";
import { can, useAuth } from "@/lib/auth";
import { BUDGET_SPEND, CATEGORY_MIX, FL_ROUNDS } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/insights")({
  component: InsightsPage,
});

const PIE_COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-secondary)"];

function InsightsPage() {
  const { user } = useAuth();

  if (!can(user?.role, "insights.read")) {
    return (
      <Panel className="p-8 text-center">
        <ShieldOff className="mx-auto h-8 w-8" />
        <h2 className="mt-3 text-xl">Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">Insights are not available for your role.</p>
      </Panel>
    );
  }

  const latest = FL_ROUNDS[FL_ROUNDS.length - 1] ?? { accuracy: 0, loss: 0, round: "0" };
  const totalSpend = BUDGET_SPEND.reduce((sum, d) => sum + d.spent, 0);

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="cyan">Compliance-aware analytics</Badge>
        <h1 className="mt-3 text-3xl leading-[0.95]">Network insights</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Aggregate-only views — every chart here is computed from federated updates, never raw records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Latest FL accuracy" value={`${latest.accuracy}%`} tone="primary" sub={`round ${latest.round}`} />
        <Stat label="Latest loss" value={latest.loss.toFixed(2)} tone="yellow" />
        <Stat label="Budget spent this week" value={`ε ${totalSpend.toFixed(1)}`} tone="cyan" />
      </div>

      <Panel>
        <PanelHead title="federated accuracy vs. round" right={<BarChart3 className="h-4 w-4" />} />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FL_ROUNDS}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
              <XAxis dataKey="round" stroke="var(--color-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-foreground)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  border: "3px solid var(--color-border)",
                  borderRadius: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="var(--color-foreground)"
                strokeWidth={3}
                fill="var(--color-primary)"
                fillOpacity={0.55}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHead title="privacy budget spend (ε / day)" tone="yellow" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUDGET_SPEND}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    border: "3px solid var(--color-border)",
                    borderRadius: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="spent" fill="var(--color-secondary)" stroke="var(--color-border)" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="dataset category mix" tone="cyan" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_MIX}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  stroke="var(--color-border)"
                  strokeWidth={3}
                >
                  {CATEGORY_MIX.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "3px solid var(--color-border)",
                    borderRadius: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 border-t-[3px] border-border p-4">
            {CATEGORY_MIX.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 font-mono text-[11px]">
                <span className="nb-border h-3 w-3" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {c.name} · {c.value}%
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
