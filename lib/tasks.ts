import type { Task } from "@/types/task";
import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "tasks";

export async function getTasks(userId: string): Promise<Task[]> {
  const db = await getDatabase();

  return db.collection<Task>(COLLECTION).find({ userId }).toArray();
}

export async function getTaskById(
  id: string,
  userId: string
): Promise<Task | null> {
  const db = await getDatabase();

  return db.collection<Task>(COLLECTION).findOne({ id, userId });
}

export async function createTask(task: Task, userId: string): Promise<Task> {
  const db = await getDatabase();

  const newTask: Task = {
    ...task,
    userId,
  };

  await db.collection<Task>(COLLECTION).insertOne(newTask);

  return newTask;
}

export async function updateTask(
  id: string,
  userId: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const db = await getDatabase();
  const collection = db.collection<Task>(COLLECTION);

  const safeUpdates = { ...updates };

  delete safeUpdates.id;
  delete safeUpdates.userId;

  const result = await collection.findOneAndUpdate(
    { id, userId },
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

export async function deleteTask(id: string, userId: string): Promise<boolean> {
  const db = await getDatabase();

  const result = await db
    .collection<Task>(COLLECTION)
    .deleteOne({ id, userId });

  return result.deletedCount === 1;
}
