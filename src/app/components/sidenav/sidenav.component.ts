import { Component, OnInit, NgZone } from '@angular/core';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

	private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

	links = [
		'Link 1',
		'Link 2',
		'Link 3',
		'Link 4',
		'Link 5'
	];

	constructor(zone: NgZone) {
		this.mediaMatcher.addListener(mql =>
			zone.run(() => this.mediaMatcher = mql));
	}

	ngOnInit() {
	}

	isScreenSmall(): boolean {
		return this.mediaMatcher.matches;
	}

}
