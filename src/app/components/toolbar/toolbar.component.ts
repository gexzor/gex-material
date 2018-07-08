import { RegisterComponent } from './../register/register.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Output() toggleSidenav = new EventEmitter<void>();

	constructor(private dialog: MatDialog) { }

	ngOnInit() {
	}

	openRegisterDialog(): void {
		this.dialog.open(RegisterComponent, {
			width: 'auto'
		});
	}
}
