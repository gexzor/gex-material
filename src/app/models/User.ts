export class User {
	_id?: string;
	username: string;
	email: string;
	password: string;
	avatar: string;
	tagline?: string;
	biography?: string;
	upvoters?: string[];
	downvoters?: string[];
	created?: Date;
}