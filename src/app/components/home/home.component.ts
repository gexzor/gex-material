import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	users: User[];
	params: Params;
	constructor(private userService: UserService) {
	}

	ngOnInit() {
		this.getUsers();
	}

	getUsers(): void {
		this.userService.getUsers().subscribe((users: User[]) => this.users = users);
	}

}
