export type TaskPriority = 'low' | 'medium' | 'high';

export interface IListItems {
  id: string;
  checked: boolean;
  value: string;
  priority: TaskPriority;
  createdAt: number;
}
