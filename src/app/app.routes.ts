import { Routes } from '@angular/router';
import { PlayComponent } from './components/play/play.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminControlsComponent } from './components/admin-controls/admin-controls.component';

export const routes: Routes = [
  {
    path: '*',
    redirectTo: '/',
  },
  {
    path: '',
    component: RegisterComponent,
  },
  {
    path: 'play',
    component: PlayComponent,
  },
  {
    path: 'admin',
    component: AdminControlsComponent,
  },
];
