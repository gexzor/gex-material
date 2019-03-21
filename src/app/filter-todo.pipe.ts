import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterTodo'
})
export class FilterTodoPipe implements PipeTransform {

	transform(todoList: any[], searchInput: string): any {
		if (!todoList) return null;
		if (!searchInput) return todoList;
		return todoList.filter(n => n.title.indexOf(searchInput) >= 0);
	}

}
