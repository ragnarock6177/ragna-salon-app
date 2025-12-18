import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Redirect to admin login if not authenticated
    // Using replaceUrl to prevent going back to protected route via browser back button
    router.navigate(['/auth/admin/login'], { replaceUrl: true });
    return false;
};
