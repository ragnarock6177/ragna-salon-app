import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    // Clone request and attach Bearer token if available
    const clonedReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Clear token from storage to avoid circular dep with AuthService
                localStorage.removeItem('token');
                // Navigate to login — AuthService signals will reset on next init
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        })
    );
};
