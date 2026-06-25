import { Component, computed, signal } from '@angular/core';
import Swal from 'sweetalert2';

// Components
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';

// Interface
import { IListItems, TaskPriority } from '../../interface/IListItems.iterface';

// Enum
import { ELocalStorage } from '../../enum/ELocalStorage.enum';

type TaskFilter = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  public addItem = signal(true);
  public activeFilter = signal<TaskFilter>('all');

  public filterOptions: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' },
  ];

  #setListItems = signal<IListItems[]>(this.#parseItems());
  public getListItems = this.#setListItems.asReadonly();

  public pendingItems = computed(() =>
    this.getListItems().filter((item: IListItems) => !item.checked)
  );

  public completedItems = computed(() =>
    this.getListItems().filter((item: IListItems) => item.checked)
  );

  public progressPercentage = computed(() => {
    const total = this.getListItems().length;

    if (!total) {
      return 0;
    }

    return Math.round((this.completedItems().length / total) * 100);
  });

  public focusItem = computed(() => {
    const pendingItems = this.pendingItems();

    return (
      pendingItems.find((item: IListItems) => item.priority === 'high') ||
      pendingItems.find((item: IListItems) => item.priority === 'medium') ||
      pendingItems[0]
    );
  });

  public visibleItems = computed(() => {
    const filter = this.activeFilter();

    if (filter === 'pending') {
      return this.pendingItems();
    }

    if (filter === 'completed') {
      return this.completedItems();
    }

    return this.getListItems();
  });

  #parseItems(): IListItems[] {
    const parsedItems = JSON.parse(
      localStorage.getItem(ELocalStorage.MY_LIST) || '[]'
    ) as Partial<IListItems>[];

    return parsedItems.map((item, index) => this.#normalizeItem(item, index));
  }

  #normalizeItem(item: Partial<IListItems>, index: number): IListItems {
    const createdAt = item.createdAt || Date.now() + index;

    return {
      id: item.id || `ID ${createdAt}`,
      checked: Boolean(item.checked),
      value: item.value || '',
      priority: this.#isValidPriority(item.priority) ? item.priority : 'medium',
      createdAt,
    };
  }

  #isValidPriority(priority?: TaskPriority): priority is TaskPriority {
    return priority === 'low' || priority === 'medium' || priority === 'high';
  }

  #updateLocalStorage() {
    return localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify(this.#setListItems())
    );
  }

  public getInputAndAddItem(value: IListItems) {
    this.#setListItems.update((oldValue: IListItems[]) => [...oldValue, value]);

    this.#updateLocalStorage();
  }

  public listItemsStage(value: 'pending' | 'completed') {
    if (value === 'pending') {
      return this.pendingItems();
    }

    return this.completedItems();
  }

  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItems[]) =>
      oldValue.map((item) =>
        item.id === newItem.id ? { ...item, checked: newItem.checked } : item
      )
    );

    return this.#updateLocalStorage();
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItems.update((oldValue: IListItems[]) =>
      oldValue.map((item) =>
        item.id === newItem.id ? { ...item, value: newItem.value } : item
      )
    );

    return this.#updateLocalStorage();
  }

  public deleteItem(id: string) {
    Swal.fire({
      title: 'Remover tarefa?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[]) => {
          return oldValue.filter((res) => res.id !== id);
        });

        return this.#updateLocalStorage();
      }

      return null;
    });
  }

  public deleteCompletedItems() {
    Swal.fire({
      title: 'Limpar concluídas?',
      text: 'Somente as tarefas finalizadas serão removidas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[]) =>
          oldValue.filter((item) => !item.checked)
        );

        return this.#updateLocalStorage();
      }

      return null;
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: 'Apagar toda a lista?',
      text: 'Todas as tarefas serão removidas do navegador.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar tudo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST);
        this.activeFilter.set('all');
        return this.#setListItems.set(this.#parseItems());
      }

      return null;
    });
  }
}
