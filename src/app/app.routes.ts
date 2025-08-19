import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { GraphComponent } from './pages/graph/graph.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  // {
  //   path: 'graph',
  //   loadComponent: () =>
  //     import('./pages/graph/graph.component').then((m) => m.GraphComponent),
  // },
  {
    path: 'graph',
    component: GraphComponent,
  },
];
// {
//   path: 'graph',
//   component: GraphComponent,
// },
