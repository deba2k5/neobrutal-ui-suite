import "dotenv/config";
import { MongoClient, type Db } from "mongodb";

const uri = process.env["MONGODB_URI"];
const dbName = process.env["MONGODB_DB"] ?? "cyphora";

declare global {
  // eslint-disable-next-line no-var
  var __cyphoraMongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill in your connection string.");
  }
  if (!global.__cyphoraMongoClientPromise) {
    global.__cyphoraMongoClientPromise = new MongoClient(uri).connect();
  }
  return global.__cyphoraMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
