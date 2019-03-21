export class Post {
	_id?: string;
	authorId: string;
	author: string;
	title: string;
	subtitle?: string;
	content: string;
	upvoters?: string[];
	downvoters?: string[];
	created?: Date;
}