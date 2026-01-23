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
    <div class="p-6 max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-xl">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p class="text-slate-500 dark:text-slate-400">Please sign in to complete your purchase</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="login()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input formControlName="email" type="email" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input formControlName="password" type="password" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all">
        </div>

        <button type="submit" [disabled]="form.invalid || isLoading()" class="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
            <span *ngIf="!isLoading()">Sign In</span>
            <div *ngIf="isLoading()" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        </button>
      </form>
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

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = signal(false);

  login() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.form.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Invalid credentials', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }
}
