import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        LucideAngularModule
    ],
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
    loginForm: FormGroup;
    isLoading = signal(false);
    hidePassword = signal(true);
    errorMessage = signal<string | null>(null);

    private authService = inject(AuthService);

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    togglePasswordVisibility(event: MouseEvent) {
        event.preventDefault();
        this.hidePassword.update(value => !value);
    }

    login() {
        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const { email, password } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err: any) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Invalid credentials. Please try again.');
            }
        });
    }
}
