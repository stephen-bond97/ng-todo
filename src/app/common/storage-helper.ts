import { Injectable } from '@angular/core';

import { TodoItemStatus } from 'src/enums';

// This class acts as a singleton and can be injected into any component
@Injectable()
export class StorageHelper {

	private todoItems: TodoItem[];

	/**
	 *
	 */
	constructor() {
		this.todoItems = this.readLocalStorage();

		let today = new Date();
		today.setHours(0, 0, 0, 0);

		this.todoItems.forEach(item => {
			if (today > new Date(item.Modified)) {

				if (item.Status == TodoItemStatus.Paused) {
					item.Status = TodoItemStatus.Active;
				} else if (item.Status == TodoItemStatus.Completed) {
					item.Status = TodoItemStatus.Removed;
				}
			}
		});

		this.todoItems = this.todoItems.filter(item => item.Status != TodoItemStatus.Removed);

		this.writeLocalStorage(this.todoItems);
	}

	public get TodoItems(): TodoItem[] {
		return this.todoItems;
	}

	public AddNewItem(title: string): TodoItem {
		let newItem: TodoItem = {
			Id: this.generateId(),
			Title: title,
			Status: TodoItemStatus.Active,
			Modified: new Date()
		};

		this.TodoItems.push(newItem);
		this.writeLocalStorage(this.TodoItems);

		return newItem;
	}

	public UpdateItem(id: string, status: TodoItemStatus): void {
		let itemToUpdate = this.TodoItems.find(item => item.Id == id);

		if (itemToUpdate === undefined) {
			return;
		}

		if (itemToUpdate) {
			if (status == TodoItemStatus.Removed) {
				let index = this.TodoItems.indexOf(itemToUpdate, 0);
				if (index > -1) {
					this.TodoItems.splice(index, 1);
				}
			}

			itemToUpdate.Status = status;
			itemToUpdate.Modified = new Date();
			itemToUpdate.Modified.setHours(0, 0, 0, 0);
		}

		this.writeLocalStorage(this.TodoItems);
	}

	private readLocalStorage(): TodoItem[] {
		let savedItems = localStorage.getItem('ng-todo-items');
		if (savedItems != null) {
			return JSON.parse(savedItems);
		}
		else {
			return [];
		}
	}

	private writeLocalStorage(items: TodoItem[]): void {
		localStorage.setItem('ng-todo-items', JSON.stringify(items));
	}

	private generateId(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}