import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { GraphComponent } from './pages/graph/graph.component';

export const routes: Routes = [
  {
    path: '',
    component: StartComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  // {
  //   path: 'graph',
  //   component: GraphComponent,
  // },
];
