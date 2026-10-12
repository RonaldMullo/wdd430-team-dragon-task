export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  dueDate: string;
  categoryId?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
