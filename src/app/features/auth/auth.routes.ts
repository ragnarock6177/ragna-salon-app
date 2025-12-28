import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { guestGuard } from '../../core/auth/guest.guard';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
        canActivate: [guestGuard],
        data: {
            description: 'Sign in to access your Ragna Salon account.',
            keywords: 'login, sign in, salon account, authentication'
        }
    },
    {
        path: 'admin/login',
        component: AdminLoginComponent,
        title: 'Admin Login',
        canActivate: [guestGuard],
        data: {
            description: 'Administrator login for Ragna Salon management portal.',
            keywords: 'admin login, administrator, salon management, admin portal'
        }
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

