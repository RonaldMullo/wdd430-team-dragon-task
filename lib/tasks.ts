import type { Task } from "@/types/task";

const tasks: Task[] = [];

export function getTasks(): Task[] {
  return tasks;
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function createTask(task: Task): Task {
  tasks.push(task);
  return task;
}

export function updateTask(
  id: string,
  updates: Partial<Task>
): Task | undefined {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return undefined;
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    id: tasks[index].id,
    updatedAt: new Date().toISOString(),
  };

  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}