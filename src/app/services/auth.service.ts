import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './../models/User';

@Injectable()
export class AuthService {
	@Output() _isLoggedIn = new EventEmitter<boolean>();

	constructor(private http: HttpClient) { }

	isLoggedIn(): boolean {
		if (!!!localStorage.getItem('token')) this._isLoggedIn.emit(false);
		else this._isLoggedIn.emit(true);
		return !!localStorage.getItem('token');
		// Implement some kinda notification service to flash a 'login required' message if false
	}

	getToken() {
		return localStorage.getItem('token');
	}

	getUserId() {
		return localStorage.getItem('userId');
	}

	register(user: User): Observable<any> {
		return this.http.post('/api/register', user);
	}
	// { username: user.username, email: user.email, password: user.password }

	// register(username: string, email: string, password: string): Observable<any> {
	// 	return this.http.post('/api/register', { username: username, email: email, password: password });
	// }

	login(email: string, password: string): Observable<any> {
		this._isLoggedIn.emit(true);
		return this.http.post('/api/login', { email: email, password: password });
	}

	logout() {
		this._isLoggedIn.emit(false);
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('username');
	}

}
