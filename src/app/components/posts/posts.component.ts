import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss'],
	animations: [
		trigger('fadeInOut', [
			state('void', style({
				height: 0,
				opacity: 0
			})),
			transition(':enter', [
				style({
					height: 'auto'
				}),
				animate('300ms ease-in')
			]),
			transition('void <=> *', animate(300)),
		]),

		trigger('EnterLeave', [
			state('flyIn', style({ transform: 'translateX(0)' })),
			transition(':enter', [
				style({
					transform: 'translateX(-100%)'
				}),
				animate('300ms cubic-bezier(.87,-.41,.19,1.44)')
			]),
			transition(':leave', [
				animate('500ms cubic-bezier(.87,-.41,.19,1.44)', style({
					transform: 'translateX(100%)',
					opacity: 0
				}))
			])
		])
	]
})
export class PostsComponent implements OnInit {

	isLoggedIn: boolean;
	posts: Post[];
	postForm: FormGroup;
	userId = '';

	constructor(private postService: PostService, private formBuilder: FormBuilder, private authService: AuthService) {
		this.isLoggedIn = authService.isLoggedIn();
	}

	ngOnInit() {
		this.getPosts();
		this.postForm = this.formBuilder.group({
			title: ['', [Validators.required, Validators.maxLength(100)]],
			subtitle: ['', [Validators.maxLength(100)]],
			content: ['', [Validators.required, Validators.maxLength(1000)]]
		});
	}

	get title() { return this.postForm.get('title'); }
	get subtitle() { return this.postForm.get('title'); }
	get content() { return this.postForm.get('content'); }

	getErrorMessage() {
		const errorMsg = {
			titleError: this.title.hasError('required') ? 'Title is required.' :
				this.title.hasError('maxlength') ? 'Maximum 100 characters.' : '',
			subtitleError: this.subtitle.hasError('maxlength') ? 'Maximum 100 characters.' : '',
			contentError: this.content.hasError('required') ? 'Post content is required.' :
				this.content.hasError('maxlength') ? 'Maximum 1000 characters.' : ''
		};
		return errorMsg;
	}

	getPosts(): void {
		this.postService.getPosts().subscribe((posts: Post[]) => {
			this.posts = posts;
			console.log(this.posts);
		});
	}

	createPost() {
		if (!this.postForm.valid) return;

		else {
			let newPost = {
				authorId: localStorage.getItem('userId'),
				author: localStorage.getItem('username'),
				title: this.title.value,
				subtitle: this.subtitle.value,
				content: this.content.value
			};
			this.postService.createPost(newPost).subscribe((res: Post) => {
				this.posts.push(res);
			});
			this.postForm.reset();
		}
	}

	deletePost(id: string) {
		this.postService.deletePost(id).subscribe(
			res => this.posts.forEach((post, index) => {
				console.log(res); // TODO: Push message through some notification service
				if (post._id === id) this.posts.splice(index, 1);
			}),
			err => console.log(err)  // TODO: Push message through some notification service
		);
	}

	// TODO: Fix problem upvote/downvote problem by embedding post component into posts markup
	upvote(id: string): void {
		let voterId = localStorage.getItem('postId')
		this.postService.upvote(id, voterId).subscribe((res: Post) => {
			this.posts.forEach((post, index) => {
				if (post._id === res._id) this.posts[index] = res;
				// if (post._id === res._id) this.posts[index].upvoters = res.upvoters;
			});
		});
	}

	// TODO: Fix problem upvote/downvote problem by embedding post component into posts markup
	downvote(id: string): void {
		let voterId = localStorage.getItem('postId')
		this.postService.downvote(id, voterId).subscribe((res: Post) => {
			this.posts.forEach((post, index) => {
				if (post._id === res._id) this.posts[index] = res;
				// if (post._id === res._id) this.posts[index].downvoters = res.downvoters;
			});
		});
	}

}
