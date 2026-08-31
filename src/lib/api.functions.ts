import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/server/db.server";
import {
  ensureSeeded,
  nextDatasetId,
  nextRequestId,
  appendAudit,
} from "@/lib/server/store.server";
import type {
  Dataset,
  DatasetSensitivity,
  AccessRequest,
  Institution,
  AuditEntry,
  FLJob,
} from "@/lib/mock-data";

const NO_ID = { projection: { _id: 0 } } as const;

async function ready() {
  await ensureSeeded();
  return getDb();
}

// Mongo's typed find() infers `_id: ObjectId` even under a `{ _id: 0 }`
// projection, and ObjectId's methods trip Start's serializable-return check.
// The projection genuinely strips `_id` at runtime; this just tells TS that.
function stripId<T>(docs: unknown[]): T[] {
  return docs as T[];
}

function stripOneId<T>(doc: unknown): T | null {
  return (doc ?? null) as T | null;
}

/* --- Datasets --- */

export const listDatasets = createServerFn({ method: "GET" }).handler(async () => {
  const db = await ready();
  const docs = await db.collection("datasets").find({}, NO_ID).sort({ updated: -1 }).toArray();
  return stripId<Dataset>(docs);
});

type NewDataset = {
  name: string;
  owner: string;
  category: string;
  records: number;
  sensitivity: DatasetSensitivity;
  epsilon: number;
  consent: Dataset["consent"];
  actor: string;
};

export const createDataset = createServerFn({ method: "POST" })
  .validator((data: NewDataset) => data)
  .handler(async ({ data }) => {
    const db = await ready();
    const id = await nextDatasetId(db);
    const doc: Dataset = {
      id,
      name: data.name,
      owner: data.owner,
      category: data.category,
      records: data.records,
      sensitivity: data.sensitivity,
      epsilon: data.epsilon,
      consent: data.consent,
      updated: new Date().toISOString().slice(0, 10),
    };
    // insertOne mutates `doc` by attaching a Mongo `_id`; return a clean
    // copy made before the call so the response stays plain-serializable.
    const response = { ...doc };
    await db.collection("datasets").insertOne(doc);
    await appendAudit(db, {
      actor: data.actor,
      action: "DATASET_REGISTERED",
      target: `${id} · ${doc.name}`,
      severity: "info",
    });
    return response;
  });

/* --- Access & consent requests --- */

export const listRequests = createServerFn({ method: "GET" }).handler(async () => {
  const db = await ready();
  const docs = await db.collection("requests").find({}, NO_ID).sort({ raised: -1 }).toArray();
  return stripId<AccessRequest>(docs);
});

type NewRequest = {
  dataset: string;
  requester: string;
  purpose: string;
  privacyBudget: number;
  actor: string;
};

export const createRequest = createServerFn({ method: "POST" })
  .validator((data: NewRequest) => data)
  .handler(async ({ data }) => {
    const db = await ready();
    const id = await nextRequestId(db);
    const doc: AccessRequest = {
      id,
      dataset: data.dataset,
      requester: data.requester,
      purpose: data.purpose,
      status: "pending",
      privacyBudget: data.privacyBudget,
      raised: new Date().toISOString().slice(0, 10),
    };
    const response = { ...doc };
    await db.collection("requests").insertOne(doc);
    await appendAudit(db, {
      actor: data.actor,
      action: "REQUEST_RAISED",
      target: `${id} · ${data.dataset}`,
      severity: "info",
    });
    return response;
  });

type SetRequestStatus = { id: string; status: AccessRequest["status"]; actor: string };

export const setRequestStatus = createServerFn({ method: "POST" })
  .validator((data: SetRequestStatus) => data)
  .handler(async ({ data }) => {
    const db = await ready();
    await db.collection("requests").updateOne({ id: data.id }, { $set: { status: data.status } });
    await appendAudit(db, {
      actor: data.actor,
      action: data.status === "approved" ? "CONSENT_GRANTED" : "CONSENT_DENIED",
      target: data.id,
      severity: data.status === "rejected" ? "warn" : "info",
    });
    return { ok: true };
  });

/* --- Institutions --- */

export const listInstitutions = createServerFn({ method: "GET" }).handler(async () => {
  const db = await ready();
  const docs = await db.collection("institutions").find({}, NO_ID).sort({ name: 1 }).toArray();
  return stripId<Institution>(docs);
});

type SetInstitutionStatus = { id: string; status: Institution["status"]; actor: string };

export const setInstitutionStatus = createServerFn({ method: "POST" })
  .validator((data: SetInstitutionStatus) => data)
  .handler(async ({ data }) => {
    const db = await ready();
    const institution = stripOneId<Institution>(
      await db.collection("institutions").findOne({ id: data.id }, NO_ID),
    );
    await db.collection("institutions").updateOne({ id: data.id }, { $set: { status: data.status } });
    await appendAudit(db, {
      actor: data.actor,
      action: data.status === "verified" ? "INSTITUTION_VERIFIED" : "INSTITUTION_SUSPENDED",
      target: institution?.name ?? data.id,
      severity: data.status === "suspended" ? "warn" : "info",
    });
    return { ok: true };
  });

/* --- Audit ledger --- */

export const listAudit = createServerFn({ method: "GET" }).handler(async () => {
  const db = await ready();
  const docs = await db.collection("audit").find({}, NO_ID).sort({ id: -1 }).toArray();
  return stripId<AuditEntry>(docs);
});

/* --- Federated learning jobs --- */

export const listFLJobs = createServerFn({ method: "GET" }).handler(async () => {
  const db = await ready();
  const docs = await db.collection("flJobs").find({}, NO_ID).toArray();
  return stripId<FLJob>(docs);
});

type StartJob = { id: string; actor: string };

export const startFLJob = createServerFn({ method: "POST" })
  .validator((data: StartJob) => data)
  .handler(async ({ data }) => {
    const db = await ready();
    await db.collection("flJobs").updateOne({ id: data.id }, { $set: { status: "training" } });
    await appendAudit(db, {
      actor: data.actor,
      action: "FL_JOB_STARTED",
      target: data.id,
      severity: "info",
    });
    return { ok: true };
  });
