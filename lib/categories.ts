import type { Category } from "@/types/category";
import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "categories";

export async function getCategories(userId: string): Promise<Category[]> {
  const db = await getDatabase();

  return db.collection<Category>(COLLECTION).find({ userId }).toArray();
}

export async function getCategoryById(
  id: string,
  userId: string
): Promise<Category | null> {
  const db = await getDatabase();

  return db.collection<Category>(COLLECTION).findOne({ id, userId });
}

export async function categoryNameExists(
  name: string,
  userId: string,
  excludeId?: string
): Promise<boolean> {
  const db = await getDatabase();

  const normalizedName = name.trim();

  const escapedName = normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const category = await db.collection<Category>(COLLECTION).findOne({
    userId,
    name: {
      $regex: `^${escapedName}$`,
      $options: "i",
    },
    ...(excludeId ? { id: { $ne: excludeId } } : {}),
  });

  return category !== null;
}

export async function createCategory(
  category: Category,
  userId: string
): Promise<Category> {
  const db = await getDatabase();

  const newCategory: Category = {
    ...category,
    userId,
  };

  await db.collection<Category>(COLLECTION).insertOne(newCategory);

  return newCategory;
}

export async function updateCategory(
  id: string,
  userId: string,
  name: string
): Promise<Category | null> {
  const db = await getDatabase();

  return db.collection<Category>(COLLECTION).findOneAndUpdate(
    { id, userId },
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
  id: string,
  userId: string
): Promise<boolean> {
  const db = await getDatabase();

  const result = await db
    .collection<Category>(COLLECTION)
    .deleteOne({ id, userId });

  return result.deletedCount === 1;
}
