import { Routes } from '@angular/router';
import { GraphComponent } from './pages/graph/graph.component';
import { NumberComponent } from './pages/number/number.component';

export const routes: Routes = [
  {
    path: '',
    component: GraphComponent,
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  { path: 'number', component: NumberComponent },
];
