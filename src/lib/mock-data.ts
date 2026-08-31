export type DatasetSensitivity = "low" | "medium" | "high";

export type Dataset = {
  id: string;
  name: string;
  owner: string;
  category: string;
  records: number;
  sensitivity: DatasetSensitivity;
  epsilon: number;
  consent: "open" | "on-request" | "locked";
  updated: string;
};

export const DATASETS: Dataset[] = [
  {
    id: "DS-1041",
    name: "Placement Outcomes 2021-2026",
    owner: "IIT Kharagpur",
    category: "Academic",
    records: 48210,
    sensitivity: "medium",
    epsilon: 0.8,
    consent: "on-request",
    updated: "2026-08-24",
  },
  {
    id: "DS-1042",
    name: "Research Grant Ledger",
    owner: "IIT Kharagpur",
    category: "Research",
    records: 3120,
    sensitivity: "high",
    epsilon: 0.4,
    consent: "locked",
    updated: "2026-08-28",
  },
  {
    id: "DS-1043",
    name: "Library Utilisation Telemetry",
    owner: "Anna University",
    category: "Administrative",
    records: 921400,
    sensitivity: "low",
    epsilon: 2.5,
    consent: "open",
    updated: "2026-08-30",
  },
  {
    id: "DS-1044",
    name: "Dropout Risk Cohort",
    owner: "Jadavpur University",
    category: "Academic",
    records: 15980,
    sensitivity: "high",
    epsilon: 0.3,
    consent: "on-request",
    updated: "2026-08-19",
  },
  {
    id: "DS-1045",
    name: "Lab Equipment Registry",
    owner: "NIT Trichy",
    category: "Administrative",
    records: 7420,
    sensitivity: "low",
    epsilon: 3,
    consent: "open",
    updated: "2026-08-12",
  },
  {
    id: "DS-1046",
    name: "Faculty Publication Index",
    owner: "JNU",
    category: "Research",
    records: 26100,
    sensitivity: "medium",
    epsilon: 1.1,
    consent: "on-request",
    updated: "2026-08-29",
  },
];

export type AccessRequest = {
  id: string;
  dataset: string;
  requester: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "expired";
  privacyBudget: number;
  raised: string;
};

export const REQUESTS: AccessRequest[] = [
  {
    id: "REQ-8801",
    dataset: "Dropout Risk Cohort",
    requester: "JNU · Prof. Meera Iyer",
    purpose: "Cross-institution retention benchmark study",
    status: "pending",
    privacyBudget: 0.6,
    raised: "2026-08-30",
  },
  {
    id: "REQ-8802",
    dataset: "Placement Outcomes 2021-2026",
    requester: "Anna University · Placement Cell",
    purpose: "Regional employability index",
    status: "pending",
    privacyBudget: 1.2,
    raised: "2026-08-29",
  },
  {
    id: "REQ-8803",
    dataset: "Faculty Publication Index",
    requester: "IIT Kharagpur · Research Office",
    purpose: "Federated citation impact model",
    status: "approved",
    privacyBudget: 0.9,
    raised: "2026-08-22",
  },
  {
    id: "REQ-8804",
    dataset: "Research Grant Ledger",
    requester: "External · MedTech Pvt Ltd",
    purpose: "Commercial funding analysis",
    status: "rejected",
    privacyBudget: 2.4,
    raised: "2026-08-18",
  },
  {
    id: "REQ-8805",
    dataset: "Library Utilisation Telemetry",
    requester: "NIT Trichy · Admin",
    purpose: "Resource-sharing schedule optimisation",
    status: "approved",
    privacyBudget: 1.8,
    raised: "2026-08-11",
  },
  {
    id: "REQ-8806",
    dataset: "Lab Equipment Registry",
    requester: "Jadavpur University · Dean",
    purpose: "Shared instrumentation planning",
    status: "expired",
    privacyBudget: 1,
    raised: "2026-07-30",
  },
];

export type Institution = {
  id: string;
  name: string;
  city: string;
  status: "verified" | "pending" | "suspended";
  nodes: number;
  datasets: number;
  trust: number;
};

export const INSTITUTIONS: Institution[] = [
  {
    id: "INS-01",
    name: "IIT Kharagpur",
    city: "Kharagpur",
    status: "verified",
    nodes: 4,
    datasets: 12,
    trust: 96,
  },
  {
    id: "INS-02",
    name: "Jawaharlal Nehru University",
    city: "New Delhi",
    status: "verified",
    nodes: 2,
    datasets: 8,
    trust: 91,
  },
  {
    id: "INS-03",
    name: "Anna University",
    city: "Chennai",
    status: "verified",
    nodes: 3,
    datasets: 9,
    trust: 88,
  },
  {
    id: "INS-04",
    name: "Jadavpur University",
    city: "Kolkata",
    status: "pending",
    nodes: 1,
    datasets: 4,
    trust: 64,
  },
  {
    id: "INS-05",
    name: "NIT Trichy",
    city: "Tiruchirappalli",
    status: "verified",
    nodes: 2,
    datasets: 6,
    trust: 84,
  },
  {
    id: "INS-06",
    name: "Symbiosis International",
    city: "Pune",
    status: "suspended",
    nodes: 0,
    datasets: 2,
    trust: 31,
  },
];

export type AuditEntry = {
  id: string;
  hash: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  severity: "info" | "warn" | "critical";
};

export const AUDIT: AuditEntry[] = [
  {
    id: "LOG-99120",
    hash: "0x9f31c…a4e7",
    actor: "admin@cyphora.in",
    action: "POLICY_UPDATED",
    target: "Global epsilon ceiling → 2.0",
    at: "2026-08-31 18:04",
    severity: "warn",
  },
  {
    id: "LOG-99119",
    hash: "0x71b0d…3c19",
    actor: "provider@iitkgp.ac.in",
    action: "CONSENT_GRANTED",
    target: "REQ-8803 · Faculty Publication Index",
    at: "2026-08-31 16:22",
    severity: "info",
  },
  {
    id: "LOG-99118",
    hash: "0x2ad4f…88b2",
    actor: "consumer@jnu.ac.in",
    action: "QUERY_EXECUTED",
    target: "Aggregate: retention by cohort (ε 0.2)",
    at: "2026-08-31 15:47",
    severity: "info",
  },
  {
    id: "LOG-99117",
    hash: "0xc10ae…7710",
    actor: "external@medtech.io",
    action: "ACCESS_DENIED",
    target: "REQ-8804 · Research Grant Ledger",
    at: "2026-08-30 11:12",
    severity: "critical",
  },
  {
    id: "LOG-99116",
    hash: "0x55f8b…d201",
    actor: "orchestrator",
    action: "FL_ROUND_COMPLETE",
    target: "Round 41 · 9 nodes · secure aggregation",
    at: "2026-08-30 09:00",
    severity: "info",
  },
  {
    id: "LOG-99115",
    hash: "0x0e93c…1f6a",
    actor: "admin@cyphora.in",
    action: "INSTITUTION_SUSPENDED",
    target: "Symbiosis International",
    at: "2026-08-29 20:38",
    severity: "warn",
  },
];

export const FL_ROUNDS = [
  { round: "36", accuracy: 71, loss: 0.54, nodes: 6 },
  { round: "37", accuracy: 74, loss: 0.49, nodes: 7 },
  { round: "38", accuracy: 78, loss: 0.42, nodes: 7 },
  { round: "39", accuracy: 82, loss: 0.36, nodes: 8 },
  { round: "40", accuracy: 86, loss: 0.29, nodes: 9 },
  { round: "41", accuracy: 89, loss: 0.24, nodes: 9 },
];

export const IMPACT = [
  { metric: "Data security", before: 30, after: 80 },
  { metric: "Collaboration", before: 35, after: 75 },
  { metric: "Sharing speed", before: 40, after: 85 },
  { metric: "Resource use", before: 45, after: 80 },
  { metric: "Decisions", before: 50, after: 90 },
];

export const BUDGET_SPEND = [
  { day: "Mon", spent: 0.4 },
  { day: "Tue", spent: 0.9 },
  { day: "Wed", spent: 0.6 },
  { day: "Thu", spent: 1.4 },
  { day: "Fri", spent: 1.1 },
  { day: "Sat", spent: 0.3 },
  { day: "Sun", spent: 0.2 },
];

export const CATEGORY_MIX = [
  { name: "Academic", value: 42 },
  { name: "Research", value: 31 },
  { name: "Administrative", value: 27 },
];

export type FLJob = {
  id: string;
  name: string;
  algorithm: string;
  nodes: number;
  status: "training" | "aggregating" | "complete" | "queued";
  round: number;
  accuracy: number;
  epsilon: number;
};

export const FL_JOBS: FLJob[] = [
  {
    id: "FL-204",
    name: "Retention Risk Classifier",
    algorithm: "FedAvg + DP-SGD",
    nodes: 9,
    status: "training",
    round: 41,
    accuracy: 89,
    epsilon: 0.8,
  },
  {
    id: "FL-203",
    name: "Placement Salary Regressor",
    algorithm: "FedProx",
    nodes: 6,
    status: "aggregating",
    round: 18,
    accuracy: 77,
    epsilon: 1.2,
  },
  {
    id: "FL-202",
    name: "Research Cluster Discovery",
    algorithm: "Federated K-Means",
    nodes: 5,
    status: "complete",
    round: 60,
    accuracy: 93,
    epsilon: 1.5,
  },
  {
    id: "FL-205",
    name: "Library Demand Forecast",
    algorithm: "FedAvg",
    nodes: 4,
    status: "queued",
    round: 0,
    accuracy: 0,
    epsilon: 2,
  },
];
