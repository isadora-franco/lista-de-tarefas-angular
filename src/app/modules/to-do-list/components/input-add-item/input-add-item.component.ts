import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';

//interfaces
import { NgClass } from '@angular/common';
import { IListItems, TaskPriority } from '../../interface/IListItems.iterface';

@Component({
  selector: 'app-input-add-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './input-add-item.component.html',
  styleUrl: './input-add-item.component.scss',
})
export class InputAddItemComponent {
  #cdr = inject(ChangeDetectorRef);

  @ViewChild('inputText') public inputText!: ElementRef<HTMLInputElement>;

  @Input({ required: true }) public inputListItems: IListItems[] = [];

  @Output() public outputAddListItem = new EventEmitter<IListItems>();

  public selectedPriority: TaskPriority = 'medium';

  public priorityOptions: { value: TaskPriority; label: string; hint: string }[] = [
    {
      value: 'low',
      label: 'Em prazo',
      hint: 'Tarefa tranquila, sem urgência imediata',
    },
    {
      value: 'medium',
      label: 'Hoje',
      hint: 'Tarefa para resolver ainda hoje',
    },
    {
      value: 'high',
      label: 'Urgente',
      hint: 'Prioridade alta, precisa de atenção rápida',
    },
  ];

  public selectPriority(priority: TaskPriority) {
    this.selectedPriority = priority;
  }

  public focusAndAddItem(value: string) {
    const cleanValue = value.trim();

    if (cleanValue) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';

      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const id = `ID ${timestamp}`;

      this.outputAddListItem.emit({
        id,
        checked: false,
        value: cleanValue,
        priority: this.selectedPriority,
        createdAt: timestamp,
      });

      this.selectedPriority = 'medium';

      return this.inputText.nativeElement.focus();
    }

    return this.inputText.nativeElement.focus();
  }
}
