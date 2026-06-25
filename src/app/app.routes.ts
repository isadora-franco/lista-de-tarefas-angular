import { Routes } from '@angular/router';

//paginas
import { ListComponent } from './modules/to-do-list/pages/list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
];
