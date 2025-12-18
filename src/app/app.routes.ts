import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadComponent: () => import('./features/main/main.component').then(m => m.MainComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/main/dashboard/dashboard.component').then(m => m.DashboardComponent),
                data: { title: 'Dashboard', subtitle: 'Overview of your salon operations' }
            },
            {
                path: 'city',
                loadComponent: () => import('./features/main/city/city.component').then(m => m.CityComponent),
                data: { title: 'City Management', subtitle: 'Manage available cities' }
            },
            {
                path: 'salons',
                loadComponent: () => import('./features/main/salons/salons.component').then(m => m.SalonsComponent),
                data: { title: 'Salons', subtitle: 'Manage registered salons and their details' }
            },
            {
                path: 'users',
                loadComponent: () => import('./features/main/users/users.component').then(m => m.UsersComponent),
                data: { title: 'Users', subtitle: 'Manage system users' }
            },
            {
                path: 'coupons',
                loadComponent: () => import('./features/main/coupons/coupons.component').then(m => m.CouponsComponent),
                data: { title: 'Coupons', subtitle: 'Manage discount coupons' }
            },
            {
                path: 'memberships',
                loadComponent: () => import('./features/main/memberships/memberships.component').then(m => m.MembershipsComponent),
                data: { title: 'Memberships', subtitle: 'Manage membership plans' }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
