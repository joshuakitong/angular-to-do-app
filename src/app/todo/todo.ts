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
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatDividerModule,
    DragDropModule
  ],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css']
})
export class Todo {
  todos: TodoItem[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  editingTodoId: number | null = null;
  originalTitle = '';
  originalDescription = '';

  constructor(private todoService: TodoService, private dialog: MatDialog, private snackBar: MatSnackBar) {
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
      this.showToast(this.newTodoTitle.trim() + ' updated successfully');
    } else {
      this.todoService.addTodo(this.newTodoTitle.trim(), this.newTodoDescription.trim());
      this.showToast(this.newTodoTitle.trim() + ' added successfully');
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
        this.showToast(todo.title.trim() + ' deleted successfully');
      }
    });
  }

  editTodo(todo: TodoItem) {
    this.newTodoTitle = todo.title;
    this.newTodoDescription = todo.description;
    this.originalTitle = todo.title;
    this.originalDescription = todo.description;
    this.editingTodoId = todo.id;
  }

  cancelEdit(form: NgForm) {
    this.resetForm(form);
  }

  isUnchanged(): boolean {
    return (
      this.newTodoTitle.trim() === this.originalTitle.trim() &&
      this.newTodoDescription.trim() === this.originalDescription.trim()
    );
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

  drop(event: CdkDragDrop<TodoItem[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
    this.todoService.reorderTodos(this.todos);
  }

  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  get checkedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  deleteCheckedItems() {
  const checkedItems = this.todos.filter(todo => todo.completed);
  const count = checkedItems.length;

  const dialogRef = this.dialog.open(ConfirmDialog, {
    data: { title: `${count} completed tasks` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.todos = this.todos.filter(todo => !todo.completed);
      this.todoService.saveTodos(this.todos);
      this.showToast(`${count} item${count > 1 ? 's' : ''} deleted successfully`);
    }
  });
}
}