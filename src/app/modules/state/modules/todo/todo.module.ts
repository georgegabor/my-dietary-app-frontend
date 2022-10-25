import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FilterComponent } from './components/filter/filter.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoShellComponent } from './components/todo-shell/todo-shell.component';

@NgModule({
  declarations: [TodoShellComponent, TodoDetailComponent, FilterComponent, TodoListComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatSidenavModule],
})
export class TodoModule {}
