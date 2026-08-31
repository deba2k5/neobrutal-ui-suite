import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const nbButton = cva(
  "inline-flex items-center justify-center gap-2 nb-border nb-shadow-sm nb-press font-display uppercase tracking-tight disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        ink: "bg-foreground text-background",
        yellow: "bg-secondary text-secondary-foreground",
        cyan: "bg-accent text-accent-foreground",
        ghost: "bg-card text-foreground",
        danger: "bg-destructive text-destructive-foreground",
        success: "bg-success text-success-foreground",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof nbButton>) {
  return <button className={cn(nbButton({ variant, size }), className)} {...props} />;
}

export function Panel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div className={cn("nb-border nb-shadow bg-card", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelHead({
  title,
  right,
  tone = "ink",
}: {
  title: string;
  right?: ReactNode;
  tone?: "ink" | "primary" | "cyan" | "yellow";
}) {
  const tones = {
    ink: "bg-foreground text-background",
    primary: "bg-primary text-primary-foreground",
    cyan: "bg-accent text-accent-foreground",
    yellow: "bg-secondary text-secondary-foreground",
  } as const;
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b-[3px] border-border px-4 py-2.5",
        tones[tone],
      )}
    >
      <h3 className="font-display text-sm tracking-tight">{title}</h3>
      {right}
    </div>
  );
}

export const nbBadge = cva(
  "inline-flex items-center gap-1.5 nb-border px-2 py-0.5 font-mono text-[11px] font-bold uppercase",
  {
    variants: {
      tone: {
        ink: "bg-foreground text-background",
        primary: "bg-primary text-primary-foreground",
        yellow: "bg-secondary text-secondary-foreground",
        cyan: "bg-accent text-accent-foreground",
        success: "bg-success text-success-foreground",
        warn: "bg-warn text-warn-foreground",
        info: "bg-info text-info-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  children,
}: VariantProps<typeof nbBadge> & { className?: string; children: ReactNode }) {
  return <span className={cn(nbBadge({ tone }), className)}>{children}</span>;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full nb-border bg-card px-3 py-2.5 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:nb-shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "card",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "card" | "primary" | "cyan" | "yellow" | "ink";
}) {
  const tones = {
    card: "bg-card text-foreground",
    primary: "bg-primary text-primary-foreground",
    cyan: "bg-accent text-accent-foreground",
    yellow: "bg-secondary text-secondary-foreground",
    ink: "bg-foreground text-background",
  } as const;
  return (
    <div className={cn("nb-border nb-shadow p-4", tones[tone])}>
      <p className="font-mono text-[11px] font-bold uppercase opacity-80">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none">{value}</p>
      {sub ? <p className="mt-2 font-mono text-[11px] opacity-75">{sub}</p> : null}
    </div>
  );
}

export function SectionTitle({
  kicker,
  title,
  blurb,
}: {
  kicker: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Badge tone="primary">{kicker}</Badge>
      <h2 className="mt-3 text-3xl leading-[0.95] sm:text-4xl">{title}</h2>
      {blurb ? <p className="mt-3 text-sm text-muted-foreground sm:text-base">{blurb}</p> : null}
    </div>
  );
}
