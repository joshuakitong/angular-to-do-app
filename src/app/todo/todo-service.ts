import { Injectable } from '@angular/core';
import { TodoItem } from './todo-item';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private storageKey = 'todos';

  getTodos(): TodoItem[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveTodos(todos: TodoItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  addTodo(title: string, description: string) {
    const todos = this.getTodos();
    const newTodo: TodoItem = {
      id: Date.now(),
      title,
      description,
      completed: false
    };
    todos.push(newTodo);
    this.saveTodos(todos);
  }

  updateTodo(id: number, changes: Partial<TodoItem>) {
    const todos = this.getTodos().map(todo =>
      todo.id === id ? { ...todo, ...changes } : todo
    );
    this.saveTodos(todos);
  }

  deleteTodo(id: number) {
    const todos = this.getTodos().filter(todo => todo.id !== id);
    this.saveTodos(todos);
  }

  reorderTodos(newOrder: TodoItem[]) {
    this.saveTodos(newOrder);
  }
}