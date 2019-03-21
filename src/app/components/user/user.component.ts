import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	user = new User();
	params: Params;
	isEditing: boolean;
	userId = '';
	isLoggedIn: boolean;

	constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
	}

	ngOnInit() {
		this.getFirstUser();
		this.userId = localStorage.userId;
	}

	getFirstUser(): void {
		if (this.router.url === '/profile') {
			this.userService.getUser(this.userId).subscribe((user: User) => {
				this.user = user;
			});
		}
		// Check if showing the userlist - if so then get first user
		else if (this.router.url === '/users') {
			// Maybe just get a single user in stead of the whole list
			this.userService.getUsers().subscribe(users => {
				this.user = users[0];
				this.router.navigate(['/users/', this.user._id]);
			});
		}
		// Get single user by id
		else {
			this.activatedRoute.params.subscribe((params: Params) => {
				this.params = params;
				this.userService.getUser(this.params.id).subscribe((user: User) => {
					this.user = user;
				});
			});
		}
	}

	// TODO: Error Handling
	getUser(id: string): void {
		this.userService.getUser(id).subscribe((user: User) => {
			this.user = user;
		});
	}

	editUser(): void {
		this.isEditing = !this.isEditing;
		console.log(this.isEditing);
	}

	upvote(id: string): void {
		let voterId = this.userId;
		this.userService.upvote(id, voterId).subscribe((user: User) => {
			this.user = user;
		});
	}

	downvote(id: string): void {
		let voterId = this.userId;
		this.userService.downvote(id, voterId).subscribe((user: User) => {
			this.user = user;
		});
	}


	deleteUser(id: string) {
		this.userService.deleteUser(id).subscribe(
			res => {
				this.user = null;
				this.router.navigate(['/users/']);
			},
			err => console.log(err)  // TODO: Push message through some notification service
		);
	}
}
