import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        LucideAngularModule,
        RouterModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm: FormGroup;
    otpSent = signal(false);
    isLoading = signal(false);

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            otp: ['']
        });
    }

    get phoneNumber() {
        return this.loginForm.get('phoneNumber');
    }

    get otp() {
        return this.loginForm.get('otp');
    }

    async sendOtp() {
        if (this.phoneNumber?.invalid) return;

        this.isLoading.set(true);

        // Simulate API call
        setTimeout(() => {
            this.otpSent.set(true);
            this.otp?.setValidators([Validators.required, Validators.minLength(4)]);
            this.otp?.updateValueAndValidity();
            this.isLoading.set(false);
        }, 1500);
    }

    async verifyOtp() {
        if (this.loginForm.invalid) return;

        this.isLoading.set(true);

        // Simulate API call
        setTimeout(() => {
            this.isLoading.set(false);
            // Navigate to dashboard or home
            this.router.navigate(['/']);
        }, 1500);
    }

    reset() {
        this.otpSent.set(false);
        this.loginForm.reset();
        this.otp?.clearValidators();
        this.otp?.updateValueAndValidity();
    }
}
