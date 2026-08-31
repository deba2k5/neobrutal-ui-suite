import type { Db } from "mongodb";
import { getDb } from "./db.server";
import {
  DATASETS,
  REQUESTS,
  INSTITUTIONS,
  AUDIT,
  FL_JOBS,
  type AuditEntry,
} from "@/lib/mock-data";

let seedPromise: Promise<void> | null = null;

async function seedIfEmpty(db: Db, name: string, docs: Record<string, unknown>[]) {
  const col = db.collection(name);
  const count = await col.countDocuments();
  if (count === 0 && docs.length > 0) {
    await col.insertMany(docs);
  }
}

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const db = await getDb();
      await Promise.all([
        seedIfEmpty(db, "datasets", DATASETS),
        seedIfEmpty(db, "requests", REQUESTS),
        seedIfEmpty(db, "institutions", INSTITUTIONS),
        seedIfEmpty(db, "audit", AUDIT),
        seedIfEmpty(db, "flJobs", FL_JOBS),
      ]);
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function nextSequenceId(db: Db, collection: string, prefix: string, pad: number, startAt: number) {
  const docs = await db.collection(collection).find({}, { projection: { id: 1 } }).toArray();
  let max = startAt;
  for (const doc of docs) {
    const raw = String((doc as { id?: string }).id ?? "");
    const num = Number(raw.replace(/[^0-9]/g, ""));
    if (Number.isFinite(num) && num > max) max = num;
  }
  return `${prefix}-${String(max + 1).padStart(pad, "0")}`;
}

export const nextDatasetId = (db: Db) => nextSequenceId(db, "datasets", "DS", 4, 1040);
export const nextRequestId = (db: Db) => nextSequenceId(db, "requests", "REQ", 4, 8800);
export const nextInstitutionId = (db: Db) => nextSequenceId(db, "institutions", "INS", 2, 0);
export const nextAuditId = (db: Db) => nextSequenceId(db, "audit", "LOG", 5, 99120);
export const nextJobId = (db: Db) => nextSequenceId(db, "flJobs", "FL", 3, 200);

function randomHashSegment(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function randomHash() {
  return `0x${randomHashSegment(5)}…${randomHashSegment(4)}`;
}

export async function appendAudit(
  db: Db,
  entry: { actor: string; action: string; target: string; severity: AuditEntry["severity"] },
) {
  const id = await nextAuditId(db);
  const doc: AuditEntry = {
    id,
    hash: randomHash(),
    actor: entry.actor,
    action: entry.action,
    target: entry.target,
    severity: entry.severity,
    at: new Date().toISOString().slice(0, 16).replace("T", " "),
  };
  const response = { ...doc };
  await db.collection("audit").insertOne(doc);
  return response;
}
