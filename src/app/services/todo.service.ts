import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TodoService {
	result: any;
	err: any;

	constructor(private http: HttpClient) { }

	getTodos(authorId: string) {
		return this.http.get('/api/todos/' + authorId);
	}

	createTodo(todo) {
		return this.http.post('/api/todos/', todo);
	}

	setStatus(todoId, todo) {
		return this.http.put('/api/todos/setstatus/' + todoId, todo);
	}

	deleteTodo(todoId) {
		return this.http.delete('/api/todos/' + todoId);
	}
}