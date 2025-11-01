import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home';
import {Splash} from './pages/splash/splash';
import {Places} from './pages/places/places';

export const routes: Routes = [
  {
    path: '',
    component: Splash
  },
  {
      path: 'home',
      component: HomeComponent
  },
  {
    path: 'localizar',
    component: Places
  }

];
