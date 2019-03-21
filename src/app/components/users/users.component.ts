import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
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

export class UsersComponent implements OnInit {

	users: User[] = new Array<User>();
	showSidenav: boolean = true;

	constructor(private userService: UserService, private router: Router) { }

	ngOnInit() {
		this.getUsers();
	}

	getUsers(): void {
		this.userService.getUsers()
			.subscribe((users: User[]) => {
				this.users = users;
			});
	}
}
