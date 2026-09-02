import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth', loadComponent: () => import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./features/auth/auth.routes')
                        .then(m => m.AUTH_ROUTES)
            }
        ]
    },
    {
        path: '',
        canActivate: [authGuard], 
        loadComponent: () => 
            import('./layouts/landing-page/landing-page')
        .then(m => m.LandingPage),
        title: 'Home',
    },
    { path: '**', redirectTo: 'auth/login' },
];