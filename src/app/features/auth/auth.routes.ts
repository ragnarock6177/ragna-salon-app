import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login - Salon App'
    },
    {
        path: 'admin/login',
        component: AdminLoginComponent,
        title: 'Admin Login - Salon App'
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
