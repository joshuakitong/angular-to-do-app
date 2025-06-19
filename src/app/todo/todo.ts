import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo-service';
import { TodoItem } from './todo-item';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css']
})
export class Todo {
  todos: TodoItem[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  editingTodoId: number | null = null;

  constructor(private todoService: TodoService, private dialog: MatDialog) {
    this.loadTodos();
  }

  loadTodos() {
    this.todos = this.todoService.getTodos();
  }

  onSubmit(form: NgForm) {
    if (!this.newTodoTitle.trim()) return;

    if (this.editingTodoId !== null) {
      this.todoService.updateTodo(this.editingTodoId, {
        title: this.newTodoTitle.trim(),
        description: this.newTodoDescription.trim()
      });
    } else {
      this.todoService.addTodo(this.newTodoTitle.trim(), this.newTodoDescription.trim());
    }

    this.loadTodos();
    this.resetForm(form);
  }

  toggleCompleted(todo: TodoItem) {
    this.todoService.updateTodo(todo.id, { completed: !todo.completed });
    this.loadTodos();
  }

  deleteTodo(todo: TodoItem) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    data: { title: todo.title }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.todoService.deleteTodo(todo.id);
      this.loadTodos();
    }
  });
}

  editTodo(todo: TodoItem) {
    this.newTodoTitle = todo.title;
    this.newTodoDescription = todo.description;
    this.editingTodoId = todo.id;
  }

  resetForm(form: NgForm) {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.editingTodoId = null;

    form.resetForm({
      title: '',
      description: ''
    });
  }
}