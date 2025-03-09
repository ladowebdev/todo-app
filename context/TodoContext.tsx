import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, TodoContextType } from '@/types/todo';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health'];

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedTodos, storedCategories] = await Promise.all([
        AsyncStorage.getItem('todos'),
        AsyncStorage.getItem('categories')
      ]);
      
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
      
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const saveCategories = async (newCategories: string[]) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(newCategories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      category: todo.category || 'Personal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const updateTodo = (id: string, updatedTodo: Partial<Todo>) => {
    const newTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, ...updatedTodo, updatedAt: new Date().toISOString() }
        : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const reorderTodos = (from: number, to: number) => {
    const newTodos = [...todos];
    const [removed] = newTodos.splice(from, 1);
    newTodos.splice(to, 0, removed);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      saveCategories(newCategories);
    }
  };

  const deleteCategory = (category: string) => {
    if (category === 'Personal') return; // Prevent deletion of default category
    const newCategories = categories.filter(c => c !== category);
    setCategories(newCategories);
    saveCategories(newCategories);
    
    // Update todos in deleted category to 'Personal'
    const newTodos = todos.map(todo => 
      todo.category === category 
        ? { ...todo, category: 'Personal', updatedAt: new Date().toISOString() }
        : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  return (
    <TodoContext.Provider value={{ 
      todos, 
      categories,
      addTodo, 
      updateTodo, 
      deleteTodo, 
      reorderTodos,
      addCategory,
      deleteCategory
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}