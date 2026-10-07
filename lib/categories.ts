import type { Category } from "@/types/category";

const categories: Category[] = [];

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function categoryNameExists(
  name: string,
  excludeId?: string
): boolean {
  const normalizedName = name.trim().toLowerCase();

  return categories.some(
    (category) =>
      category.name.trim().toLowerCase() === normalizedName &&
      category.id !== excludeId
  );
}

export function createCategory(category: Category): Category {
  categories.push(category);
  return category;
}

export function updateCategory(
  id: string,
  name: string
): Category | undefined {
  const category = categories.find((item) => item.id === id);

  if (!category) {
    return undefined;
  }

  category.name = name.trim();
  category.updatedAt = new Date().toISOString();

  return category;
}

export function deleteCategory(id: string): boolean {
  const index = categories.findIndex((category) => category.id === id);

  if (index === -1) {
    return false;
  }

  categories.splice(index, 1);
  return true;
}