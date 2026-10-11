
import type { Category } from "@/types/category";
import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "categories";

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();

  return db.collection<Category>(COLLECTION).find({}).toArray();
}

export async function getCategoryById(
  id: string
): Promise<Category | null> {
  const db = await getDatabase();

  return db.collection<Category>(COLLECTION).findOne({ id });
}

export async function categoryNameExists(
  name: string,
  excludeId?: string
): Promise<boolean> {
  const db = await getDatabase();
  const normalizedName = name.trim();

  const category = await db.collection<Category>(COLLECTION).findOne({
    name: {
      $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
    ...(excludeId ? { id: { $ne: excludeId } } : {}),
  });

  return category !== null;
}

export async function createCategory(
  category: Category
): Promise<Category> {
  const db = await getDatabase();

  await db.collection<Category>(COLLECTION).insertOne(category);

  return category;
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category | null> {
  const db = await getDatabase();

  return db.collection<Category>(COLLECTION).findOneAndUpdate(
    { id },
    {
      $set: {
        name: name.trim(),
        updatedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function deleteCategory(
  id: string
): Promise<boolean> {
  const db = await getDatabase();

  const result = await db
    .collection<Category>(COLLECTION)
    .deleteOne({ id });

  return result.deletedCount === 1;
}
