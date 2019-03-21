import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '../../../../node_modules/@angular/material';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	hide: boolean = true;

	constructor(private formBuilder: FormBuilder, private authService: AuthService, public dialogRef: MatDialogRef<LoginComponent>) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
		});
	}

	get email() { return this.loginForm.get('email'); }
	get password() { return this.loginForm.get('password'); }

	getErrorMessage() {
		const errorMsg = {
			emailError: this.email.hasError('required') ? 'Username is required' :
				this.email.hasError('email') ? 'Invalid email format' : '',
			passwordError: this.password.hasError('required') ? 'Password is required' :
				this.password.hasError('minlength') ? 'Miniumum 8 characters' :
					this.password.hasError('maxlength') ? 'Maximum 30 characters' : '',
		};
		return errorMsg;
	}

	login() {
		this.authService.login(this.email.value, this.password.value)
			.subscribe(response => {
				console.log(response);
				localStorage.setItem('token', response.token);
				localStorage.setItem('userId', response.userId);
				localStorage.setItem('username', response.username);
				this.dialogRef.close(this.email.value);
			},
				error => console.log(error)
			);
	}

	reset() {
		this.loginForm.reset();
	}
}
