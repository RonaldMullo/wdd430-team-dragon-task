import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connectToMongoDB(): Promise<MongoClient> {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri!, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    globalThis._mongoClientPromise = client.connect().catch((error) => {
      globalThis._mongoClientPromise = undefined;
      throw error;
    });
  }

  return globalThis._mongoClientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await connectToMongoDB();
  return client.db("DragonTaskDB");
}
