import { Routes } from '@angular/router';

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

    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

    { path: '**', redirectTo: 'auth/login' }
];