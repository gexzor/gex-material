import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { matchOtherValidator } from './match-other-validator';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '@angular/material';
import { User } from '../../models/User';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
	regForm: FormGroup;
	hide: boolean = true;
	user: User = new User();
	avatars = [
		'svg-1', 'svg-2', 'svg-3', 'svg-4', 'svg-5', 'svg-6', 'svg-7'
	];

	constructor(private formBuilder: FormBuilder, private authService: AuthService, public dialogRef: MatDialogRef<RegisterComponent>) { }

	ngOnInit() {
		this.regForm = this.formBuilder.group({
			username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
			repeat: ['', [Validators.required, matchOtherValidator('password')]],
			tagline: ['', [Validators.maxLength(35)]]
		});
	}

	get username() { return this.regForm.get('username'); }
	get email() { return this.regForm.get('email'); }
	get password() { return this.regForm.get('password'); }
	get repeat() { return this.regForm.get('repeat'); }
	get tagline() { return this.regForm.get('tagline'); }


	getErrorMessage() {
		const errorMsg = {

			usernameError: this.username.hasError('required') ? 'Username is required' :
				this.username.hasError('minlength') ? 'Miniumum 3 characters' :
					this.username.hasError('maxlength') ? 'Maximum 30 characters' : '',

			emailError: this.email.hasError('required') ? 'E-mail is required' : this.email.hasError('email') ? 'Invalid e-mail format' : '',

			passwordError: this.password.hasError('required') ? 'Password is required' :
				this.password.hasError('minlength') ? 'Miniumum 8 characters' :
					this.password.hasError('maxlength') ? 'Maximum 30 characters' : '',

			repeatError: this.repeat.hasError('required') ? 'Repeat your password' :
				this.password.hasError('required') ? 'Password required' :
					this.repeat.value !== this.password.value ? 'Password mismatch' : '',

			taglineError: this.tagline.hasError('maxlength') ? 'Maximum 35 characters' : ''
		};
		return errorMsg;
	}

	register() {
		let newUser: User = {
			username: this.username.value,
			email: this.email.value,
			password: this.password.value,
			avatar: this.user.avatar,
			tagline: this.tagline.value
		};

		this.authService.register(newUser)
			.subscribe(response => {
				localStorage.setItem('token', response.token);
				this.dialogRef.close(this.username.value);
			},
				error => console.log(error)
			);
	}

	// register() {
	// 	this.authService.register(this.username.value, this.email.value, this.password.value)
	// 		.subscribe(response => {
	// 			localStorage.setItem('token', response.token);
	// 			this.dialogRef.close(this.username.value);
	// 		},
	// 			error => console.log(error)
	// 		);
	// }

	reset() {
		this.regForm.reset();
	}

}
