import { Injectable, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '../../../node_modules/@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RouteService {

	hasSidenav: boolean;
	@Output() _sidebar: EventEmitter<boolean> = new EventEmitter();

	constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
	}

	// toggleSideBar(): void {
	// 	this._hideSidebar.emit(!this._hideSidebar);
	// }

	// hideSidebar(): void {
	// 	this._hideSidebar.emit(true);
	// }

	// showSidebar(): void {
	// 	this._hideSidebar.emit(false);
	// }

	// Checks if url contains '/users/' and otherwise disables sidebar
	sidenav() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd && event.url.indexOf('/users/') > -1) this.hasSidenav = true;
			else this.hasSidenav = false;
		});
	}

}