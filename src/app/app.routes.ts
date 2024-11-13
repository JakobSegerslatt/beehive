import { Routes } from '@angular/router';
import { PlayComponent } from './components/play/play.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminControlsComponent } from './components/admin-controls/admin-controls.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '*',
    redirectTo: '/',
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'play/:id',
    component: PlayComponent,
  },
  {
    path: 'admin/:id',
    component: AdminControlsComponent,
  },
];
