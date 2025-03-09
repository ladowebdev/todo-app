export interface Todo {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoContextType {
  todos: Todo[];
  categories: string[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (from: number, to: number) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
}