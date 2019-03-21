import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentService {
	result: any;
	err: any;

	@Output() onSelect: EventEmitter<Comment> = new EventEmitter();
	@Output() onReply: EventEmitter<boolean> = new EventEmitter();

	constructor(private http: HttpClient) {
	}

	getComments(id: string) {
		return this.http.get('/api/comments/' + id);
	}

	// TODO: Same API endpoint as getComments(id). - That surely cannot be right...
	getComment(id) {
		return this.http.get('/api/comments/' + id);
	}

	createComment(comment) {
		return this.http.post('/api/comments/', comment);
	}

	deleteComment(id) {
		return this.http.delete('/api/comments/' + id);
	}

	upvote(id: string, voterId: string) {
		return this.http.put('/api/comments/upvote/' + id, { voterId: voterId });
	}

	downvote(id: string, voterId: string) {
		return this.http.put('/api/comments/downvote/' + id, { voterId: voterId });
	}

}