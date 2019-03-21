export class Comment {
	_id?: string;
	parentId: string;
	authorId: string;
	author: string;
	content: string;
	upvoters?: string[];
	downvoters?: string[];
	comments?: string[];
	created?: Date;
}