import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { StopsPage } from './pages/stops/stops.page';
import { StopDetailPage } from './pages/stop-detail/stop-detail.page';
import { StopNewPage } from './pages/stop-new/stop-new.page';
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'app/stops', component: StopsPage },
  { path: 'app/stops/new', component: StopNewPage },
  { path: 'app/stops/:id', component: StopDetailPage },
  { path: '**', redirectTo: '' },
];
