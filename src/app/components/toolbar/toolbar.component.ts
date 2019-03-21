import { RegisterComponent } from './../register/register.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {

	@Output() toggleSidenav = new EventEmitter<void>();
	isLoggedIn: boolean;
	hasSidenav: boolean;

	constructor(private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar, private authService: AuthService) {
		this.sidenav();
	}

	ngOnInit() {
		this.authService._isLoggedIn.subscribe(value => this.isLoggedIn = value);
		this.authService.isLoggedIn();
	}

	openRegisterDialog(): void {
		let dialog = this.dialog.open(RegisterComponent, { width: 'auto' });

		dialog.afterClosed().subscribe(result => {
			console.log('Register dialog closed', result);

			if (result) {
				this.openSnackBar('Contact added', 'Navigate')
					.onAction().subscribe(() => {
						this.router.navigate(['/users']);
					});
			}
		});
	}

	openLoginDialog(): void {
		let dialog = this.dialog.open(LoginComponent, {
			width: 'auto'
		})

		dialog.afterClosed().subscribe(result => {
			if (result) {
				this.openSnackBar('Welcome back ' + result, 'Home')
					.onAction().subscribe(() => {
						this.router.navigate(['/home']);
					});
			}
		});
	}

	openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
		return this.snackBar.open(message, action, {
			duration: 5000
		});
	}

	logout() {
		this.authService.logout();
		console.log('User logged out');
		this.router.navigate(['/home']);
	}

	// Checks if url contains '/users/' and otherwise disables sidebar
	sidenav() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				if (event.url.indexOf('/users/') > -1) {
					this.hasSidenav = true;
				}
				else {
					this.hasSidenav = false;
				}
			}
		});
	}
}
