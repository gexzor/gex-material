import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { RouteService } from './services/route.service';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';
import { TodoService } from './services/todo.service';

import { AppComponent } from './app.component';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostComponent } from './components/post/post.component';
import { StopPropagationDirective } from './directives/click-stop-propagation.directive';
import { CommentComponent } from './components/comment/comment.component';
import { TodoComponent } from './components/todo/todo.component';
import { FilterTodoPipe } from './filter-todo.pipe';

// Move to app-routing.module at some point
const routes: Routes = [
	{ path: '', redirectTo: 'users', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'register', component: RegisterComponent },
	{ path: 'profile', component: UserComponent },
	{ path: 'user/:id', component: UserComponent },
	{
		path: 'users', children: [
			{
				path: '',
				children: [
					{ path: '', component: UsersComponent, outlet: 'sidenav' },
					{ path: '', component: UserComponent }
				]
			},
			{
				path: ':id',
				children: [
					{ path: '', component: UsersComponent, outlet: 'sidenav' },
					{ path: '', component: UserComponent }
				]
			}
		]
	},
	{ path: 'posts', component: PostsComponent },
	{ path: 'posts/:id', component: PostComponent },
	{ path: 'todo', component: TodoComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: '**', redirectTo: 'not-found' }
];

@NgModule({
	declarations: [
		AppComponent,
		MainContentComponent,
		RegisterComponent,
		ToolbarComponent,
		SidenavComponent,
		NotFoundComponent,
		UsersComponent,
		UserComponent,
		PostsComponent,
		PostComponent,
		LoginComponent,
		HomeComponent,
		StopPropagationDirective,
		CommentComponent,
		TodoComponent,
		FilterTodoPipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		HttpClientModule,
		RouterModule.forRoot(routes),
		FormsModule,
		ReactiveFormsModule,
		MaterialModule
	],
	exports: [
	],
	providers: [
		AuthService,
		AuthGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptorService,
			multi: true
		},
		RouteService,
		UserService,
		PostService,
		CommentService,
		TodoService
	],
	entryComponents: [
		RegisterComponent,
		LoginComponent
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
