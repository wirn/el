import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
];
// {
//   path: 'graph',
//   component: GraphComponent,
// },
