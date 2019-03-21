import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/Post';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { CommentService } from './../../services/comment.service';
import { Comment } from 'src/app/models/Comment';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
	isLoggedIn: boolean;
	params: Params;
	@Input() post;
	commentForm: FormGroup;
	comments: Comment[];

	constructor(private postService: PostService, private activatedRoute: ActivatedRoute, private router: Router, private commentService: CommentService, private formBuilder: FormBuilder, private authService: AuthService) {
		this.activatedRoute.params.subscribe(params => this.params = params);
		this.isLoggedIn = authService.isLoggedIn();
	}

	ngOnInit() {
		this.getPost(this.params.id);
		this.commentForm = this.formBuilder.group({
			content: ['', [Validators.required, Validators.maxLength(1000)]]
		});
	}

	get content() { return this.commentForm.get('content'); }

	getErrorMessage() {
		const errorMsg = {
			contentError: this.content.hasError('required') ? 'Comment content is required.' :
				this.content.hasError('maxlength') ? 'Maximum 1000 characters.' : ''
		};
		return errorMsg;
	}

	// TODO: Error Handling
	getPost(id: string): void {
		this.postService.getPost(id).subscribe((post: Post) => {
			this.post = post;
			this.getComments(post._id);
		});
	}

	deletePost(id: string) {
		this.postService.deletePost(id).subscribe(
			res => {
				this.post = null;
				this.router.navigate(['/posts/']);
				console.log(res); // TODO: Push message through some notification service
			}),
			err => console.log(err)  // TODO: Push message through some notification service
	}

	getComments(id: string): void {
		this.commentService.getComments(id).subscribe((comments: Comment[]) => {
			this.comments = comments;
		});
	}

	createComment(id: string) {
		if (!this.commentForm.valid) return;

		else {
			let newComment = {
				parentId: id,
				authorId: localStorage.getItem('userId'),
				author: localStorage.getItem('username'),
				content: this.content.value
			};
			this.commentService.createComment(newComment).subscribe((res: Comment) => {
				this.comments.push(res);
			});
			this.commentForm.reset();
		}
	}

	upvote(id: string): void {
		let voterId = localStorage.getItem('postId')
		this.postService.upvote(id, voterId).subscribe((res: Post) => {
			this.post = res;
		});
	}

	downvote(id: string): void {
		let voterId = localStorage.getItem('postId')
		this.postService.downvote(id, voterId).subscribe((res: Post) => {
			this.post = res;
		});
	}

	onDelete(comment) {
		removeComment(this.comments, comment);
		function removeComment(commentList: any[], target: Comment) {
			commentList.forEach((item, index) => {
				if (item === target) {
					commentList.splice(index, 1);
					return;
				}
				else if (item.comments.length > 0) removeComment(item.comments, target);
			})
		}
	}

}
