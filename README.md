# Cyphora

**Collaborate without compromise.** Cyphora is a privacy-preserving data-sharing and collaboration network for colleges and universities — institutions exchange insights, benchmarks and trained models without ever handing over raw, identifiable records.

Built for **Smart India Hackathon 2026 · Problem Statement S/W-24 (Blockchain & Cybersecurity)** by **Team Cyphora**.

---

## Table of contents

- [Problem statement](#problem-statement)
- [Our solution](#our-solution)
- [Tech stack](#tech-stack)
- [Feasibility](#feasibility)
- [Role-based user workflows](#role-based-user-workflows)
- [Who uses it & how](#who-uses-it--how)
- [Benefits / how it helps](#benefits--how-it-helps)
- [How it's better than existing approaches](#how-its-better-than-existing-approaches)
- [Why choose Cyphora](#why-choose-cyphora)
- [Getting started locally](#getting-started-locally)
- [Project structure](#project-structure)

---

## Problem statement

Indian colleges and universities routinely need to share data with each other and with government bodies — placement outcomes, research grants, dropout risk, library usage, faculty publications — to benchmark performance, plan resources and collaborate on research. Today this happens badly:

- **Raw data leaves the institution.** Spreadsheets with student names, marks and financial details are emailed or dropped in shared drives with no encryption or access control.
- **No consent trail.** There is no record of who asked for what data, why, or who approved it — making compliance with the **DPDP Act, 2023** essentially guesswork.
- **Benchmarking forces full disclosure.** To compare placement rates or research output across institutions, someone has to hand over identifiable records instead of just the aggregate answer.
- **No audit trail.** When something goes wrong — a leak, a misuse, an unauthorized query — there's no tamper-evident log to reconstruct what happened.
- **Manual verification is slow and inconsistent.** Every new data-sharing relationship between institutions starts from scratch, with no shared trust or verification layer.

The result: institutions either don't share data at all (losing the benefits of collaboration) or share it insecurely (risking breaches and non-compliance).

## Our solution

Cyphora is a **role-based institutional console** built around five principles:

1. **Data never leaves home.** Institutions keep raw records inside their own boundary. Only **federated learning** updates (encrypted model weights) or **differentially private aggregates** travel across the network.
2. **Consent is a first-class object.** Every access request carries a purpose statement and a bounded **privacy budget (ε)**, and must be explicitly approved by the owning institution before any computation happens.
3. **Everything is role-gated.** A Network Admin, Data Provider and Data Consumer each see a different console — different navigation, different data, different actions — enforced the same way on the client and (for real data) on the backend.
4. **Every action is logged immutably.** A hash-chained audit ledger records every registration, consent decision, and training run, so institutions and regulators can verify compliance after the fact.
5. **Insights over raw rows.** Dashboards surface aggregate-only analytics — FL round accuracy, privacy-budget spend, category mix — never individual records.

In short: institutions get the *value* of shared data (benchmarks, trained models, cross-institution insight) without the *liability* of shared raw data.

## Tech stack

| Layer | Technology | Why |
| --- | --- | --- |
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19) | Full-stack React framework — file-based routing, SSR, and type-safe server functions (`createServerFn`) in one cohesive toolchain |
| **Routing** | TanStack Router | Fully type-safe, file-based routes with role-aware navigation |
| **Language** | TypeScript (strict mode) | End-to-end type safety from database document to rendered pixel |
| **Styling** | Tailwind CSS v4 + a custom neo-brutalist design system (`nb.tsx`) | Thick borders, hard offset shadows, high-contrast flat color — fast to build, accessible, and visually distinct from generic dashboard templates |
| **UI primitives** | Radix UI (via shadcn-style components) | Accessible, unstyled primitives (dialogs, dropdowns, tabs, etc.) skinned to the design system |
| **Data fetching / state** | TanStack Query | Caching, invalidation and optimistic UI for every list and mutation |
| **Charts** | Recharts | FL accuracy trend, privacy-budget spend, dataset category mix |
| **Backend** | TanStack Start server functions (`*.functions.ts` / `*.server.ts`) | Type-safe RPC between browser and server — no separate REST/GraphQL layer to maintain |
| **Database** | **MongoDB Atlas** | Document model matches the domain naturally (datasets, requests, institutions, jobs, audit entries); managed cluster removes ops overhead |
| **Auth (demo)** | Local role-based session (localStorage) + a client/server permission matrix | Three demo identities (Admin / Provider / Consumer) so the workflow can be explored immediately without a registration flow |
| **Notifications** | Sonner (toasts) | Immediate feedback on every mutation |
| **Deployment target** | Nitro (Cloudflare Workers-compatible build) | One build produces a static client bundle + a portable server bundle deployable to Cloudflare, Node, or any Nitro-supported target |

## Feasibility

**Technical feasibility — high.** Every component is a mature, widely-adopted open-source technology (React, MongoDB, Tailwind). No novel infrastructure is required to run the console itself; the "federated learning" and "differential privacy" layer in a production build would sit behind the same `*.server.ts` boundary already established for data access, using established libraries (e.g. Flower, PySyft, or a custom FedAvg/DP-SGD service) without changing the front-end contract.

**Economic feasibility — high.** The entire stack is open-source and free at the tiers used here. MongoDB Atlas has a free tier sufficient for a pilot deployment across a handful of institutions; hosting the app costs nothing beyond a small Cloudflare Workers / Node hosting bill as usage grows.

**Operational feasibility — high.** Institutions don't need to install anything — the console is a web app. Onboarding a new institution is an admin action (`/dashboard/institutions` → Verify), not a deployment.

**Regulatory feasibility — by design.** The consent-and-audit model is built to map directly onto **DPDP Act 2023** obligations (purpose limitation, consent records, breach traceability) rather than bolted on afterward.

**Scalability.** MongoDB scales horizontally; the federated-learning workload is inherently distributed (compute happens at each institution, not centrally), so the orchestrator's load grows with the number of *rounds*, not the number of *records*.

## Role-based user workflows

Cyphora ships three roles, each with its own navigation, permissions and dashboard views.

### 🛡️ Network Admin — *governs the network*

| Step | Action |
| --- | --- |
| 1 | Sign in → lands on **Overview**: verified-institution count, pending requests, active FL jobs, total datasets — all live from the database |
| 2 | **Institutions** → reviews new applicants, **Verifies** or **Suspends** membership |
| 3 | **Access & consent** → has visibility into every request across the network and can approve/reject on an institution's behalf if needed |
| 4 | **Insights** → monitors network-wide FL accuracy trend and privacy-budget spend |
| 5 | **Audit ledger** → reviews the full hash-chained log for compliance reporting |
| 6 | **Federated jobs** → starts/monitors cross-institution training jobs |

**Permissions:** `datasets.read`, `requests.approve`, `insights.read`, `audit.read`, `institutions.manage`, `consent.manage`, `federated.run`.

### 🏫 Data Provider — *owns and shares institutional data*

| Step | Action |
| --- | --- |
| 1 | Sign in → **Overview** shows datasets registered by their institution, pending consent requests, active FL jobs |
| 2 | **Datasets** → **Register dataset** (name, category, record count, sensitivity, privacy budget ε, consent policy) — persisted straight to MongoDB |
| 3 | **Access & consent** → reviews incoming requests from other institutions, **Approves** or **Rejects** each one |
| 4 | **Federated jobs** → runs a local training node; only encrypted model updates leave the institution |
| 5 | **Insights** → tracks the institution's own contribution to network accuracy |

**Permissions:** `datasets.read`, `datasets.write`, `requests.approve`, `consent.manage`, `insights.read`, `federated.run`, `audit.read`.

### 🎓 Data Consumer — *queries aggregate insight*

| Step | Action |
| --- | --- |
| 1 | Sign in → **Overview** shows requests raised, approvals received, discoverable (non-locked) datasets |
| 2 | **Datasets** → browses the open/discoverable catalogue (read-only) |
| 3 | **Access & consent** → **Raise request**: pick a dataset, state the purpose, propose a privacy budget |
| 4 | Waits for the owning institution to approve — status updates live |
| 5 | **Insights** / **Federated jobs** → once approved, explores aggregate results and federated model outputs |

**Permissions:** `requests.create`, `insights.read`, `federated.run`.

> Every list and mutation above is enforced through a single permission matrix (`src/lib/auth.tsx`) shared by the navigation, the page components, and the server functions — a role that can't see a nav item also can't successfully call the underlying data mutation.

## Who uses it & how

| Persona | Uses Cyphora to… |
| --- | --- |
| **University IT / registrar office** (Admin) | Onboard partner institutions, set network-wide privacy ceilings, produce compliance reports from the audit ledger |
| **Placement cell / research office** (Provider) | Publish anonymized outcome datasets, control who can query them, run federated benchmarking without exporting a single spreadsheet |
| **Policy researchers / cross-institution committees** (Consumer) | Request specific, purpose-bound aggregate insights (e.g. "regional employability index") without ever seeing a single student's record |
| **Regulators / auditors** | Independently verify, via the hash-chained ledger, that every access was consented and every computation stayed within its declared privacy budget |

## Benefits / how it helps

- **Removes the raw-data bottleneck** — institutions collaborate on benchmarks and models that were previously impossible to share at all.
- **Cuts compliance risk** — every request has a purpose, a budget, an approver and a timestamp; nothing is "just emailed."
- **Builds cross-institution trust incrementally** — the verification + trust-score model on the Institutions page gives admins a lever short of all-or-nothing access.
- **Turns audit from a fire drill into a standing feature** — the ledger exists continuously, not reconstructed after an incident.
- **One console for three very different jobs** — an admin, a data owner and a data requester never see irrelevant controls, which lowers training time and misuse risk.

## How it's better than existing approaches

| Existing approach | Limitation | Cyphora |
| --- | --- | --- |
| Email / shared spreadsheets | No access control, no audit trail, raw PII travels | Data never leaves the source institution; only encrypted updates or DP aggregates move |
| Centralized data warehouse | Single point of breach; one institution must trust a third party with everyone's raw data | Federated architecture — no central party ever holds raw records from every institution |
| Generic BI/analytics dashboards | Built for one organization's own data, not consent-gated cross-institution sharing | Purpose-built consent workflow with per-request privacy budgets and RBAC across institutions |
| Manual MoUs / bilateral agreements per data request | Slow, doesn't scale past a handful of partners, no standing technical enforcement | Institution verification is a one-time step; every subsequent request reuses the same enforced policy engine |
| Ad-hoc "anonymized CSV" sharing | "Anonymization" is often reversible; no record of what was shared or why | Differential-privacy-budgeted queries plus an immutable audit hash chain |

## Why choose Cyphora

- It solves the **actual blocker** (trust + compliance), not just the UI layer — the consent/audit/RBAC model is the product, the dashboard is how you touch it.
- It's **role-correct from day one**: an admin, a provider and a consumer are structurally different users with different risks, and the product treats them that way instead of hiding everything behind one generic "user" role with checkboxes.
- It's built on a **stack that scales into the real implementation** — the same server-function boundary that talks to MongoDB today is where a production FL/DP service plugs in tomorrow, with no UI rewrite.
- It gives institutions and regulators something rarer than a dashboard: a **provable trail** of who accessed what, under what stated purpose, and within what privacy budget.

---

## Getting started locally

```sh
git clone https://github.com/deba2k5/neobrutal-ui-suite.git
cd neobrutal-ui-suite
npm install
cp .env.example .env   # fill in your own MongoDB connection string
npm run dev
```

Open the printed local URL, go to `/login`, and pick any of the three demo identities (Admin / Provider / Consumer) to explore the corresponding console — no registration needed. The database seeds itself from demo data on first run.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas (or self-hosted) connection string |
| `MONGODB_DB` | Database name (defaults to `cyphora`) |

## Project structure

```
src/
├── routes/                    # File-based routes (TanStack Router)
│   ├── index.tsx              # Public landing page
│   ├── login.tsx              # Role-based demo sign-in
│   └── dashboard.*.tsx        # Role-gated console pages (overview, datasets,
│                               #   requests, insights, federated jobs, audit,
│                               #   institutions, settings)
├── lib/
│   ├── auth.tsx                # Role/permission matrix + demo auth context
│   ├── mock-data.ts            # Seed data + shared domain types
│   ├── api.functions.ts        # createServerFn RPCs consumed by the UI
│   └── server/
│       ├── db.server.ts        # MongoDB client singleton
│       └── store.server.ts     # Seeding, id generation, audit-entry helper
└── components/
    ├── nb.tsx                  # Neo-brutalist design system primitives
    └── ui/                     # Radix-based accessible UI components
```

---

Built with ❤️ by **Team Cyphora** for Smart India Hackathon 2026.
