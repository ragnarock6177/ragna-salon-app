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
        loadComponent: () => import('./features/home/home-layout.component').then(m => m.HomeLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
                title: 'Home - Salons'
            },
            {
                path: 'detail/:id',
                loadComponent: () => import('./features/home/salon-details/salon-details.component').then(m => m.SalonDetailsComponent),
                title: 'Salon Detail'
            }
        ]
    },
    {
        path: 'admin',
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
                title: 'Dashboard',
                loadComponent: () => import('./features/main/dashboard/dashboard.component').then(m => m.DashboardComponent),
                data: {
                    title: 'Dashboard',
                    subtitle: 'Overview of your salon operations',
                    description: 'View key metrics, appointments, and salon performance at a glance.',
                    keywords: 'dashboard, salon analytics, appointments overview, salon metrics'
                }
            },
            {
                path: 'city',
                title: 'City Management',
                loadComponent: () => import('./features/main/city/city.component').then(m => m.CityComponent),
                data: {
                    title: 'City Management',
                    subtitle: 'Manage available cities',
                    description: 'Add, edit, and manage cities where your salons operate.',
                    keywords: 'city management, service areas, salon locations'
                }
            },
            {
                path: 'salons',
                title: 'Salons',
                loadComponent: () => import('./features/main/salons/salons.component').then(m => m.SalonsComponent),
                data: {
                    title: 'Salons',
                    subtitle: 'Manage registered salons and their details',
                    description: 'Manage all your salon locations, services, and business details.',
                    keywords: 'salon management, beauty salons, spa locations, salon directory'
                }
            },
            {
                path: 'salons/:id',
                title: 'Salon Details',
                loadComponent: () => import('./features/main/salons/components/salon-details/salon-details.component').then(m => m.SalonDetailsComponent),
                data: {
                    title: 'Salon Details',
                    subtitle: 'View and edit salon information',
                    description: 'Manage salon details, images, coupons, and settings.',
                    keywords: 'salon details, edit salon, salon coupons, salon images'
                }
            },
            {
                path: 'users',
                title: 'Users',
                loadComponent: () => import('./features/main/users/users.component').then(m => m.UsersComponent),
                data: {
                    title: 'Users',
                    subtitle: 'Manage system users',
                    description: 'Manage user accounts, roles, and permissions.',
                    keywords: 'user management, staff accounts, customer accounts, permissions'
                }
            },
            {
                path: 'coupons',
                title: 'Coupons',
                loadComponent: () => import('./features/main/coupons/coupons.component').then(m => m.CouponsComponent),
                data: {
                    title: 'Coupons',
                    subtitle: 'Manage discount coupons',
                    description: 'Create and manage promotional coupons and discount codes.',
                    keywords: 'discount coupons, promo codes, salon offers, promotions'
                }
            },
            {
                path: 'memberships',
                title: 'Memberships',
                loadComponent: () => import('./features/main/memberships/memberships.component').then(m => m.MembershipsComponent),
                data: {
                    title: 'Memberships',
                    subtitle: 'Manage membership plans',
                    description: 'Create and manage membership plans for loyal customers.',
                    keywords: 'membership plans, loyalty programs, subscription plans, VIP memberships'
                }
            },
            {
                path: 'scanner',
                title: 'QR Scanner',
                loadComponent: () => import('./features/main/scanner/scanner.component').then(m => m.ScannerComponent),
                data: {
                    title: 'QR Scanner',
                    subtitle: 'Scan QR codes',
                    description: 'Scan QR codes for coupons, memberships, and more.',
                    keywords: 'qr scanner, barcode scanner, scan'
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

