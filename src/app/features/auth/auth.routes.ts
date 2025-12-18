import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { guestGuard } from '../../core/auth/guest.guard';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login - Salon App',
        canActivate: [guestGuard]
    },
    {
        path: 'admin/login',
        component: AdminLoginComponent,
        title: 'Admin Login - Salon App',
        canActivate: [guestGuard]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
