import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, LucideAngularModule, MatSnackBarModule],
  template: `
    <div class="p-6 max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-xl overflow-hidden relative">
      <!-- Background Decorations -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>

      <div class="relative z-10">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
             <lucide-icon [name]="isLoginMode() ? 'log-in' : 'user-plus'" [size]="24"></lucide-icon>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {{ isLoginMode() ? 'Welcome Back' : 'Create Account' }}
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            {{ isLoginMode() ? 'Please sign in to continue' : 'Sign up to get started' }}
          </p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div *ngIf="!isLoginMode()" class="space-y-1">
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
            <div class="relative">
              <input formControlName="name" type="text" placeholder="John Doe"
                     class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all">
              <lucide-icon name="user" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
            <div class="relative">
              <input formControlName="email" type="email" placeholder="you@example.com"
                     class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all">
              <lucide-icon name="mail" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
            <div class="relative">
              <input formControlName="password" [type]="showPassword() ? 'text' : 'password'" placeholder="••••••••"
                     class="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all">
              <lucide-icon name="lock" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
              <button type="button" (click)="togglePassword()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="18"></lucide-icon>
              </button>
            </div>
          </div>

          <button type="submit" [disabled]="form.invalid || isLoading()" 
                  class="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 mt-6">
              <span *ngIf="!isLoading()">{{ isLoginMode() ? 'Sign In' : 'Create Account' }}</span>
              <lucide-icon *ngIf="!isLoading()" [name]="isLoginMode() ? 'arrow-right' : 'user-plus'" [size]="18"></lucide-icon>
              <div *ngIf="isLoading()" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ isLoginMode() ? "Don't have an account?" : "Already have an account?" }}
            <button (click)="toggleMode()" class="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 ml-1 hover:underline outline-none">
              {{ isLoginMode() ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private snackBar = inject(MatSnackBar);

  isLoginMode = signal(true);
  showPassword = signal(false);
  isLoading = signal(false);

  form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    // Reset name validation when switching modes
    this.updateNameValidation();
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
    this.snackBar.open(message, 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' });
    this.dialogRef.close(true);
    this.isLoading.set(false);
  }

  private handleError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
    this.isLoading.set(false);
  }
}
