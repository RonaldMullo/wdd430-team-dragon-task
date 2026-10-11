
import type { Task } from "@/types/task";
import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "tasks";

export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();

  return db
    .collection<Task>(COLLECTION)
    .find({})
    .toArray();
}

export async function getTaskById(
  id: string
): Promise<Task | null> {
  const db = await getDatabase();

  return db.collection<Task>(COLLECTION).findOne({ id });
}

export async function createTask(task: Task): Promise<Task> {
  const db = await getDatabase();

  await db.collection<Task>(COLLECTION).insertOne(task);

  return task;
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const db = await getDatabase();
  const collection = db.collection<Task>(COLLECTION);

  const { id: _ignoredId, ...safeUpdates } = updates;

  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        ...safeUpdates,
        updatedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );

  return result;
}

export async function deleteTask(
  id: string
): Promise<boolean> {
  const db = await getDatabase();

  const result = await db
    .collection<Task>(COLLECTION)
    .deleteOne({ id });

  return result.deletedCount === 1;
}
