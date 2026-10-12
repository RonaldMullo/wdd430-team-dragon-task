import { getDatabase } from "@/lib/mongodb";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type RateLimitRecord = {
  key: string;
  count: number;
  expiresAt: Date;
};

export async function checkRegistrationRateLimit(
  key: string
): Promise<boolean> {
  if (!key.trim()) {
    return false;
  }

  const db = await getDatabase();

  const collection = db.collection<RateLimitRecord>("registrationRateLimits");

  await collection.createIndex({ key: 1 }, { unique: true });

  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MS);

  await collection.deleteOne({
    key,
    expiresAt: { $lte: now },
  });

  try {
    const result = await collection.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return result !== null && result.count <= MAX_ATTEMPTS;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return false;
    }

    throw error;
  }
}
