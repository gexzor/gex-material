import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '../../../../node_modules/@angular/router';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

	private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
	isLoggedIn: boolean;
	hasSidenav: boolean = false;

	constructor(zone: NgZone, private router: Router) {
		this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));
	}

	ngOnInit() {
		this.sidenav();
	}

	isScreenSmall(): boolean {
		return this.mediaMatcher.matches;
	}

	sidenav() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.hasSidenav = event.url.includes('/users/');
			}
		});
	}
}
