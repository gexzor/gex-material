import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Todo } from 'src/app/models/Todo';
import { AuthService } from 'src/app/services/auth.service';
import { TodoService } from 'src/app/services/todo.service';
import { timer, interval, of, fromEvent, Observable } from 'rxjs';
import { switchMap, mapTo, map, take } from 'rxjs/operators';
import { Event } from '@angular/router';

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
	todoList: Todo[];
	searchInput: string = '';
	isLoggedIn: boolean;
	isTiming = false;

	constructor(private authService: AuthService, private todoService: TodoService) {
		this.isLoggedIn = authService.isLoggedIn();
	}

	ngOnInit() {
		this.getTodos();

	}

	startTimer() {
	}

	getTodos(): void {
		const authorId = this.authService.getUserId();
		this.todoService.getTodos(authorId).subscribe((res: Todo[]) => {
			this.todoList = res;
		});
	}

	setStatus(todo: Todo): void {
		todo.status = (todo.status === 'TODO') ? todo.status = 'DOING' : (todo.status === 'DOING') ? todo.status = 'DONE' : todo.status = 'TODO';
		// this.todoService.setStatus(todo._id, todo).subscribe((res: Todo) => { });
	}


	deleteTodo(todo) {
		this.todoService.deleteTodo(todo._id).subscribe((res: Todo) => {
			this.todoList.forEach((item, index) => {
				if (item === todo) {
					this.todoList.splice(index, 1);
					return this.todoList;
				}
			});
		});
	}

	createTodo() {
		const newTodo = {
			authorId: this.authService.getUserId(),
			title: this.searchInput,
			description: 'some kinda description'
		};
		if (this.searchInput)
			this.todoService.createTodo(newTodo).subscribe((res: Todo) => {
				this.todoList.push(res);
			});
		this.searchInput = '';
	}


}
