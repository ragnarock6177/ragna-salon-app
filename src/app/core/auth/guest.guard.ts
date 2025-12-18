import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // If user is already logged in, redirect to dashboard
        router.navigate(['/'], { replaceUrl: true });
        return false;
    }

    return true;
};
