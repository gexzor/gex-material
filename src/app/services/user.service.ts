import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../models/User';

@Injectable()
export class UserService {
	result: any;
	err: any;
	karma = new Subject<number>();

	constructor(private http: HttpClient) { }

	getUsers() {
		return this.http.get('/api/users');
	}

	getUser(id: string) {
		return this.http.get('/api/users/' + id);
	}

	upvote(id: string, voterId: string) {
		return this.http.put('/api/users/upvote/' + id, { voterId: voterId });
	}

	downvote(id: string, voterId: string) {
		return this.http.put('/api/users/downvote/' + id, { voterId: voterId });
	}

	updateUser(user: User) {
		this.karma.next(user.upvoters.length - user.downvoters.length);
	}

	deleteUser(id) {
		return this.http.delete('/api/users/' + id);
	}

}