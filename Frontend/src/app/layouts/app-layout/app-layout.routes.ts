import { Routes } from '@angular/router';

export const APP_LAYOUT_ROUTES: Routes = [
    { path: '', loadChildren: () => import('../../features/home/home.routes').then(m => m.HOME_ROUTES) }
];