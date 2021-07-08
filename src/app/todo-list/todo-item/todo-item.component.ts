import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { TodoItemStatus } from 'src/enums';

@Component({
	selector: 'todo-item',
	templateUrl: './todo-item.component.html',
	styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

	@Input()
	public IsNewItem: boolean = false;

	@Input()
	public TodoItem: TodoItem = { Id: '', Title: '', Status: TodoItemStatus.Active };

	@Output()
	public AddNewItem = new EventEmitter<string>();

	@Output()
	public UpdateItem = new EventEmitter<TodoItemStatus>();

	public IsSelected: boolean = false;
	public TodoItemStatus: typeof TodoItemStatus = TodoItemStatus;

	public constructor(private elementRef: ElementRef) { }

	public SelectItem(): void {
		this.IsSelected = true;
	}

	public HandleAddClick(): void {
		this.addItem();
	}

	public HandleEnterKeyPress(event: KeyboardEvent): void {

		// remove focus from the text input (hides keyboard on mobile devices)
		let inputField: HTMLInputElement = event.target as HTMLInputElement;
		inputField.blur();

		this.addItem();
	}

	public HandleUpdateClick(status: TodoItemStatus): void {
		this.UpdateItem.emit(status);
	}

	private addItem(): void {
		// should only fire the event to add the item if a valid title has been entered
		if (this.TodoItem.Title) {
			this.AddNewItem.emit(this.TodoItem.Title);

			// reset the textbox
			this.TodoItem = { Id: '', Title: '', Status: TodoItemStatus.Active };
		}
	}

	@HostListener('document:click', ['$event'])
	private clickAnywhere(event: MouseEvent): void {
		if (this.IsSelected && !this.elementRef.nativeElement.contains(event.target)) {
			this.IsSelected = false;
		}
	}
}