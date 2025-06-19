import { Injectable } from '@angular/core';
import { TodoItem } from './todo-item';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos: TodoItem[] = [];
  private storageKey = 'my-todo-list';

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    this.todos = stored ? JSON.parse(stored) : [];
  }

  getTodos(): TodoItem[] {
    return [...this.todos];
  }

  addTodo(title: string, description: string) {
    const newTodo: TodoItem = {
      id: Date.now(),
      title,
      description,
      completed: false
    };
    this.todos.push(newTodo);
    this.saveToStorage();
  }

  updateTodo(id: number, changes: Partial<TodoItem>) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) Object.assign(todo, changes);
    this.saveToStorage();
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveToStorage();
  }
}