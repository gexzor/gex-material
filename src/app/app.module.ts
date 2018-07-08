import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
	{ path: '', redirectTo: 'main-content', pathMatch: 'full' },
	{ path: 'register', component: RegisterComponent, pathMatch: 'full' },
	{ path: 'main-content', component: MainContentComponent, pathMatch: 'full' },
	{ path: '**', redirectTo: 'main-content' },
];

@NgModule({
	declarations: [
		AppComponent,
		ToolbarComponent,
		MainContentComponent,
		SidenavComponent,
		RegisterComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(routes),
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
	],
	exports: [
	],
	providers: [
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
