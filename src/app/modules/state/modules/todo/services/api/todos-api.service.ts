import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo';

const apiUrl = 'api/todos/';

@Injectable({
  providedIn: 'root',
})
export class TodosApiService {
  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(apiUrl);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(apiUrl, todo);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(apiUrl + todo.id, todo);
  }

  deleteTodo(todo: Todo): Observable<void> {
    return this.http.delete<void>(apiUrl + todo.id);
  }
}
