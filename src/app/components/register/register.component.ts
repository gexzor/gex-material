import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { matchOtherValidator } from './match-other-validator';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

	regForm: FormGroup;

	constructor(private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.regForm = this.formBuilder.group({
			username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
			repeat: ['', [Validators.required, matchOtherValidator('password')]]
		});
	}

	get username() { return this.regForm.get('username'); }
	get email() { return this.regForm.get('email'); }
	get password() { return this.regForm.get('password'); }
	get repeat() { return this.regForm.get('repeat'); }

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
					this.repeat.value !== this.password.value ? 'Password mismatch' : ''
		};

		return errorMsg;
	}

}
