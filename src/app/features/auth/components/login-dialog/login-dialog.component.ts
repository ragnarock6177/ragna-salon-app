import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, LucideAngularModule],
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl">
      <!-- Close Button -->
      <button (click)="close()" 
              class="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors backdrop-blur-sm">
        <lucide-icon name="x" class="w-4 h-4 md:w-5 md:h-5"></lucide-icon>
      </button>

      <!-- Main Layout: Vertical on mobile, Horizontal on desktop -->
      <div class="flex flex-col md:flex-row">
        
        <!-- Left Panel - Header/Branding -->
        <div class="relative bg-linear-to-br from-primary-600 to-primary-700 px-6 py-6 md:py-0 md:px-8 md:w-72 lg:w-80 md:flex md:flex-col md:justify-center text-white overflow-hidden shrink-0">
          <!-- Decorative Elements -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div class="relative z-10 text-center md:text-left md:py-8">
            <!-- Logo -->
            <div class="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-5">
              <div class="w-9 h-9 md:w-11 md:h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <lucide-icon name="sparkles" class="w-5 h-5 md:w-6 md:h-6 text-white"></lucide-icon>
              </div>
              <span class="text-lg md:text-xl font-bold">Ragna</span>
            </div>
            
            <h2 class="text-lg md:text-xl font-bold mb-1">
              {{ isLoginMode() ? 'Welcome Back!' : 'Join Ragna' }}
            </h2>
            <p class="text-primary-100 text-xs md:text-sm">
              {{ isLoginMode() ? 'Sign in to access your coupons' : 'Create an account to get started' }}
            </p>
            
            <!-- Features List (Desktop Only) -->
            <div class="hidden md:block space-y-2.5 mt-5 pt-5 border-t border-white/20">
              <div class="flex items-center gap-2.5 text-xs">
                <div class="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <lucide-icon name="tag" class="w-3.5 h-3.5"></lucide-icon>
                </div>
                <span>Exclusive discounts</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs">
                <div class="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <lucide-icon name="calendar" class="w-3.5 h-3.5"></lucide-icon>
                </div>
                <span>Easy booking</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs">
                <div class="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <lucide-icon name="star" class="w-3.5 h-3.5"></lucide-icon>
                </div>
                <span>Earn rewards</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Form -->
        <div class="w-full md:w-80 lg:w-96 px-5 py-5 md:px-6 md:py-6">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3.5">
            
            <!-- Name Field (Register Only) -->
            <div *ngIf="!isLoginMode()" class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
              <div class="relative group">
                <div class="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-l-lg border-r border-slate-200 dark:border-slate-700 group-focus-within:bg-primary-50 dark:group-focus-within:bg-primary-900/20 transition-colors">
                  <lucide-icon name="user" class="w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors"></lucide-icon>
                </div>
                <input formControlName="name" type="text" placeholder="John Doe"
                       class="w-full pl-12 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-sm">
              </div>
            </div>

            <!-- Email Field -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
              <div class="relative group">
                <div class="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-l-lg border-r border-slate-200 dark:border-slate-700 group-focus-within:bg-primary-50 dark:group-focus-within:bg-primary-900/20 transition-colors">
                  <lucide-icon name="mail" class="w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors"></lucide-icon>
                </div>
                <input formControlName="email" type="email" placeholder="you@example.com"
                       class="w-full pl-12 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-sm">
              </div>
              <p *ngIf="form.get('email')?.touched && form.get('email')?.errors?.['email']" 
                 class="text-[10px] text-rose-500 flex items-center gap-1">
                <lucide-icon name="alert-circle" [size]="10"></lucide-icon>
                Please enter a valid email
              </p>
            </div>

            <!-- Password Field -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                <button *ngIf="isLoginMode()" type="button" class="text-[10px] text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Forgot?
                </button>
              </div>
              <div class="relative group">
                <div class="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-l-lg border-r border-slate-200 dark:border-slate-700 group-focus-within:bg-primary-50 dark:group-focus-within:bg-primary-900/20 transition-colors">
                  <lucide-icon name="lock" class="w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors"></lucide-icon>
                </div>
                <input formControlName="password" [type]="showPassword() ? 'text' : 'password'" placeholder="••••••••"
                       class="w-full pl-12 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-sm">
                <button type="button" (click)="togglePassword()" 
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-all">
                  <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
              <p *ngIf="form.get('password')?.touched && form.get('password')?.errors?.['minlength']" 
                 class="text-[10px] text-rose-500 flex items-center gap-1">
                <lucide-icon name="alert-circle" [size]="10"></lucide-icon>
                Minimum 6 characters
              </p>
            </div>

            <!-- Submit Button -->
            <button type="submit" [disabled]="form.invalid || isLoading()" 
                    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary-500/20 flex items-center justify-center gap-2 text-sm group mt-1">
                <span *ngIf="!isLoading()">{{ isLoginMode() ? 'Sign In' : 'Create Account' }}</span>
                <lucide-icon *ngIf="!isLoading()" name="arrow-right" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></lucide-icon>
                <div *ngIf="isLoading()" class="flex items-center gap-2">
                  <div class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  <span>Please wait...</span>
                </div>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div class="relative flex justify-center text-[10px]">
              <span class="bg-white dark:bg-slate-900 px-2 text-slate-400">or</span>
            </div>
          </div>

          <!-- Social Login Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button type="button" 
                    class="flex items-center justify-center gap-1.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 text-xs font-medium">
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" 
                    class="flex items-center justify-center gap-1.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 text-xs font-medium">
              <lucide-icon name="phone" class="w-4 h-4"></lucide-icon>
              Phone
            </button>
          </div>

          <!-- Toggle Mode -->
          <div class="mt-4 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ isLoginMode() ? "Don't have an account?" : "Already have an account?" }}
              <button (click)="toggleMode()" class="font-bold text-primary-600 dark:text-primary-400 hover:underline ml-1">
                {{ isLoginMode() ? 'Sign up' : 'Sign in' }}
              </button>
            </p>
          </div>

          <!-- Terms -->
          <p class="mt-3 text-[9px] text-slate-400 text-center">
            By continuing, you agree to our 
            <a href="#" class="text-primary-600 hover:underline">Terms</a> 
            & 
            <a href="#" class="text-primary-600 hover:underline">Privacy</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private toast = inject(ToastService);

  isLoginMode = signal(true);
  showPassword = signal(false);
  isLoading = signal(false);

  form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    this.updateNameValidation();
  }

  close() {
    this.dialogRef.close(false);
  }

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.updateNameValidation();
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  private updateNameValidation() {
    const nameControl = this.form.get('name');
    if (this.isLoginMode()) {
      nameControl?.clearValidators();
    } else {
      nameControl?.setValidators([Validators.required]);
    }
    nameControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { name, email, password } = this.form.value;

    if (this.isLoginMode()) {
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => this.handleSuccess('Welcome back!'),
        error: (err) => this.handleError('Invalid credentials')
      });
    } else {
      this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
        next: () => this.handleSuccess('Account created successfully!'),
        error: (err) => this.handleError(err.error?.message || 'Registration failed')
      });
    }
  }

  private handleSuccess(message: string) {
    // this.snackBar.open(message, 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' });
    this.dialogRef.close(true);
    this.isLoading.set(false);
  }

  private handleError(message: string) {
    this.toast.error(message);
    this.isLoading.set(false);
  }
}
