import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    // Signals for reactive state
    currentUser = signal<User | null>(null);
    isLoading = signal<boolean>(false);
    isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

    // Derive auth URL from environment
    // env.apiUrl is '.../api/admin', we want '.../api/auth'
    private readonly AUTH_API = environment.apiUrl.replace('/admin', '/auth');

    constructor() {
        this.checkAuth();
    }

    private checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            this.getProfile().subscribe({
                // error: () => this.logout()
            });
        }
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        this.isLoading.set(true);
        return this.http.post<any>(`${this.AUTH_API}/login`, credentials).pipe(
            tap(response => {
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    this.currentUser.set(response.data.user);
                    this.isAuthenticated.set(true);
                }
            }),
            catchError(error => {
                console.error('Login failed', error);
                return throwError(() => error);
            }),
            tap(() => this.isLoading.set(false))
        );
    }

    getProfile(): Observable<User> {
        return this.http.get<User>(`${this.AUTH_API}/profile`).pipe(
            tap(user => {
                this.currentUser.set(user);
                this.isAuthenticated.set(true);
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/auth/login']);
    }
}
