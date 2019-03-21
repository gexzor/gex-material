import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Comment } from 'src/app/models/Comment';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from './../../services/comment.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'app-comment',
	templateUrl: './comment.component.html',
	styleUrls: ['./comment.component.scss'],
	animations: [
		trigger('collapse', [
			state('in', style({ overflowY: 'hidden', display: 'block' })),
			transition('void => *', [
				style({ opacity: 0, height: 0 }),
				animate('500ms ease-out')
			]),
			transition('* => void', [
				animate('500ms ease-in', style({ opacity: 1, height: 'auto' }))
			])
		])
	]
})

export class CommentComponent implements OnInit {
	@Input() comment;
	@ViewChild('resetDir') resetDir; // Somehow needed to properly reset validators on .reset()
	@Output() _createComment = new EventEmitter<Comment>();
	@Output() _deleteComment = new EventEmitter<Comment>();
	comments: Comment[];
	isLoggedIn: boolean;
	isReplying: boolean;
	commentForm: FormGroup;

	currentComment: Comment;

	constructor(private commentService: CommentService, private formBuilder: FormBuilder, private authService: AuthService) {
		this.isLoggedIn = authService.isLoggedIn();
	}

	ngOnInit() {
		this.getComments(this.comment._id);
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

	getComments(id: string): void {
		this.commentService.getComments(id).subscribe((comments: Comment[]) => {
			this.comments = comments;
		});
	}

	toggleReply(): void {
		this.isReplying = !this.isReplying;
		console.log(this.isReplying);

		if (this.isReplying === true) this.commentForm.reset();
	}

	upvote(id: string): void {
		let voterId = localStorage.getItem('commentId')
		this.commentService.upvote(id, voterId).subscribe((res: Comment) => {
			this.comment = res;
		});
	}

	downvote(id: string): void {
		let voterId = localStorage.getItem('commentId')
		this.commentService.downvote(id, voterId).subscribe((res: Comment) => {
			this.comment = res;
		});
	}

	createComment(comment: Comment) {
		if (!this.commentForm.valid) return;
		else {
			let newComment: Comment = {
				parentId: comment._id,
				authorId: localStorage.getItem('userId'),
				author: localStorage.getItem('username'),
				content: this.content.value
			};
			this.commentService.createComment(newComment).subscribe((res: Comment) => {
				this.getComments(this.comment._id);
			});
			this.toggleReply();
		}
	}

	deleteComment(comment: Comment) {
		this.commentService.deleteComment(comment._id).subscribe(
			res => {
				console.log(res); // TODO: Push message through some notification service
				this._deleteComment.emit(comment);
			},
			err => console.log(err)  // TODO: Push message through some notification service
		);
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