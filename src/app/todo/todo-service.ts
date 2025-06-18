import { Injectable } from '@angular/core';
import { TodoItem } from './todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: TodoItem[] = [];
  private nextId = 1;

  getTodos(): TodoItem[] {
    return this.todos;
  }

  addTodo(title: string, description: string): void {
    const todo: TodoItem = {
      id: this.nextId++,
      title,
      description,
      completed: false
    };
    this.todos.push(todo);
  }

  updateTodo(id: number, changes: Partial<TodoItem>): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      Object.assign(todo, changes);
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}