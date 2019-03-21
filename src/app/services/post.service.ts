import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostService {
	result: any;
	err: any;

	constructor(private http: HttpClient) { }

	getPosts() {
		return this.http.get('/api/posts');
	}

	getPost(id) {
		return this.http.get('/api/posts/' + id);
	}

	createPost(post) {
		return this.http.post('/api/posts/', post);
	}

	deletePost(id) {
		return this.http.delete('/api/posts/' + id);
	}

	upvote(id: string, voterId: string) {
		return this.http.put('/api/posts/upvote/' + id, { voterId: voterId });
	}

	downvote(id: string, voterId: string) {
		return this.http.put('/api/posts/downvote/' + id, { voterId: voterId });
	}
}